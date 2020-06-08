<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6" md="9">
        <v-card class="elevation-12">
          <v-window>
            <auth-window title="Welcome back" msg="Nice to see you again">
              <login-form />
            </auth-window>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthWindow from "@/modules/Auth/components/AuthWindow";
import LoginForm from "@/modules/Auth/components/LoginForm";
export default {
  components: {
    "auth-window": AuthWindow,
    "login-form": LoginForm,
  },
};
</script>

<style lang="scss" scoped></style>
