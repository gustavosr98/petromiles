<template>
  <div>
    <datatable :title="title" :headers="headers" :fetchedData="mungedData" @updateUserState="updateUserState" :isAdmin="true"/>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import Datatable from "@/components/General/Datatable/Datatable";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";
import { states } from "@/constants/state";
import auth from "@/constants/authConstants";

export default {
  name: "clients-table",
  components: {
    Datatable,
    "loading-screen": LoadingScreen,
  },
  data() {
    return {
      title: this.$tc("navbar.user", 1),
      fetchedData: [],

      headers: [
        {
          text: "ID",
          align: "start",
          value: "idUserClient",
        },
        {
          text: this.$tc("user-details.email"),
          value: "email",
        },
        {
          text: this.$tc("user-details.firstName"),
          value: "userDetails.firstName",
        },
        {
          text: this.$tc("user-details.lastName"),
          value: "userDetails.lastName",
        },
        {
          text: this.$tc("common.state"),
          value: "state",
        },
        {
          text: "User Details",
          value: "userDetails"
        }
      ],
      showLoadingScreen: true,
    };
  },
  async mounted() {
    this.fetchedData = await this.$http.get("/user/CLIENT");
    this.showLoadingScreen = false;
  },
  computed: {
    mungedData() {
      return this.fetchedData.map(data => {
        const state = {
          name: data.stateUser[0].state.name,
          translated: this.$tc(`state-name.${data.stateUser[0].state.name}`),
        };
        return {
          ...data,
          state,
        };
      });
    },
  },
  methods: {
    async updateUserState(item){
      this.showLoadingScreen = true;
      let userID = 0;      
      userID = item.idUserClient;
      if(item.state.name === states.ACTIVE.name){        
        await this.$http.post(`management/state/${userID}`, {
          state: states.BLOCKED.name,
          role: auth.CLIENT
        }).finally(() => {
          this.showLoadingScreen = false;
        });
        item.state.name = states.BLOCKED.name;
        item.state.translated = states.BLOCKED.name;
      }
      else{
        await this.$http.post(`management/state/${userID}`, {
          state: states.ACTIVE.name,
          role: auth.CLIENT
        }).finally(() => {
          this.showLoadingScreen = false;
        })
        item.state.name = states.ACTIVE.name;
        item.state.translated = states.ACTIVE.name;
      }
    }
  }
};
</script>
