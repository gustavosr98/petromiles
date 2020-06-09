<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn :color="color" class="text-capitalize elevation-0 body-2" dark v-on="on" width="100%">
        <span class="mr-2">{{`${$i18n.locale} `}}</span>
        <v-spacer />
        <v-icon small>mdi-earth</v-icon>
        <v-spacer />
        <v-icon small>keyboard_arrow_down</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(language, index) in languages"
        :key="index"
        @click="changeLanguage(language)"
      >
        <v-list-item-title>{{ language.name }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { createNamespacedHelpers, mapState } from "vuex";
const { mapActions } = createNamespacedHelpers("auth");

import authConstants from "@/constants/authConstants";

export default {
  name: "language-dropdown",
  props: {
    color: { type: String, required: true },
  },
  data() {
    return {
      languages: [
        {
          name: "English",
          bdName: "english",
          shortname: "en",
        },
        {
          name: "Español",
          bdName: "spanish",
          shortname: "es",
        },
      ],
    };
  },
  methods: {
    ...mapActions(["changeLang"]),
    async changeLanguage(language) {
      await this.changeLang(language);
      this.$vuetify.lang.current = language.shortname;
      this.$i18n.locale = language.shortname;
    },
  },
  computed: {
    ...mapState("auth", ["user"]),
  },
  mounted() {
    const user = JSON.parse(
      localStorage.getItem(authConstants.USER_LOCAL_STORAGE)
    );
    const lang = user.details.language.shortname;

    this.$vuetify.lang.current = lang;
    this.$i18n.locale = lang;
  },
};
</script>