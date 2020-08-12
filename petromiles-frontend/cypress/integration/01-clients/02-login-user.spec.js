/// <reference types="cypress" />

const modalMessages = {
    wrongPassword: "Wrong user or password",
    noAccount: "User does not have an account in PetroMiles",
};

context("Login User", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("11 - trying to let all the fields empty", () => {
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("12 - trying to let the password field empty", () => {
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.wrongPassword).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("13 - trying to let the email field empty", () => {
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("14 - trying to login with a wrong email", () => {
        cy.get('[data-cy="email-input"]').type("test@petrwrong.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("15 - trying to login with a invalid email", () => {
        cy.get('[data-cy="email-input"]').type("test@petromiles");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("16 - trying to login with a wrong password", () => {
      cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("wrong1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.wrongPassword).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("17 - trying to login succesfuly", () => {
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(3000);
        cy.url().should("include", "/dashboard");
    });
});