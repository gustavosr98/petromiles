<template>    
        <div class="text-center" v-if="memberships !== {}">
            <h3>{{ $t("profile.UserMerbershipLevel") }}</h3>
            <v-col cols="12">    
                <v-img 
                  v-if="membership.name === memberships.BASIC"
                  src="@/assets/membership/basic.png" 
                  alt="Avatar"     
                  width="140"   
                  class="center bottomSeparation"  
                  lazy-src="@/assets/general/spinner.gif"                       
                ></v-img> 
                <v-img 
                  v-if="membership.name === memberships.PREMIUM"
                  src="@/assets/membership/premium.png" 
                  alt="Avatar"     
                  width="140"   
                  class="center bottomSeparation"     
                  lazy-src="@/assets/general/spinner.gif"                       
                ></v-img>                                                                                                                          
                <v-img 
                  v-if="membership.name === memberships.GOLD"
                  src="@/assets/membership/gold.png" 
                  alt="Avatar"     
                  width="140"   
                  class="center bottomSeparation"     
                  lazy-src="@/assets/general/spinner.gif"                         
                ></v-img>    
                <router-link to="/user-subscription" style="text-decoration: none" v-if="!isAdmin">
                  <div class="mt-n10">
                    <v-btn dark color="secondary">
                      {{$t("subscription.premiumBtn")}}
                    </v-btn>
                  </div>                      
                </router-link>                            
            </v-col>   
        </div>    
</template>

<script>
import membershipConstants from "@/constants/memberships";
export default {
  props: {
    membership: {
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
    }
  },
  data(){
      return {          
          memberships: {},
      };
  },
  async mounted(){
    /*if(!this.isAdmin){
      this.membership = await this.$http.get("suscription/actual");        
    } */     
    this.memberships = membershipConstants;
  }
}
</script>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
.bottomSeparation{
  margin-bottom: 15%;
}
</style>