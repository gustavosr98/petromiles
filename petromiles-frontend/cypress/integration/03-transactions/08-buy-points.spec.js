/// <reference types="cypress" />

const formErrorMessages = {
  noLetter: "This should be an integer number",
  requiredField: "This field is required",
};

const modalMessages = {
  largeAmount: "Amount too large",
  exceedsAmount: "Charge amount exceeds bank account limit",
  invalidAmount: "Invalid integer",
};


context("Buy points", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="email-input"]').type("test@petromiles.com");
    cy.get('[data-cy="password-input"]').type("test1234");
    cy.get('[data-cy=login-btn]').click();
    cy.get(".buy-points-btn").click();
  });

  it("54 - trying to let the points field empty", () => {
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.contains(formErrorMessages.requiredField).should("be.visible");
  });

  it("55 - trying to put letters into points field", () => {
    cy.get(".points-input").type("letters");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.contains(formErrorMessages.noLetter).should('be.visible');
  });

  it("56 - trying to not to choose a bank account ", () => {
    cy.get(".points-input").type("500");
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.contains(formErrorMessages.requiredField).should('be.visible');
  });

  it("57 - trying to buy an amount in points equivalent or greater than $2000", () => {
    cy.get(".points-input").type("5000000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(8000);
    cy.url().should("include", "/buy-points");
    cy.contains(modalMessages.exceedsAmount).should('be.visible');
    cy.get('[data-cy=error-btn] > .v-btn__content').click();
  });

  it("58 - trying to buy a very big amount in points", () => {
    cy.get(".points-input").type("500000000000000000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(8000);
    cy.url().should("include", "/buy-points");
    cy.contains(modalMessages.largeAmount).should('be.visible');
    cy.get('[data-cy=error-btn] > .v-btn__content').click();
  });

  it("59 - trying to buy a very VERY big amount in points", () => {
    cy.get(".points-input").type("500000000000000000000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(8000);
    cy.url().should("include", "/buy-points");
    cy.contains(modalMessages.invalidAmount).should('be.visible');
    cy.get('[data-cy=error-btn] > .v-btn__content').click();
  });

  it("60 - when everything goes well", () => {
    cy.get(".points-input").type("500000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(10000);
    cy.get(".ok-btn").click();
    cy.url().should("include", "/transactions");
    cy.contains("500000").should('be.visible');
  });
});