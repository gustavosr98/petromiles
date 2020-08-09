/// <reference types="cypress" />

context("Buy points", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".email-input").type("test@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".login-btn").click();
    cy.get(".buy-points-btn").click();
    cy.wait(8000);
  });

  it("trying to let the points field empty", () => {
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to let the points field empty", () => {
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to put letters into points field", () => {
    cy.get(".points-input").type("letters");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to not to choose a bank account ", () => {
    cy.get(".points-input").type("500");
    cy.get(".submit-btn").click();
    cy.url().should("include", "/buy-points");
    cy.get(".v-messages__message").should("be.visible");
  });

  it("trying to buy an amount in points equivalent or greater than $2000", () => {
    cy.get(".points-input").type("5000000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(5000);
    cy.url().should("include", "/buy-points");
    cy.contains("Charge amount exceeds bank account limit").should(
      "be.visible"
    );
  });

  it("when everything goes well", () => {
    cy.get(".points-input").type("500000");
    cy.get(".accounts-selector").click();
    cy.contains("XXXX").click();
    cy.get(".submit-btn").click();
    cy.get(".confirm-btn").click();
    cy.wait(5000);
    cy.get(".ok-btn").click();
    cy.url().should("include", "/transactions");
  });
});
