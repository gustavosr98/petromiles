/// <reference types="cypress" />

const modalMessages = {
  thanksForTrust: "Thanks for trust in us!",
  errorPaymentSub: "this user already has a pending upgrade transaction",
  areYouSure: "Are you sure?",
};

context("Payment Subscription", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".email-input").type("test@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".login-btn").click();
    cy.url().should("include", "/dashboard");
    cy.get(".subscriptions-btn").click();
    cy.url().should("include", "/user-subscription");
    cy.get(".acquire-btn").click();
    cy.wait(1000);
  });

  it("Buying the premium subscription membership", () => {
    cy.url().should("include", "/user-subscription-purchase");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.contains(modalMessages.areYouSure).should("be.visible");
    cy.get('[data-cy=confirm-btn]').click();
    cy.wait(4000)
    cy.contains(modalMessages.thanksForTrust).should("be.visible");
    cy.get('[data-cy=pay-sub-btn]').click();
  });

  it("Trying to Buy again the premium subscription membership after paying it for the first time", () => {
    cy.url().should("include", "/user-subscription-purchase");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.contains(modalMessages.areYouSure).should("be.visible");
    cy.get('[data-cy=confirm-btn]').click();
    cy.wait(2000)
    cy.contains(modalMessages.errorPaymentSub).should("be.visible");
    cy.get(".v-card__title > .v-icon").should("be.visible");
    cy.get('[data-cy=error-btn]').click();
  });

});
