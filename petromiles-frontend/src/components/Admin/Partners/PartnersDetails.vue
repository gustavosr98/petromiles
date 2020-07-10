<template>
  <v-container class="ml-2 py-0">
    <v-row>
      <v-col cols="12" md="4">
        <v-col cols="12">
          <v-menu offset-y width="100%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="secondary"
                class="elevation-0 justify-space-between"
                v-bind="attrs"
                width="100%"
                v-on="on"
              >
                <div>{{ $t("configuration.chooseACompany")}}</div>
                <v-icon>keyboard_arrow_down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in thirdPartyAdministration"
                :key="index"
                @click="selectThirdParty(item.name)"
              >
                <v-list-item-title>{{ item.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col>
          <v-card class="mx-auto px-3 text-xs-center" v-if="selectedItem">
            <v-img :src="selectedItem.photo" height="150px" lazy-src="@/assets/general/spinner.gif"></v-img>

            <v-card-title class="light-blue-text text--darken-4">{{selectedItem.name}}</v-card-title>

            <v-card-subtitle>{{selectedItem.description}}</v-card-subtitle>
            <v-divider></v-divider>

            <v-card-text></v-card-text>

            <v-card-subtitle class="py-0">
              {{ $t("configuration.accumulatePercentage")}}
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon class="ml-2" small v-bind="attrs" v-on="on">help</v-icon>
                </template>
                <span>{{ $t("configuration.accumulatePercentageDescription")}}</span>
              </v-tooltip>
            </v-card-subtitle>

            <v-col cols="7" class="pt-0 pb-3">
              <v-text-field
                :value="selectedItem.accumulatePercentage"
                v-model="interestData.percentage"
                :disabled="disableEdit"
                prefix="%"
                class="my-0 py-0"
                @change="$v.interestData.percentage.$touch()"
                @blur="$v.interestData.percentage.$touch()"
                :error-messages="percentageErrors"
                type="number"
              ></v-text-field>
            </v-col>

            <v-card-actions class="justify-space-between">
              <v-btn color="primary" text @click="disableEdit =!disableEdit">Edit</v-btn>
              <v-btn small color="secondary elevation-0" @click="update" :loading="loading">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="8">
        <transactions-table
          v-if="selectedItem"
          :url="`transaction/getThirdPartyTransactions/${selectedItem.idThirdPartyClient}`"
        />
      </v-col>
    </v-row>
    <configuration-modal @closeModal="closeModal" :dialog="dialog" :message="modalMessage" />
  </v-container>
</template>

<script>
import PlatformConfigMixin from "@/mixins/validation-forms/platform-config.mixin";
import ConfigurationModal from "@/components/General/Modals/ConfigurationModal/ConfigurationModal.vue";
import TransactionTable from "@/components/Transactions/TransactionsTable";

export default {
  mixins: [PlatformConfigMixin],
  components: {
    "configuration-modal": ConfigurationModal,
    "transactions-table": TransactionTable,
  },
  data() {
    return {
      thirdPartyAdministration: [],
      selectedItem: null,
      disableEdit: true,
      modalMessage: this.$t("configuration.changeMadeSuccessfully"),
      dialog: false,
      loading: false,
    };
  },
  async mounted() {
    this.thirdPartyAdministration = await this.$http.get(
      "third-party-administration"
    );
    this.selectedItem = this.thirdPartyAdministration[0];
    this.interestData.percentage = this.selectedItem.accumulatePercentage;
  },
  methods: {
    selectThirdParty(name) {
      this.selectedItem = this.thirdPartyAdministration.find(
        thirdParty => thirdParty.name == name
      );
      this.interestData.percentage = this.selectedItem.accumulatePercentage;
      this.disableEdit = true;
    },
    async update() {
      this.$v.$touch();
      if (!this.$v.$invalid && !this.disableEdit) {
        this.loading = true;
        await this.$http
          .put(
            `third-party-administration/${this.selectedItem.idThirdPartyClient}`,
            {
              accumulatePercentage:
                (this.interestData.percentage * 100) / 10000,
            }
          )
          .then(() => {
            this.updateList();
            this.dialog = true;
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    closeModal() {
      this.dialog = false;
    },
    updateList() {
      this.thirdPartyAdministration.map(tp => {
        if (tp.name === this.selectedItem.name)
          tp.accumulatePercentage = this.interestData.percentage;
        return tp;
      });
    },
  },
};
</script>