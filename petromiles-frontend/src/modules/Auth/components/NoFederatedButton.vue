<template>
  <v-col cols="12" class="text-center">
    <v-btn
      :provider="provider"
      width="100%"
      type="button"
      @click="signIn()"
      :class="provider.class"
    >
      <v-icon :color="provider.colorIcon" class="mr-5">mdi-{{ provider.name }}</v-icon>
      <slot />
    </v-btn>
  </v-col>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  props: {
    provider: {
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  methods: {
    signIn() {
      const event = this;
      firebase
        .auth()
        .signInWithPopup(this.provider.provider)
        .then(function(result) {
          const profile = result.additionalUserInfo.profile;

          const user = {
            firstName: profile.given_name || profile.first_name,
            lastName: profile.family_name || profile.last_name,
            photo:
              event.provider.name === "facebook"
                ? profile.picture.data.url
                : profile.picture,
            email: profile.email,
            role: "CLIENT",
          };
          // console.log("este es el user", profile.picture);
          event.$emit(event.type, user);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
