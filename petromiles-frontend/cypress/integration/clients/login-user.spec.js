/// <reference types="cypress" />

const modalMessages = {
    wrongPassword: "Wrong user or password",
    noAccount: "User does not have an account in PetroMiles",
};

context("Login User", () => {
    beforeEach(() => {
        cy.visit("/");
    });

    it("trying to let all the fields empty", () => {
        cy.get(".login-btn").click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("trying to let the password field empty", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".login-btn").click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.wrongPassword).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("trying to let the email field empty", () => {
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(1000);
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("trying to login with a wrong email", () => {
        cy.get(".email-input").type("test182@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.noAccount).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("trying to login with a wrong password", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("wrongtest1234");
        cy.get(".login-btn").click();
        cy.wait(1000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.wrongPassword).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

    it("trying to login succesfuly", () => {
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(3000);
        cy.url().should("include", "/dashboard");
    });
});