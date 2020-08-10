/// <reference types="cypress" />

context("Buy points", () => {
    beforeEach(() => {
      cy.visit("/");
    });
  
    it("trying to let all the fields empty", () => {
        cy.get(".login-btn").click();
           cy.wait(3000);
        cy.get(".ok-btn").click();
    });
    
    it("trying to let the password field empty", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".login-btn").click();
        cy.wait(3000);
        cy.get(".ok-btn").click();
    });

    it("trying to let the email field empty", () => {
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(3000);
        cy.get(".ok-btn").click();
    });

    it("trying to login with a wrong email", () => {
        cy.get(".email-input").type("test182@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(3000);
        cy.get(".ok-btn").click();
    });
    
    it("trying to login with a wrong password", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("wrongtest1234");
        cy.get(".login-btn").click();
        cy.wait(3000);
        cy.get(".ok-btn").click();
    });
    
    it("trying to login succesfuly", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
    });
  });
  