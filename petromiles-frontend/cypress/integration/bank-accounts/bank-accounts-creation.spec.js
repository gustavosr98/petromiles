/// <reference types="cypress" />

const accountNumbers = ["000123456789", "000111111116", "1234"];
const banks = ["Bank of America", "Ally Bank"];
const nicknames = ["test 1", "test"];
const routingNumbers = ["082000073", "124003116", "0000000"];

context("Bank Account Creation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".email-input").type("test@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".login-btn").click();
    cy.get(
      ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
    ).click();

    cy.get(
      ':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/bank-accounts"]'
    ).click();

    cy.get(".v-bottom-navigation > :nth-child(2) > .v-btn__content").click();
    cy.wait(3000);
  });

  it("trying to create a bank account without a phone number", () => {
    cy.get(".next-btn").click();
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account without a type", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account without a bank", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account without an account number", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account with an invalid account number", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[2]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("trying to create a bank account without a routing number", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account with an invalid routing number", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[2]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("trying to create a bank account with a routing number that doesn't match with the bank", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[1]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("trying to create a bank account without a check number", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to create a bank account without a nickname", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("when everything goes well", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[1]);
    cy.get(".continue-btn").click();
    cy.wait(10000);
    cy.get(".bank-account-creation-msg").should("be.visible");
  });

  it("trying to create a bank account with  a routing and account number combination that already exists", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[0]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[0]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[0]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("trying to create a bank account with a nickname already in use", () => {
    cy.get(".phone-input").type("581123445");
    cy.get(".next-btn").click();
    cy.get(".banks-selector").click();
    cy.contains(banks[1]).click();
    cy.get(".account-selector").click();
    cy.contains("Saving").click();
    cy.get(".account-number-input").type(accountNumbers[0]);
    cy.get(".routing-number-input").type(routingNumbers[1]);
    cy.get(".check-input").type("2255");
    cy.get(".nickname-input").type(nicknames[1]);
    cy.get(".continue-btn").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });
});
