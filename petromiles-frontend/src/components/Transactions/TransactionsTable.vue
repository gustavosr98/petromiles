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
import Datatable from "@/components/General/Datatable/Datatable";
import DateRangePicker from "@/components/Transactions/DateRangePicker";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";
import Transaction from "@/constants/transaction";
import Tables from "@/constants/table";
import PlatformInterest from "@/constants/platformInterest";

export default {
  name: "transactions-table",
  props: {
    url: { type: String, required: true },
    transactionsData: { default: null },
    isAdmin: { default: false }
  },
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
    await this.loadData();    
  },

  watch: {
    url: function() {
      this.loadData();
    },
  },
  methods: {
    filterData(filteredData) {
      this.fetchedData = filteredData;
    },
    buildHeaders() {
      const headers = [
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
          text: this.$tc("common.seeMore"),
          align: "center",
          value: "details",
        },
      ];

      if (!this.url.includes("ThirdParty"))
        headers.splice(2, 0, {
          text: this.$tc("common.type"),
          align: "center",
          value: "translatedType",
        });

      return headers;
    },
    async loadData() {      
      if(!this.isAdmin){
        this.fetchedData = await this.$http.get(this.url).finally(() => {          
          this.showLoadingScreen = false;          
        });
      }
      else {
        this.fetchedData = this.transactionsData;        
      }
      this.showLoadingScreen = false;
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
  },
  computed: {
    title() {
      return this.$tc("navbar.transaction", 1);
    },
    headers() {
      return this.buildHeaders();
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
