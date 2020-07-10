<template>
  <div>
    <v-container class="fill-height" fluid v-if="user && userData">
      <v-row align="center" justify="center">
        <v-col cols="12" sm="11" md="9">
          <v-card class="elevation-12">
            <v-window  class="headerBackground">
              <h3 class="text-center title">{{ $t("profile.mainTitle") }}</h3>
              <v-divider></v-divider>
              <v-row
                align="center"
                justify="center"
              >
                <v-col cols="11" lg="4" md="4" sm="4">
                  <user-membership :membership="membership" :isAdmin="true"></user-membership>
                </v-col>          
                <v-col cols="11" lg="4" md="4" sm="4">
                  <user-profile-image :userData="userData" :isAdmin="true"></user-profile-image> 
                </v-col>    
                <v-col cols="11" lg="4" md="4" sm="4">
                  <user-points :conversion="conversion" :isAdmin="true"></user-points>
                </v-col>
              </v-row>                             
            </v-window>
            <v-window>
              <user-detail :userDetails="userData" :isAdmin="true" />  
            </v-window>
            <v-window>
              <bank-account-table :bankAccounts="userBankAccounts" :isAdmin="true" :clientID="user.idUserClient"/>
            </v-window>
            <v-window>
              <v-row align="center" justify="center" class="mx-auto">
                <v-col cols="12" md="10">
                  <transaction-table url="no-url" :transactionsData="transactions" :isAdmin="true" />
                </v-col>
              </v-row>
            </v-window>
          </v-card>
        </v-col>
      </v-row>         
    </v-container>
    <loading-screen :visible="showLoadingScreen"></loading-screen>
  </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import UserDetail from "@/components/Users/UserDetail.vue";
import UserProfileImage from "@/components/Users/UserProfileImage.vue";
import UserMembership from "@/components/Users/UserMembership.vue";
import UserPoints from "@/components/Users/UserPoints.vue";
import BankAccountsTable from "@/components/BankAccounts/BankAccountList/BankAccountsTable";
import TransactionTable from "@/components/Transactions/TransactionsTable";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";
export default {
  name: "user-detail-wrapper",
 components: {
    "user-profile-image": UserProfileImage,
    "user-membership": UserMembership,
    "user-points": UserPoints,
    "user-detail": UserDetail,
    "bank-account-table": BankAccountsTable,
    "transaction-table": TransactionTable,
    "loading-screen": LoadingScreen,
  },
  props: {
    user:{
      required: true,            
    }
  },
  data(){
    return{
      userData: null,
      membership: null,
      conversion: null,
      userBankAccounts: null,
      transactions: null,     
      showLoadingScreen: true,
    };
  },
  async mounted() {  
    try {
      this.conversion = await this.$http.get(`user/points/conversion?id=${this.user.idUserClient}`);
      this.membership = await this.$http.get(`suscription/actual?id=${this.user.idUserClient}`);
      this.userBankAccounts = await this.$http.get(`bank-account?id=${this.user.idUserClient}`);
      const userInformation = await this.$http.get(`user/${this.user.idUserClient}/CLIENT`);
      this.transactions = await this.$http.get(`transaction?id=${this.user.idUserClient}`);  
      const { userDetails, ...basicInformation} = userInformation;
      this.userData = {
        details: userDetails,
        ...basicInformation
      } 
    } catch (error) {
      console.log(error);
    }     
    finally {
      this.showLoadingScreen = false;    
    }             
  },  
  methods: {
    gotoUsersList(){
      
    }
  }
};
</script>

<style lang="scss" scoped>
.title{
  padding-top: 1%;
}
.headerBackground{
  background: rgb(245,245,250);
  background: linear-gradient(90deg, rgba(245,245,250,1) 0%, rgba(242,245,246,1) 10%, rgba(242,245,246,1) 90%, rgba(247,247,247,1) 100%);
}
</style>