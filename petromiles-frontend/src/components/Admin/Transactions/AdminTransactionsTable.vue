<template>
  <div>
    <date-range-picker @filterData="filterData" :dataToFilter="transactions" />
    <datatable
      :title="title"
      :headers="headers"
      :fetchedData="mungedData"
      linkTo="/transaction-details"
      :tableName="table.TRANSACTIONS"
    />
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import Datatable from "@/components/General/Datatable/DatatableAdmin";
import DateRangePicker from "@/components/Transactions/DateRangePicker";
import Transaction from "@/constants/transaction";
import Tables from "@/constants/table";
import PlatformInterest from "@/constants/platformInterest";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";

export default {
  name: "transactions-table",
  components: {
    Datatable,
    "date-range-picker": DateRangePicker,
    "loading-screen": LoadingScreen,
  },
  data() {
    return {
      transactions: [],
      fetchedData: [],
      table: Tables,
      showLoadingScreen: true,
    };
  },
  async mounted() {
    this.fetchedData = await this.$http
      .get("transaction/admin/list/all")
      .finally(() => {
        this.showLoadingScreen = false;
      });
    this.transactions = this.fetchedData.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      }
      if (a.id > b.id) {
        return -1;
      }
      return 0;
    });
  },

  methods: {
    filterData(filteredData) {
      this.fetchedData = filteredData;
    },
  },
  computed: {
    title() {
      return this.$tc("navbar.transaction", 1);
    },
    headers() {
      return [
        {
          text: this.$tc("common.date"),
          align: "center",
          value: "date",
        },
        {
          text: this.$tc("common.type"),
          align: "center",
          value: "translatedType",
        },
        {
          text: this.$tc("common.total", 0) + " ( $ )",
          align: "center",
          value: "transactionAmount",
        },
        {
          text: this.$t("payments.points"),
          align: "center",
          value: "points",
        },
        {
          text: this.$tc("transaction.responsible"),
          align: "center",
          value: "clientBankAccountEmail",
        },
        {
          text: this.$tc("common.state"),
          align: "center",
          value: "state",
        },
      ];
    },
    mungedData() {
      return this.fetchedData.map(data => {
        const state = {
          name: data.state,
          translated: this.$tc(`state-name.${data.state}`),
        };
        return {
          ...data,
          transactionAmount:
            data.type == Transaction.THIRD_PARTY_CLIENT
              ? `$ ${data.amount.toFixed(2)}`
              : `$ ${data.total.toFixed(2)}`,
          state,
          points: data.pointsEquivalent
            ? data.pointsEquivalent + data.extra
            : "-",
          translatedType: this.$tc(`transaction-type.${data.type}`),
        };
      });
    },
  },
};
</script>
