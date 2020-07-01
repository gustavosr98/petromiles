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
  </div>
</template>

<script>
import Datatable from "@/components/General/Datatable/DatatableAdmin";
import DateRangePicker from "@/components/Transactions/DateRangePicker";
import Transaction from "@/constants/transaction";
import Tables from "@/constants/table";
import PlatformInterest from "@/constants/platformInterest";

export default {
  name: "transactions-table",
  components: {
    Datatable,
    "date-range-picker": DateRangePicker,
  },
  data() {
    return {
      transactions: [],
      fetchedData: [],
      table: Tables,
    };
  },
  async mounted() {
    this.fetchedData = await this.$http.get("/transaction/admin/list/all");
    this.transactions = this.fetchedData;
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
          text: this.$tc("common.code"),
          align: "center",
          value: "id",
        },
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
          text: this.$tc("common.state"),
          align: "center",
          value: "state",
        },
        {
          text: "Responsable",
          align: "center",
          value: "clientBankAccountEmail",
        },
        {
          text: this.$tc("common.seeMore"),
          align: "center",
          value: "details",
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
          transactionAmount: `$ ${data.total.toFixed(2)}`,
          state,
          points: data.pointsEquivalent ? data.pointsEquivalent : "-",
          translatedType: this.$tc(`transaction-type.${data.type}`),
        };
      });
    },
  },
};
</script>
