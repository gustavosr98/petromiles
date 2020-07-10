<template>
  <v-card max-width="400" class="px-5 py-1 ma-3" :elevation="6">
        <v-card-text>
          <h1 class="black--text mt-4" align="center">
            {{ $t("dashboard.affiliateSubscription") }}
          </h1>
          <p align="center" class=" mt-4">
              {{ $t("dashboard.affiliateSubscriptionDescription") }}
          </p>
          <v-divider></v-divider>
        </v-card-text>
        <v-row>          
            <v-img
              class="white--text align-end mb-n3"
              height="260px"
              contain
              src="@/assets/membership/premium.png"
            >
            </v-img
          >
        </v-row>
        <v-row align="center" justify="center">
          <router-link to="/user-subscription" class="text-decoration-none">
            <v-btn large dark color="primary" class="my-4 mb-6">
              <b> {{ $t("subscription.premiumBtn") }} </b>
            </v-btn>
          </router-link>
        </v-row>
      </v-card>
</template>

<script>
export default {
    name: "membership-card",
}
</script>