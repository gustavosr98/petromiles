export const cronJobs = Object.freeze({
  TRANSACTION_CHARGE_STATUS_STRIPE: {
    name: "chargeStatus",
  },
  TRANSACTION_TRANSFER_STATUS_STRIPE: {
    name: "transferStatus",
  },
});

export const cronFrequencies = Object.freeze({
  frequencies: ["1 min", "2 min", "3 min", "4 min", "5 min"],
});
