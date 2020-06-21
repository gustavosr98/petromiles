<template>
  <v-container class="fill-height" fluid>
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
                <user-membership></user-membership>
              </v-col>          
              <v-col cols="11" lg="4" md="4" sm="4">
                <user-profile-image></user-profile-image> 
              </v-col>    
              <v-col cols="11" lg="4" md="4" sm="4">
                <user-points></user-points>
              </v-col>
            </v-row>                             
          </v-window>
          <v-window>
            <user-detail/>  
            <change-password></change-password>  
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import UserDetail from "@/components/Users/UserDetail.vue";
import ChangePassword from "@/components/Users/changePassword.vue";
import UserProfileImage from "@/components/Users/UserProfileImage.vue";
import UserMembership from "@/components/Users/UserMembership.vue";
import UserPoints from "@/components/Users/UserPoints.vue";

export default {
  name: "user-detail-wrapper",
  components: {
    "user-profile-image": UserProfileImage,
    "user-detail": UserDetail,  
    "change-password": ChangePassword,
    "user-membership": UserMembership,
    "user-points": UserPoints,
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