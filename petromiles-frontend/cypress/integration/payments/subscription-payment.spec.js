/// <reference types="cypress" />

context("Buy points", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".email-input").type("test@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".login-btn").click();
    cy.url().should("include", "/dashboard");
    cy.get(".subscriptions-btn").click();
    cy.url().should("include", "/user-subscription");
    cy.get(".acquire-btn").click();
    cy.wait(3000);
  });

  it("Buying the premium subscription membership", () => {
    cy.url().should("include", "/user-subscription-purchase");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(8000)
    cy.get(".ok-btn").click();
  });

  it("Trying to Buy again the premium subscription membership after paying it for the first time", () => {
      cy.url().should("include", "/user-subscription-purchase");
      cy.get(".accounts-selector").click();
      cy.contains("XXXX").click();
      cy.get(".submit-btn").click();
      cy.get(".confirm-btn").click();
      cy.wait(4000)
      cy.get(".ok-btn").click();
    });

});