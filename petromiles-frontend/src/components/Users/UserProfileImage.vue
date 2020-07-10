<template>
    <div v-if="userData !== null">                                
        <div class="text-center">
            <v-col cols="12">                
                <v-avatar  size="150">                                                                             
                <v-img 
                  :src="profileImg" 
                  alt="Avatar"     
                  v-if="profileImg"  
                  lazy-src="@/assets/general/spinner.gif"                                
                ></v-img>
                <v-img 
                  src="@/assets/profile/user-avatar.png" 
                  lazy-src="@/assets/general/spinner.gif"
                  alt="Avatar"     
                  v-else                                  
                ></v-img>
                </v-avatar>
            </v-col>
            <v-col cols="12">   
                <input                            
                  type="file"
                  accept="image/*"                  
                  @change="getImage($event)"                                     
                  ref="fileInput"   
                  class="notVisible"                     
                >        
            </v-col>                    
            <v-col v-if="!isAdmin">                        
                <v-btn
                  @click.native="loadImage"
                  color="primary"
                  class="saveButtonPosition"
                  :loading="loading"
                >
                    {{ $t("profile.ChangeProfileImage") }}
                </v-btn>                               
            </v-col>
            <snackbar @close="closeSnackbar" :show="showSnackbar" :text="snackbarText"></snackbar>
        </div>                                    
    </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import store from "@/store/index";
import firebase from "firebase/app";
import 'firebase/storage';
import Snackbar from "@/components/General/Snackbar/Snackbar.vue";
export default {    
    components: {       
        "snackbar": Snackbar
    },
    props: {
        userData: {            
            required: true,
            default: null
        },
        isAdmin: {
          type: Boolean,
          required: true,
        }
    },
    data(){
        return {
            profileImg: null,
            userID: 0,
            loading: false,
            showSnackbar: false,
            snackbarText: "",
        };
    },
    
    methods: {
        ...mapActions(["updateProfileImage"]),    
        loadImage(){
          this.$refs.fileInput.click();          
        },        
        async getImage(event){
            if(event.target.files[0] !== undefined){
                this.loading = true;
                const newUserProfilePhoto = event.target.files[0];
                try {
                    const imageURL = await this.uploadProfileImage(this.userID, newUserProfilePhoto); 
                    this.profileImg = imageURL;
                    await this.saveImage();  
                    this.snackbarText = this.$tc("profile.ImageSuccessfullyUpdated");                       
                    this.showSnackbar = true;                                  
                } catch (error) {
                    console.log(error);
                }   
                finally{
                    this.loading = false;
                }   
            }
        },
        async saveImage(){
            await this.updateProfileImage(this.profileImg);
        },
        closeSnackbar(){
            this.showSnackbar = false;
        },

        uploadProfileImage(userID, imageFile){
            const imageExtension = imageFile.name.split(".")[1];
            return new Promise(function (resolve, reject) {
              const storageRef = firebase
                .storage()
                .ref("images/user/" + userID + "/profile/profileImage.png");
              const uploadTask = storageRef.put(imageFile);

              uploadTask.on(
                "state_changed",
                null,
                (error) => {
                  reject(error);
                },
                async () => {
                  await uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                  });
                }
              );
            });
        }
    },   
    mounted() {
        this.profileImg = this.userData.details.photo;
        if(this.userData){
            this.userID = this.userData.details.idUserDetails;
        }
    }, 
    computed: {
        ...mapState("auth", ["user"])
    },
    watch: {
        userData: function(newValue){
            this.userData = newValue;
            this.profileImg = this.userData.details.photo;
            this.userID = this.userData.details.idUserDetails;
        }
    }
}
</script>

<style lang="scss" scoped>
.saveButtonPosition{
    margin-top: -16%;
}
.notVisible{
    display:none
}
</style>