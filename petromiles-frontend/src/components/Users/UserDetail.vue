<template>
  <div v-if="userDetails !== null">              
    <v-divider></v-divider>
    <br/>
    <h3 class="text-center">{{ $t("profile.PersonalInformation") }}</h3>     
    
    <v-row
      align="center"
      justify="center"
    >      
      <v-col cols="11" lg="4" md="4" sm="4">                
        <v-text-field
          v-model="userData.details.firstName"
          :label="$t('user-details.firstName')"
          prepend-icon="person"
          type="text"
          color="light-blue darken-4"   
          @change="$v.userData.details.firstName.$touch()"
          @blur="$v.userData.details.firstName.$touch()"
          :error-messages="firstNameErrors"  
          v-on:keypress="validateMaxChars($event, userData.details.firstName)"               
        ></v-text-field>     
        <v-text-field
          v-model="userData.details.middleName"
          :label="$t('user-details.middleName')"
          name="MiddleName"          
          prepend-icon="person"
          type="text"
          color="light-blue darken-4"
          v-on:keypress="validateMaxChars($event, userData.details.middleName)"                             
        ></v-text-field>   
        <v-text-field
          v-model="userData.details.lastName"
          :label="$t('user-details.lastName')"
          name="Last Name"
          prepend-icon="person"
          type="text"
          color="light-blue darken-4"
          @change="$v.userData.details.lastName.$touch()"
          @blur="$v.userData.details.lastName.$touch()"
          :error-messages="lastNameErrors"    
          v-on:keypress="validateMaxChars($event, userData.details.lastName)"                
        ></v-text-field>   
        <v-text-field
          v-model="userData.details.secondLastName"
          :label="$t('user-details.secondLastName')"
          name="Last Name"
          prepend-icon="person"
          type="text"
          color="light-blue darken-4"   
          v-on:keypress="validateMaxChars($event, userData.details.secondLastName)"                 
        ></v-text-field>      
        <v-text-field
          v-model="userData.email"
          :label="$t('user-details.email')"
          name="Email"          
          prepend-icon="email"
          type="text"
          color="light-blue darken-4"
          @change="$v.userDataemail.$touch()"
          @blur="$v.userData.email.$touch()"
          :error-messages="emailErrors"  
          :disabled="true"                            
        ></v-text-field>                
      </v-col>

      <v-col cols="11" lg="4" md="4" sm="4">                                                       
        <v-text-field           
          v-model="birthdate"
          class="fontSize dateOfBirthPosition"
          :label="$t('user-details.dateOfBirth')"
          prepend-icon= "mdi-calendar-blank-outline"                        
          type="date"          
          :max="maxDate"
          :min="minDate"
        >
        </v-text-field>
        <v-text-field
          v-model="userData.details.phone"
          :label="$t('user-details.phone')"
          name="Phone number"          
          prepend-icon="mdi-cellphone-android"
          type="number"
          color="light-blue darken-4"  
          v-on:keypress="restrictChars($event)"                            
        ></v-text-field>   
        <v-autocomplete  
          return-object               
          v-model="userData.details.country"          
          :item-text="item => $t(`countries.${item.name}`)"
          prepend-icon= "mdi-map-marker"
          :label="$t('user-details.Country')"          
          :items="countries"                                             
          >
        </v-autocomplete>
        <v-text-field
          v-model="userData.details.address"
          :label="$t('user-details.address')"
          name="Address"          
          prepend-icon="home"
          type="text"
          color="light-blue darken-4"  
          v-on:keypress="validateMaxChars($event, userData.details.address)"                            
        ></v-text-field> 
      </v-col>

    </v-row>

    <v-row
      align="center"
      justify="center"
    >
      <v-col class="text-center">
        <v-btn
          color="error"
          style="margin-right: 1%"
          @click="resetValues"
          :disabled="loading"
        >
          {{ $t("profile.ResetValues") }}
        </v-btn>            
        <v-btn
          color="primary"
          @click="checkingValidForm"
          :loading="loading"
        >
          {{ $t("common.Save") }}
        </v-btn>        
        <snackbar @close="closeSnackbar" :show="snackbar" :text="text"></snackbar>
      </v-col>
    </v-row>      
  </div>
  
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");
import ProfileImg from "@/assets/perfil.jpg";
import { validationMixin } from "vuelidate";
import Snackbar from "@/components/General/Snackbar/Snackbar.vue";
import {
  required,
  maxLength,
  email,
  minLength,
} from "vuelidate/lib/validators";
import { type } from 'os';
export default {
  name: "user-detail",  
  mixins: [validationMixin],
  components: {       
    "snackbar": Snackbar
  },
  props: {
    userDetails: {
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true,
    }
  },
  data() {
    return { 
      userData: {
        details: {
          address: "",
          birthdate: "",
          country: {},
          firstName: "",
          lastName: "",
          middleName: "",
          phone: "",
          secondLastName: "",
        },
        email: "",  
        role: "",
        id: 0
      },        
      birthdate: "",
      showPassword: false,      
      userCountry: {},
      countries: [],
      maxDate: this.getMaxDatePicker(),
      minDate: "1950-01-01",
      loading: false,
      snackbar: false,
      text: "",
      timeout: 20000
    };
  },
  validations: {
    userData: {
      details: {
        firstName: { required },
        lastName: { required },
      },
      email: { required, email },
    },        
  },  
  methods: {   
    ...mapActions(["updateUserData"]),     
    resetValues(){      
      if(this.userDetails !== null){                
        const user = JSON.parse(JSON.stringify(this.userDetails));        
        const { userClient, ...details } = user.details;
        this.userData.details = details;
        this.userData.email = this.userDetails.email;
        this.userData.role = this.userDetails.role;
        this.userData.id = this.userDetails.id;
        if(this.userData.details.birthdate !== null && this.userData.details.birthdate !== ""){
          this.birthdate = this.userData.details.birthdate.split("T")[0];
        }
        else {
          this.birthdate = null;
        }
      }      
    },
    checkingValidForm(){
      this.$v.$touch();    
      if (!this.$v.$invalid && this.dataChanged()){
        this.loading = true;
        this.saveUserData();
      }      
    },
    dataChanged(){
      if(this.userData.details.address !== this.userDetails.details.address || this.birthdateChanged() || this.countryChanged(this.userData.details.country, this.userDetails.details.country) || this.userData.details.firstName !== this.userDetails.details.firstName || this.userData.details.lastName !== this.userDetails.details.lastName || this.userData.details.middleName !== this.userDetails.details.middleName || this.userData.details.phone !== this.userDetails.details.phone || this.userData.details.secondLastName !== this.userDetails.details.secondLastName || this.userData.email !== this.userDetails.email){
        return true;
      }
      return false;
    },
    birthdateChanged(){      
      if(this.birthdate !== null && this.userDetails.details.birthdate !== null && this.birthdate !== this.userDetails.details.birthdate.split("T")[0]){               
        return true;        
      }
      else if((this.birthdate !== null && this.userDetails.details.birthdate === null) || (this.birthdate === null && this.userDetails.details.birthdate !== null)){        
        return true;
      }      
      return false;
    },
    countryChanged(newCountry, currentCountry){      
      if((currentCountry === undefined && newCountry !== undefined) || (currentCountry === null && newCountry !== null)){
        return true;
      }
      else if(((currentCountry !== undefined && newCountry !== undefined) && (currentCountry !== null && newCountry !== null)) && currentCountry.name !== newCountry.name){
        return true;
      }
      return false;
    },
    async saveUserData(){ 
      try {
        if(this.birthdate !== ""){
          this.userData.details.birthdate = this.birthdate;
        }
        await this.updateUserData({          
          isAdmin: this.isAdmin,
          user: this.userData,
        });
        this.text = this.$tc("profile.UserSuccessfullyUpdated");      
        this.snackbar = true;
      } catch (error) {
        console.log(error);
      }
      finally{
        this.loading = false;
        if(!this.isAdmin){          
          this.resetValues();
        }             
        else {
          this.updateOriginalDataForAdmin();
        }  
      }                        
    },    
    updateOriginalDataForAdmin(){
      const user = JSON.parse(JSON.stringify(this.userData));   
      this.userDetails.details.address = user.details.address
      this.userDetails.details.birthdate = user.details.birthdate
      this.userDetails.details.country = user.details.country
      this.userDetails.details.firstName = user.details.firstName
      this.userDetails.details.secondLastName = user.details.secondLastName
      this.userDetails.details.lastName = user.details.lastName
      this.userDetails.details.middleName = user.details.middleName
      this.userDetails.details.phone = user.details.phone            
    },
    getMaxDatePicker(){
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 1);
      return fecha.getFullYear() + '-' + ('0' + (fecha.getMonth()+1)).slice(-2) + '-' + ('0' + fecha.getDate()).slice(-2);
    },
    closeSnackbar(){
      this.snackbar = false;
    },
    getCountries() {
      this.$http
        .get("/management/countries")
        .then(res => {
          this.countries = res;
        });
    },  
    restrictChars(event){
      if(event.charCode < 48 || event.charCode > 57 || (this.userData.details.phone !== null && this.userData.details.phone.length === 15)){
          event.preventDefault();
      }        
    },
    validateMaxChars(event, input){
      if(input !== null && input.length === 255){
        event.preventDefault();
      }
    },
  },
  mounted() {
    this.getCountries();
    this.resetValues();
  },  
  
  computed: {
    ...mapState("auth", ["user"]),       
    emailErrors() {
      const errors = [];
      if (!this.$v.userData.email.$dirty) return errors;
      !this.$v.userData.email.email && errors.push(
        `${this.$tc(
          "error-messages.ValidEmail"
        )}`        
      );
      !this.$v.userData.email.required && errors.push(
        `${this.$tc(
          "error-messages.EmailRequired"
        )}`        
      );
      return errors;
    },
    firstNameErrors() {
      const errors = [];
      if (!this.$v.userData.details.firstName.$dirty) return errors;
      !this.$v.userData.details.firstName.required && errors.push(
        `${this.$tc(
          "error-messages.FirstNameRequired"
        )}`        
      );
      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.userData.details.lastName.$dirty) return errors;
      !this.$v.userData.details.lastName.required && errors.push(
        `${this.$tc(
          "error-messages.LastNameRequired"
        )}`        
      );
      return errors;
    },               
  },
  watch: {
        userDetails: function(newValue){
            this.userDetails = newValue;
            this.resetValues();            
        },
        isAdmin: function(newValue){
          this.isAdmin = newValue;
        }
    }
};
</script>

<style scoped>
@media only screen and (max-width: 1263px) {    
    .dateOfBirthPosition{
      margin-top: -29.5%;
    }
}

@media only screen and (max-width: 959px) {
    .dateOfBirthPosition{
      margin-top: -31%;
    }
}

@media only screen and (max-width: 599px) {
    .dateOfBirthPosition{
      margin-top: -7%;
    }
}
@media only screen and (min-width: 1264px) {
    .dateOfBirthPosition{
      margin-top: -15%;
    }
}
</style>