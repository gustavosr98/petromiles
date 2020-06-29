<template>
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
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import UserDetail from "@/components/Users/UserDetail.vue";
import UserProfileImage from "@/components/Users/UserProfileImage.vue";
import UserMembership from "@/components/Users/UserMembership.vue";
import UserPoints from "@/components/Users/UserPoints.vue";

export default {
  name: "user-detail-wrapper",
 components: {
    "user-profile-image": UserProfileImage,
    "user-membership": UserMembership,
    "user-points": UserPoints,
    "user-detail": UserDetail,
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
      conversion: null
    };
  },
  async mounted() {       
    this.conversion = await this.$http.get(`user/points/conversion?id=${this.user.idUserClient}`);
    this.membership = await this.$http.get(`suscription/actual?id=${this.user.idUserClient}`);
    const bankAccounts = await this.$http.get(`bank-account?id=${this.user.idUserClient}`);
    const userInformation = await this.$http.get(`user/${this.user.idUserClient}/CLIENT`);
    const transactions = await this.$http.get(`transaction?id=${this.user.idUserClient}`);

    //console.log("cuentas bancarias: ", bankAccounts);
    //console.log("datos usuario: ", userInformation);
    //console.log("transacciones: ", transactions);

    const { userDetails, ...basicInformation} = userInformation;
    this.userData = {
      details: userDetails,
      ...basicInformation
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