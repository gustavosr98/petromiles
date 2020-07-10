<template>
        <v-card max-width="400" class="px-5 py-1 ma-3" :elevation="6">
        <v-card-text>
          <h1 class="black--text pt-1" align="center">
            {{ $t("navbar.exchangePoints") }}
          </h1>
          <p align="center" class=" mt-4">
            {{ $t("dashboard.exchangeCardDescription") }}
          </p>
          <v-divider></v-divider>
        </v-card-text>
        <v-img
          class="white--text align-end mt-n4"
          height="280px"
          contain
          src="@/assets/Wallet.png"
        >
        </v-img>
        <v-row align="center" justify="center">
          <router-link to="/sell-points" class="text-decoration-none">
            <v-btn large dark color="primary" class="my-4">
              <b> {{ $t("navbar.exchangePoints") }} </b>
            </v-btn>
          </router-link>
        </v-row>
      </v-card>
</template>

<script>
export default {
  name: "exchange-card",
};
</script>

