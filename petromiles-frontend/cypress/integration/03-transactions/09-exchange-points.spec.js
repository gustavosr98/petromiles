/// <reference types="cypress" />

const modalMessages = {
  successPoints: 'The money was already deposited into your bank account. Enjoy it!',
};

const formErrorMessages = {
  requiredField: "This field is required",
  noLetters: "This should be an integer number",
  notEnoughPoints: "You don't have enough points!",
  needMorePoints: "You need to extract more points so that your withdrawal can be processed",
};

context("Withdraw points", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="email-input"]').type("test@petromiles.com");
    cy.get('[data-cy="password-input"]').type("test1234");
    cy.get('[data-cy=login-btn]').click();
    cy.get(".exchange-points-btn").click();
  });

  it("61 - trying to let the points field empty", () => {
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.requiredField).should("be.visible");
  });

  it("62 - trying to put letters into points field", () => {
    cy.get(".points-input").type("letters");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.noLetters).should("be.visible");
  });

  it("63 - trying to withdraw but didn't choose a bank account and let the point field empty ", () => {
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.requiredField).should("be.visible");
  });

  it("64 - trying to withdraw but didn't choose a bank account ", () => {
    cy.get(".points-input").type("2500");
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.requiredField).should("be.visible");
  });

  it("65 - trying to exchange an amount in points greater than balance account", () => {
    cy.get(".points-input").type("10000000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.notEnoughPoints).should("be.visible");
  });

  it("66 - trying to exchange an amount in points very small", () => {
    cy.get(".points-input").type("1");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/sell-points");
    cy.contains(formErrorMessages.needMorePoints).should("be.visible");
  });

  it("67 - when everything goes well", () => {
    cy.get(".points-input").type("5000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(12000);
    cy.contains(modalMessages.successPoints).should('be.visible');
    cy.get(".ok-btn").click();
    cy.url().should("include", "/transactions");
    cy.contains("5000").should('be.visible');
  });
});