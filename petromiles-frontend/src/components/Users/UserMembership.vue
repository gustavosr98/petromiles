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
                ></v-img> 
                <v-img 
                  v-if="membership.name === memberships.PREMIUM"
                  src="@/assets/membership/premium.png" 
                  alt="Avatar"     
                  width="140"   
                  class="center bottomSeparation"                            
                ></v-img>                                                                                                                          
                <v-img 
                  v-if="membership.name === memberships.GOLD"
                  src="@/assets/membership/gold.png" 
                  alt="Avatar"     
                  width="140"   
                  class="center bottomSeparation"                              
                ></v-img>                
            </v-col>                        
        </div>    
</template>

<script>
import membershipConstants from "@/constants/memberships";
export default {
    data(){
        return {
            membership: "",
            memberships: {},
        };
    },
    async mounted(){
        this.membership = await this.$http.get("suscription/actual");
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