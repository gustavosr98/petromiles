<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="11">
        <v-card class="elevation-12">
          <v-window class="headerBackground">
            <h3 class="text-center title">{{ $t("profile.mainTitle") }}</h3>
            <v-divider></v-divider>
            <v-row align="center" justify="center">
              <v-col cols="11" lg="4" md="4" sm="4">
                <div class="text-center">
                  <v-col cols="12">
                    <v-avatar size="150">
                      <v-img :src="profileImg" alt="Avatar" v-if="profileImg" lazy-src="@/assets/general/spinner.gif"></v-img>
                      <v-img src="@/assets/profile/user-avatar.png" alt="Avatar" lazy-src="@/assets/general/spinner.gif" v-else></v-img>
                    </v-avatar>
                  </v-col>
                  <v-col cols="12">
                    <input
                      type="file"
                      accept="image/*"
                      @change="getImage($event)"
                      ref="fileInput"
                      class="notVisible"
                    />
                  </v-col>
                  <v-col>
                    <v-btn
                      @click.native="loadImage"
                      color="primary"
                      class="saveButtonPosition"
                      :loading="loadingImage"
                      :disabled="loading"
                    >{{ $t("profile.ChangeProfileImage") }}</v-btn>
                  </v-col>
                </div>
              </v-col>
            </v-row>
          </v-window>
          <v-window>
            <div>
              <v-divider></v-divider>
              <br />
              <h3 class="text-center">{{ $t("profile.PersonalInformation") }}</h3>

              <v-row align="center" justify="center">
                <v-col cols="11" lg="4" md="4" sm="4">
                  <v-text-field
                    v-model="firstName"
                    :label="$t('user-details.firstName')"
                    prepend-icon="person"
                    type="text"
                    color="light-blue darken-4"
                    @change="$v.firstName.$touch()"
                    @blur="$v.firstName.$touch()"
                    :error-messages="firstNameErrors"
                    v-on:keypress="validateMaxChars($event, firstName)"
                  ></v-text-field>
                  <v-text-field
                    v-model="middleName"
                    :label="$t('user-details.middleName')"
                    name="MiddleName"
                    prepend-icon="person"
                    type="text"
                    color="light-blue darken-4"
                    v-on:keypress="validateMaxChars($event, middleName)"
                  ></v-text-field>
                  <v-text-field
                    v-model="lastName"
                    :label="$t('user-details.lastName')"
                    name="Last Name"
                    prepend-icon="person"
                    type="text"
                    color="light-blue darken-4"
                    @change="$v.lastName.$touch()"
                    @blur="$v.lastName.$touch()"
                    :error-messages="lastNameErrors"
                    v-on:keypress="validateMaxChars($event, lastName)"
                  ></v-text-field>
                  <v-text-field
                    v-model="secondLastName"
                    :label="$t('user-details.secondLastName')"
                    name="Second Last Name"
                    prepend-icon="person"
                    type="text"
                    color="light-blue darken-4"
                    v-on:keypress="validateMaxChars($event, secondLastName)"
                  ></v-text-field>
                  <v-text-field
                    v-model="email"
                    :label="$t('user-details.email')"
                    name="Email"
                    prepend-icon="email"
                    type="text"
                    color="light-blue darken-4"
                    @change="$v.email.$touch()"
                    @blur="$v.email.$touch()"
                    :error-messages="emailErrors"
                  ></v-text-field>
                </v-col>

                <v-col cols="11" lg="4" md="4" sm="4">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="birthdate"
                        :label="$t('user-details.dateOfBirth')"
                        prepend-icon="event"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="birthdate"
                      @input="menu2 = false"
                      :max="maxDate"
                      :min="minDate"
                    ></v-date-picker>
                  </v-menu>
                  <v-text-field
                    v-model="phone"
                    :label="$t('user-details.phone')"
                    name="Phone number"
                    prepend-icon="mdi-cellphone-android"
                    type="number"
                    color="light-blue darken-4"
                    v-on:keypress="restrictChars($event)"
                  ></v-text-field>
                  <v-autocomplete
                    return-object
                    v-model="country"
                    :item-text="item => $t(`countries.${item.name}`)"
                    prepend-icon="mdi-map-marker"
                    :label="$t('user-details.Country')"
                    :items="countries"
                  ></v-autocomplete>
                  <v-text-field
                    v-model="address"
                    :label="$t('user-details.address')"
                    name="Address"
                    prepend-icon="home"
                    type="text"
                    color="light-blue darken-4"
                    v-on:keypress="validateMaxChars($event, address)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row align="center" justify="center">
                <v-col class="text-center">
                  <v-btn
                    color="error"
                    style="margin-right: 1%"
                    @click="resetValues"
                    :disabled="loading || loadingImage"
                  >{{ $t("profile.ResetValues") }}</v-btn>
                  <v-btn
                    color="primary"
                    @click="checkingValidForm"
                    :loading="loading"
                    :disabled="loadingImage"
                  >{{ $t("common.Save") }}</v-btn>

                  <!-- Final Dialog -->
                  <v-row justify="center">
                    <v-dialog v-model="dialog" persistent max-width="50%">
                      <v-card>
                        <v-card-title class="headline">
                          {{
                          $t("create-admin.successfulCreateAdmin")
                          }}
                        </v-card-title>
                        <v-card-text>
                          {{
                          $t("create-admin.newAdminPassword")
                          }}
                          <p class="font-weight-black">{{this.password}}</p>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn
                            color="secondary"
                            dark
                            :to="{ name: comeBackRoute }"
                          >{{ $t("common.ok") }}</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import store from "@/store/index";
import firebase from "firebase/app";
import "firebase/storage";
import ProfileImg from "@/assets/perfil.jpg";
import createAdminValidationMixin from "@/mixins/admin/create-admin.mixin.js";
import adminRoutes from "@/router/adminRoutes";

export default {
  name: "create-admin-form",
  mixins: [createAdminValidationMixin],
  components: {},
  props: {
    role: { required: true, type: String },
  },
  data() {
    return {
      userID: 0,
      profileImg: null,
      imageFile: null,
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
      email: "",
      birthdate: null,
      phone: "",
      country: {},
      address: "",
      countries: [],
      maxDate: this.getMaxDatePicker(),
      minDate: "1950-01-01",
      menu2: false,
      loading: false,
      loadingImage: false,
      dialog: false,
      password: "",
      comeBackRoute: adminRoutes.USER_LIST.name,
    };
  },

  mounted() {
    this.getCountries();
    this.resetValues();
  },

  methods: {
    getCountries() {
      this.$http.get("/management/countries").then(res => {
        this.countries = res;
      });
    },
    resetValues() {
      this.firstName = "";
      this.middleName = "";
      this.lastName = "";
      this.secondLastName = "";
      this.email = "";
      this.birthdate = null;
      this.phone = "";
      this.country = {};
      this.profileImg = null;
      this.imageFile = null;
    },
    checkingValidForm() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.loading = true;
        this.saveUserData();
      }
    },
    async saveUserData() {
      this.$http
        .post("auth/signup/administrator", {
          firstName: this.firstName,
          middleName: this.middleName,
          lastName: this.lastName,
          secondLastName: this.secondLastName,
          email: this.email,
          birthdate: this.birthdate,
          phone: this.phone,
          address: this.address,
          country: this.country,
        })
        .then(async res => {
          const userId = res.id;
          this.password = res.password;
          if (this.profileImg) {
            const imageURL = await this.uploadProfileImage(
              userId,
              this.imageFile
            );
            this.$http
              .put(`user/update-details?id=${userId}`, {
                photo: imageURL,
                role: this.role.toLowerCase(),
              })
              .then(res => {
                this.dialog = true;
              });
          } else {
            this.dialog = true;
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getMaxDatePicker() {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() - 1);
      return (
        fecha.getFullYear() +
        "-" +
        ("0" + (fecha.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + fecha.getDate()).slice(-2)
      );
    },
    restrictChars(event) {
      if (
        event.charCode < 48 ||
        event.charCode > 57 ||
        (this.phone !== null && this.phone.length === 15)
      ) {
        event.preventDefault();
      }
    },
    validateMaxChars(event, input) {
      if (input !== null && input.length === 255) {
        event.preventDefault();
      }
    },

    loadImage() {
      this.$refs.fileInput.click();
    },
    async getImage(event) {
      if (event.target.files[0] !== undefined) {
        this.loadingImage = true;
        this.imageFile = event.target.files[0];
        try {
          const imageURL = await this.uploadProfileImage(
            this.userID,
            this.imageFile
          );
          this.profileImg = imageURL;
        } catch (error) {
          console.log(error);
        } finally {
          this.loadingImage = false;
        }
      }
    },
    uploadProfileImage(userID, imageFile) {
      const imageExtension = imageFile.name.split(".")[1];
      return new Promise(function(resolve, reject) {
        const storageRef = firebase
          .storage()
          .ref("images/user-admin/" + userID + "/profile/profileImage.png");
        const uploadTask = storageRef.put(imageFile);

        uploadTask.on(
          "state_changed",
          null,
          error => {
            reject(error);
          },
          async () => {
            await uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              resolve(downloadURL);
            });
          }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  padding-top: 1%;
}
.headerBackground {
  background: rgb(245, 245, 250);
  background: linear-gradient(
    90deg,
    rgba(245, 245, 250, 1) 0%,
    rgba(242, 245, 246, 1) 10%,
    rgba(242, 245, 246, 1) 90%,
    rgba(247, 247, 247, 1) 100%
  );
}
.saveButtonPosition {
  margin-top: -16%;
}
.notVisible {
  display: none;
}
</style>
