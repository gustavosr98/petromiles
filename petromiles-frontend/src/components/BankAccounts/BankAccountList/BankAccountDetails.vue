<template>
  <v-card v-if="bankAccount">
    <v-row class="mx-0">
      <v-col cols="12" md="7" class="pl-6">
        <v-card-title class="py-4">{{$t("bank-account-details.bankAccountDetails")}}</v-card-title>
        <v-card-subtitle class="pb-2 text-uppercase">{{ nickname}}</v-card-subtitle>

        <v-divider></v-divider>

        <!-- Account details -->
        <v-card-text class="text--primary">
          <div v-if="bankAccount">
            <property :field="$t('bank-account-details.bank')" :data="bankAccount.bankName" />
            <property :field="$t('bank-account-details.name')" :data="fullName" />
            <property :field="$t('bank-account-details.number')" :data="accountNumber" />
            <property
              :field="$t('bank-account-properties.routingNumber')"
              :data="bankAccount.number"
            />
            <property
              class="text-uppercase"
              :field="$t('common.state')"
              :color="`${getColor(bankAccount.state)}`"
              :data="bankAccount.state"
            />
          </div>

          <div class="mt-4" v-if="!isAdmin">
            <span class="overline">{{$t('bank-account-details.setAsPrimaryAccount')}}</span>
            <v-switch
              v-model="primary"
              x-small
              class="font-weight-light mt-0"
            >{{$t('bank-account-details.primary')}}</v-switch>
          </div>
        </v-card-text>
      </v-col>

      <v-col cols="12" md="5" class="px-0 pt-8" align="center">
        <!-- Bank photo-->
        <v-avatar size="150" tile>
          <v-img height="120px" width="px" :src="bankAccount.photo" lazy-src="@/assets/general/spinner.gif"></v-img>
        </v-avatar>

        <!-- Delete and set primary actions -->
        <div class="mt-5">
          <v-btn small class="my-2 elevation-0 btn-width" color="secondary" to="/buy-points" v-if="!isAdmin">
            <span>{{$t('buy-points-form.getPoints')}}</span>
            <v-icon small right>mdi-coins</v-icon>
          </v-btn>

          <v-btn class="btn-width" @click="showAreYouSureModal=true" color="red" small outlined>
            {{$t('bank-account-details.deleteAccount')}}
            <v-icon small right>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <are-you-sure-modal
      :showModal="showAreYouSureModal"
      @closeModal="closeAreYouSureModal"
      @makeAction="deleteAccount"
      :loading="loading"
    />
  </v-card>
</template>

<script>
import BankAccountProperty from "@/components/BankAccounts/BankAccountList/BankAccountProperty";
import AreYouSure from "@/components/General/Modals/WarningModals/AreYouSureModal.vue";
import { getColor } from "@/mixins/tables/getColor.js";

export default {
  mixins: [getColor],
  props: {
    idBankAccount: { type: Number, required: true },
    isAdmin: { default: false },
    clientID: { default: 0 }
  },
  components: {
    property: BankAccountProperty,
    "are-you-sure-modal": AreYouSure,
  },
  data() {
    return {
      showAreYouSureModal: false,
      bankAccount: null,
      primary: false,
      loading: false,
    };
  },
  async mounted() {
    this.bankAccount = (
      await this.$http.get(`/bank-account/accounts/${this.idBankAccount}`)
    )[0];
    this.setPrimary();
  },
  methods: {
    closeAreYouSureModal() {
      this.showAreYouSureModal = false;
    },
    setPrimary() {
      this.primary = this.bankAccount.primary;
    },    
    async deleteAccount() {
      this.loading = true;
      let apiCall = "";      
      if(this.isAdmin){
        apiCall = `/bank-account/cancel?id=${this.idBankAccount}&userId=${this.clientID}`;
      }      
      else{
        apiCall = `/bank-account/cancel/${this.idBankAccount}`
      }
      await this.$http        
        .delete(apiCall)
        .then(() => {
          this.$emit("deleteItem", this.idBankAccount);
        })
        .finally(() => {
          this.loading = false;
          this.showAreYouSureModal = false;
        });
    },
  },
  computed: {
    fullName: function() {
      if (this.bankAccount) {
        return this.bankAccount.firstName + " " + this.bankAccount.lastName;
      }
      return null;
    },
    accountNumber: function() {
      if (this.bankAccount.accountNumber) {
        return "XXXX-".concat(this.bankAccount.accountNumber.substr(-4));
      }
      return null;
    },
    nickname: function() {
      if (this.bankAccount) {
        return this.bankAccount.nickname;
      }

      return null;
    },
  },
  watch: {
    primary: async function() {
      if (this.primary !== this.bankAccount.primary) {
        await this.$http
          .put(`/bank-account/primary`, {
            primary: this.primary,
            idBankAccount: this.idBankAccount,
          })
          .then(() => {
            this.bankAccount.primary = this.primary;
          });
      }
    },
  },
};
</script>
<style scoped>
.btn-width {
  width: 70%;
}
</style>