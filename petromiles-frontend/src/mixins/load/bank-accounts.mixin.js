import { states } from "@/constants/state";

export default {
  methods: {
    async loadBankAccounts() {
      const bankAccounts = await this.$http.get("/bank-account");

      this.bankAccounts = bankAccounts
        .filter(b => {
          const isActive = !!b?.clientBankAccount[0].stateBankAccount.find(
            sba => !sba.finalDate && sba.state.name === states.ACTIVE.name
          );
          return isActive;
        })
        .map(b => {
          return {
            idClientBankAccount: b.clientBankAccount[0].idClientBankAccount,
            last4: `XXXX-${b.accountNumber}`,
            nickname: b.nickname.toUpperCase(),
            bank: b.routingNumber.bank.name,

          };
        });

      this.loadingBankAccounts = false;
    },
  },
};
