/// <reference types="cypress" />

context("Recover Password", () => {

  before(() => {
    cy.visit("/");
    cy.get(".link-to-signup").click();
    cy.url().should("include", "/sign-up");
    cy.get(".name-input").type("John");
    cy.get(".last-name-input").type("Doe");
    cy.get(".email-input").type("test2@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".submit-btn").click();
    cy.wait(8000);
    cy.url().should("include", "/dashboard");
    cy.get(
      ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
    ).click();
    cy.get(":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__append > .pa-2 > .logout-btn > :nth-child(1)").click();

});

  beforeEach(() => {
    cy.visit("/");
    cy.get(".link-to-recover").click();
    cy.url().should("include", "/recover-password");
  });
  
  it("trying to let the field empty", () => {
    cy.get(".recover-btn").click();
    cy.get(".ok-btn").click();
  });

  it("trying to enter an invalid email", () => {
    cy.get(".email-input").type("test2@petrowrong");
    cy.get(".recover-btn").click();
    cy.get(".ok-btn").click();
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to enter the email correctly", () => {
    cy.get(".email-input").type("test22@petromiles.com");
    cy.get(".recover-btn").click();
    cy.wait(1000);
    cy.get(".close-btn").click();
  });

});
