<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <auth-window title="Welcome to PetroMiles" msg="Start paying with PetroMiles">
              <signup-form />
            </auth-window>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthWindow from "@/components/Auth/AuthWindow";
import SignUpForm from "@/components/Auth/SignUpForm";

export default {
  components: {
    "auth-window": AuthWindow,
    "signup-form": SignUpForm,
  },
};
</script>
