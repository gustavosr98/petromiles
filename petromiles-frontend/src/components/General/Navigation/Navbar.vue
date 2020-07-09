<template>
  <div>
    <!-- Horizontal App Bar  -->

    <v-app-bar app class="app-bar" color="primary">
      <v-app-bar-nav-icon @click="drawer = true" color="white"></v-app-bar-nav-icon>
      <v-toolbar-title>PetroMiles</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="text-center" v-if="!isAdmin">
        <languages-dropdown color="primary white--text" />
      </div>
    </v-app-bar>

    <!-- Vertical Nav Bar  -->
    <v-navigation-drawer app v-model="drawer" temporary>
      <!-- Loggout button  -->
      <template v-slot:prepend>
        <!-- To be defined -->
      </template>

      <!-- Nav Options  -->
      <template>
        <v-list nav dense>
          <v-list-item-group v-model="model">
            <v-list-item
              v-for="navModule in navigationModules"
              :key="navModule.route.name"
              :to="{ name: navModule.route.name }"
            >
              <v-list-item-icon>
                <v-icon v-text="navModule.mdiIcon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="$tc(navModule.name)"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>

      <!-- Loggout button  -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">
            {{ $t("navbar.logout") }}
            <v-spacer></v-spacer>

            <v-btn icon>
              <v-icon>mdi-logout</v-icon>
            </v-btn>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapMutations, mapActions } = createNamespacedHelpers("auth");

import LanguageDropDown from "@/components/General/Navigation/LanguageDropDown";

export default {
  name: "navbar",
  components: {
    "languages-dropdown": LanguageDropDown,
  },
  props: {
    navigationModules: {
      type: Array,
      required: true,
      default: () => [
        {
          name: "Module A",
          mdiIcon: "mdi-home",
          routeName: "X",
        },
      ],
    },
    isAdmin: {
      default: false
    }
  },
  data() {
    return {
      drawer: false,
      model: 1,
    };
  },
  methods: {
    ...mapMutations(["logout"]),
    ...mapActions(["checkUserToken"]),
  },
  async mounted() {
    await this.checkUserToken();
  },
};
</script>

<style lang="scss" scoped>
.app-bar {
  color: white;
  width: 100%;
  padding: 0 10px;
}

.v-item {
  color: var(--v-primary-base);
}
.v-item--active {
  color: var(--v-primary-base);
  background: var(--v-secondary-base);
}
</style>
