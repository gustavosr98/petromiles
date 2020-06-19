<template>
    <div v-if="!federated">
      <br/>
      <v-divider></v-divider>
      <br/>
      <h3 class="text-center">{{ $t("profile.ChangePassword") }}</h3> 

      <v-row
        align="center"
        justify="center"
      > 
        <v-col cols="11" lg="3" md="5" sm="5" class="text-center">
            <v-text-field
              v-model="currentPassword"
              :label="$t('profile.CurrentPassword')"
              name="currentPassword"          
              prepend-icon="lock"
              :append-icon="showcurrentPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showcurrentPassword = !showcurrentPassword"
              :type="showcurrentPassword ? 'text' : 'password'"
              color="light-blue darken-4"  
              @change="$v.currentPassword.$touch()"
              @blur="$v.currentPassword.$touch()"
              :error-messages="currentPasswordErrors"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :label="$t('profile.NewPassword')"
              name="password"          
              prepend-icon="lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
              color="light-blue darken-4"  
              @change="$v.password.$touch()"
              @blur="$v.password.$touch()"
              :error-messages="passwordErrors"     
            ></v-text-field>

            <v-text-field
              v-model="confirmedNewPassword"
              :label="$t('profile.ConfirmPassword')"
              name="confirmedNewPassword"          
              prepend-icon="lock"
              :append-icon="showconfirmedNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="showconfirmedNewPassword = !showconfirmedNewPassword"
              :type="showconfirmedNewPassword ? 'text' : 'password'"
              color="light-blue darken-4"  
              @change="$v.confirmedNewPassword.$touch()"
              @blur="$v.confirmedNewPassword.$touch()"
              :error-messages="confirmedNewPasswordError"     
            ></v-text-field>
            <br/>
            <v-btn
              color="primary"
              @click="checkingValidForm"
              :loading="loading"
            >
              {{ $t("profile.ChangePassword") }}
            </v-btn>
            <snackbar @close="closeSnackbar" :show="showSnackbar" :text="message"></snackbar>
        </v-col>
      </v-row>  
    </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";
import Snackbar from "@/components/General/Snackbar/Snackbar.vue";
export default {
    name: "change-password", 
    mixins: [validationMixin],
    components: {       
        "snackbar": Snackbar
    },
    data(){
        return {
            showPassword: false, 
            showcurrentPassword: false,
            showconfirmedNewPassword: false,
            userPassword: "",
            currentPassword: "",
            password: "",
            confirmedNewPassword: "",
            loading: false,
            showSnackbar: false,
            message: "",
            federated: true,
        }
    },
    validations: {
        currentPassword: {required}, 
        password: { required, minLength: minLength(8), maxLength: maxLength(16) },    
        confirmedNewPassword: { required }    
    },
    mounted() {
        this.federated = this.user.federated;        
    },
    methods: {
      ...mapActions(["changePassword"]),
        async checkingValidForm(){        
          this.$v.$touch();
          if (!this.$v.$invalid && this.password === this.confirmedNewPassword && this.currentPassword !== this.password){
            this.loading = true;
            try {
              await this.changePassword({
                currentPassword: this.currentPassword,
                newPassword: this.password
              });
              this.message = this.$tc("profile.PasswordSuccessfullyChanged");
              this.showSnackbar = true;
            } catch (error) {
              console.log(error);
            }
            finally {
              this.loading = false;            
              this.password = "";
              this.currentPassword = "";
              this.confirmedNewPassword = ""; 
            }                        
          } 
          else if(this.currentPassword === this.password && this.password === this.confirmedNewPassword){
            this.message = this.$tc("error-messages.ErrorSamePassword");              
            this.showSnackbar = true;
          }
          else if(this.currentPassword !== ""){
            if(this.password === "") {
              this.message = this.$tc("error-messages.ErrorEnterNewPassword");              
              this.showSnackbar = true;
            }
            else if(this.confirmedNewPassword === ""){
              this.message = this.$tc("error-messages.ErrorConfirmNewPassword");
              this.showSnackbar = true;
            }
          }          
        },      
        closeSnackbar(){
            this.showSnackbar = false;
        },
    },
    computed: {
        ...mapState("auth", ["user"]),
        currentPasswordErrors() {
          const errors = [];
          if (!this.$v.currentPassword.$dirty) return errors;
          !this.$v.currentPassword.required && this.password !== "" &&
            errors.push(
              `${this.$tc(
                "error-messages.currentPasswordRequired"
              )}`              
            );         
          return errors;
        },
        passwordErrors() {
          const errors = [];
          if (!this.$v.password.$dirty) return errors;
          !this.$v.password.minLength &&
            errors.push(
              `${this.$tc(
                "error-messages.PasswordMinLength"
              )}`            
            );
          !this.$v.password.maxLength &&
            errors.push(
              `${this.$tc(
                "error-messages.PasswordMaxLength"
              )}`               
            );
          return errors;
        },
        confirmedNewPasswordError() {          
            const errors = [];
            if (!this.$v.confirmedNewPassword.$dirty) return errors;            
            this.confirmedNewPassword !== this.password &&
            errors.push(
              `${this.$tc(
                "error-messages.PasswordsAreNotEqual"
              )}`              
            );
            return errors;
        }
    }
}
</script>