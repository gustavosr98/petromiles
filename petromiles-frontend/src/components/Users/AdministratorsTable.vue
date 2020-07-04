<template>
  <datatable :title="title" :headers="headers" :fetchedData="mungedData" :userType="type" v-if="fetchedData !== []" @updateUserState="updateUserState" :isAdmin="true"/>
</template>

<script>
import Datatable from "@/components/General/Datatable/Datatable";
import auth from "@/constants/authConstants";
import { states } from "@/constants/state";

export default {
  name: "administrators-table",
  components: {
    Datatable,
  },
  data() {
    return {
      title: this.$tc("navbar.transaction", 1),
      fetchedData: [],
      headers: [
        {
          text: "ID",
          align: "start",
          value: "idUserAdministrator",
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
      ],
      type: auth.ADMINISTRATOR
    };
  },
  async mounted() {
    this.fetchedData = await this.$http.get("/user/ADMINISTRATOR");
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
      let userID = 0;      
      userID = item.idUserAdministrator;      
      if(item.state.name === states.ACTIVE.name){        
        await this.$http.post(`management/state/${userID}`, {
          state: states.BLOCKED.name,
          role: auth.ADMINISTRATOR
        });
        item.state.name = states.BLOCKED.name;
        item.state.translated = states.BLOCKED.name;
      }
      else{
        await this.$http.post(`management/state/${userID}`, {
          state: states.ACTIVE.name,
          role: auth.ADMINISTRATOR
        })
        item.state.name = states.ACTIVE.name;
        item.state.translated = states.ACTIVE.name;
      }
    }
  }
};
</script>
