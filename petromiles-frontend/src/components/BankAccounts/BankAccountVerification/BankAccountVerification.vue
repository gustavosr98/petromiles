<template>
  <v-row align="center" justify="center" class="mx-auto">
    <v-col cols="12" sm="8" md="7">
      <v-spacer />
      <!-- Show alert if the user doesn't have bank accounts to validate-->
      <information-alert v-if="bankAccountsToVerify.length == 0">
        <template>
          <h3
            class="subtitle-1 font-weight-bold font-italic"
          >{{ $t("bank-account-validation.everythingIsFine") }}</h3>
          <div class="font-weight-light">{{ $t("bank-account-validation.nothingToVerifyMessage") }}</div>
        </template>
      </information-alert>
      <!-- Show list with bank accounts available to validate -->

      <v-list v-else>
        <div
          class="primary white--text py-2 overline"
          align="center"
        >{{ $t("bank-account-validation.bankAccountsToVerify") }}</div>
        <v-divider />
        <v-list-item-group>
          <template v-for="(account, index) in bankAccountsToVerify">
            <v-list-item
              :key="account.idBankAccount"
              class="elevation-2"
              @click="startValidation(account)"
            >
              <v-list-item-content class="text--primary subtitle-2">
                <p>
                  {{$t("bank-account-properties.nickname")}}:
                  <span
                    class="subtitle-2 font-weight-light text-uppercase"
                  >
                    {{
                    account.nickname
                    }}
                  </span>
                </p>
                <p>
                  {{ $t("bank-account-properties.lastFourDigits") }}:
                  <span
                    class="subtitle-2 font-weight-light"
                  >
                    {{
                    account.accountNumber
                    }}
                  </span>
                </p>
                <p>
                  {{ $t("bank-account-properties.routingNumber") }}:
                  <span
                    class="subtitle-2 font-weight-light"
                  >
                    {{
                    account.routingNumber.number
                    }}
                  </span>
                </p>

                <p>
                  {{ $t("common.type") }}:
                  <span class="subtitle-2 font-weight-light">
                    {{
                    $t(`bank-account-properties.${account.type.toLowerCase()}`)
                    }}
                  </span>
                </p>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  color="secondary"
                  dark
                  small
                  @click="startValidation(account)"
                >{{ $t("bank-account-validation.verify") }}</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < bankAccountsToVerify.length" :key="index"></v-divider>
          </template>
        </v-list-item-group>
      </v-list>

      <!-- Show modal with the form to validate the account -->
      <verification-modal
        @finish="finish"
        @closeModal="closeModal"
        :dialog="dialog"
        :clientBankAccountId="clientBankAccountId"
      />
    </v-col>
  </v-row>
</template>

<script>
import InformationAlert from "@/components/General/Alerts/InformationAlert";
import VerificationModal from "@/components/BankAccounts/BankAccountVerification/VerificationModal";
import { mapState } from "vuex";
import { states } from "@/constants/state";
export default {
  components: {
    "information-alert": InformationAlert,
    "verification-modal": VerificationModal,
  },
  data() {
    return {
      bankAccountsToVerify: [],
      clientBankAccountId: null,
      dialog: false,
      firstAmount: null,
      secondAmount: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("bankAccount", ["bankAccounts"]),
  },
  methods: {
    startValidation(account) {
      this.clientBankAccountId =
        account.clientBankAccount[0].idClientBankAccount;
      this.dialog = true;
    },
    finish() {
      this.$emit("finish");
    },
    closeModal() {
      this.dialog = false;
    },
  },
  mounted() {
    // Build an array with the bank accounts available to validate
    if (this.bankAccounts) {
      this.bankAccounts.map(bankAccount => {
        const state =
          bankAccount.clientBankAccount[0].stateBankAccount[0].state.name;
        if (state === states.VERIFYING.name) {
          this.bankAccountsToVerify.push(bankAccount);
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped></style>
