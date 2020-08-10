/// <reference types="cypress" />

context("Withdraw points", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".email-input").type("test@petromiles.com");
      cy.get(".password-input").type("test1234");
      cy.get(".login-btn").click();
      cy.get(".exchange-points-btn").click();
      cy.wait(3000);
    });
  
    it("trying to let the points field empty", () => {
      cy.get(".accounts-selector").click();
      cy.contains("XXXX").click();
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sell-points");
      cy.get(".v-messages__message").should("be.visible");
    });
  
    it("trying to put letters into points field", () => {
      cy.get(".points-input").type("letters");
      cy.get(".accounts-selector").click();
      cy.contains("XXXX").click();
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sell-points");
      cy.get(".v-messages__message").should("be.visible");
    });

    it("trying to withdraw but didn't choose a bank account and let the point field empty ", () => {
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sell-points");
        cy.get(".v-messages__message").should("be.visible");
      });    
  
    it("trying to withdraw but didn't choose a bank account ", () => {
      cy.get(".points-input").type("2500");
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sell-points");
      cy.get(".v-messages__message").should("be.visible");
    });
  
    it("trying to exchange an amount in points greater than balance account", () => {
      cy.get(".points-input").type("10000000");
      cy.get(".accounts-selector").click();
      cy.contains("XXXX").click();
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sell-points");
      cy.get(".v-messages__message").should("be.visible");
    });
  
    it("when everything goes well", () => {
      cy.get(".points-input").type("5000");
      cy.get(".accounts-selector").click();
      cy.contains("XXXX").click();
      cy.get(".submit-btn").click();
      cy.get(".confirm-btn").click();
      cy.wait(12000);
      cy.get(".ok-btn").click();
      cy.url().should("include", "/transactions");
    });
  });
  