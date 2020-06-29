<template>
  <admin-layout v-if="user">
    <user-detail-wrapper :user="user"></user-detail-wrapper>
  </admin-layout>
</template>

<script>
import AdminLayout from "@/components/Admin/AdminLayout/AdminLayout";
import UserDetailWrapper from "@/components/Admin/Users/UserDetailsWrapper";

export default {
  name: "client-details",
  components: {
    "admin-layout": AdminLayout,
    "user-detail-wrapper": UserDetailWrapper,
  },
  props: {
    user:{
      default: null
    }
  },
  mounted(){
    if(!this.user){
      this.$router.push({name: "AdminUserList"});
    }
  }
};
</script>
