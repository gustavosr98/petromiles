<template>
  <div>
    <v-container class="fill-height" fluid v-if="userData">
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
                  <user-membership :membership="membership" :isAdmin="false" ></user-membership>
                </v-col>          
                <v-col cols="11" lg="4" md="4" sm="4">
                  <user-profile-image :userData="userData" :isAdmin="false" ></user-profile-image> 
                </v-col>    
                <v-col cols="11" lg="4" md="4" sm="4">
                  <user-points :conversion="conversion" :isAdmin="false" ></user-points>
                </v-col>
              </v-row>                             
            </v-window>
            <v-window>
              <user-detail :userDetails="userData" :isAdmin="false" />  
              <change-password></change-password>  
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
import ChangePassword from "@/components/Users/changePassword.vue";
import UserProfileImage from "@/components/Users/UserProfileImage.vue";
import UserMembership from "@/components/Users/UserMembership.vue";
import UserPoints from "@/components/Users/UserPoints.vue";
import LoadingScreen from "@/components/General/LoadingScreen/LoadingScreen.vue";

export default {
  name: "user-detail-wrapper",
  components: {
    "user-profile-image": UserProfileImage,
    "user-detail": UserDetail,  
    "change-password": ChangePassword,
    "user-membership": UserMembership,
    "user-points": UserPoints,
    "loading-screen": LoadingScreen,
  },
  data(){
    return{
      userData: null,
      membership: null,
      conversion: null,
      showLoadingScreen: true,
    };
  },
  async mounted() {
    try {
      this.conversion = await this.$http.get(`user/points/conversion`);
      this.membership = await this.$http.get(`suscription/actual`);
        if(this.user){
        this.userData = this.user;        
      } 
    } catch (error) {
      console.log(error);
    }
    finally{
      this.showLoadingScreen = false;
    }                     
  },
  computed: {
      ...mapState("auth", ["user"])
  },
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