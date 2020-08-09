/// <reference types="cypress" />

context("Buy points", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get(".link-to-signup").click();
    });
  
    it("trying to let all the fields empty", () => {
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sign-up");
      cy.get(".v-messages__message").should("be.visible");
    });
  
    it("trying to let the Name field empty", () => {
      cy.get(".last-name-input").type("Doe");
      cy.get(".email-input").type("test@petromiles.com");
      cy.get(".password-input").type("test1234");
      cy.get(".submit-btn").click();
      cy.url().should("include", "/sign-up");
      cy.get(".v-messages__message").should("be.visible");
    });
  
    
    it("trying to let the Last-Name field empty", () => {
        cy.get(".name-input").type("John");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sign-up");
        cy.get(".v-messages__message").should("be.visible");
      });

      it("trying to let the Password field empty", () => {
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sign-up");
        cy.get(".v-messages__message").should("be.visible");
      });

      it("trying to let the Email field empty", () => {
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".password-input").type("test1234");
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sign-up");
        cy.get(".v-messages__message").should("be.visible");
      });

      it("trying to input an invalid Email", () => {
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".email-input").type("test@petromiles");
        cy.get(".password-input").type("test1234");
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sign-up");
        cy.get(".v-messages__message").should("be.visible");
      });

      it("trying to input an invalid Password", () => {
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1");
        cy.get(".submit-btn").click();
        cy.url().should("include", "/sign-up");
        cy.get(".v-messages__message").should("be.visible");
      });

      it("trying register a new user correctly", () => {
        cy.url().should("include", "/sign-up");          
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".submit-btn").click();
        cy.wait(12000);
        cy.url().should("include", "/dashboard");
      });
  
      it("trying to register a new user with a email already in use", () => {
        cy.url().should("include", "/sign-up");          
        cy.get(".name-input").type("John");          
        cy.get(".last-name-input").type("Doe");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".submit-btn").click();
        cy.wait(12000);
        cy.get(".ok-btn").click();
      });
  
  });
  