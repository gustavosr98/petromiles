/// <reference types="cypress" />

const formErrorMessages = {
    requiredName: "Name is required",
    requiredLastName: "Last name is required",
    requiredEmail: "E-mail is required",
    requiredPassword: "Password is required",
    invalidEmail: "Must be valid e-mail",
    shortPassword: "Password must have at least 8 characters",
    longPassword: "Password must have at most 16 characters",
};

const modalMessages = {
    emailExist: "Email already in use",
};

context("Register User", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get(".link-to-signup").click();
    });

    it("trying to let all the fields empty", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.requiredName).should("be.visible");
        cy.contains(formErrorMessages.requiredLastName).should("be.visible");
        cy.contains(formErrorMessages.requiredEmail).should("be.visible");
        cy.contains(formErrorMessages.requiredPassword).should("be.visible");
    });

    it("trying to let the Name field empty", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.requiredName).should("be.visible");
    });


    it("trying to let the Last-Name field empty", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.requiredLastName).should("be.visible");
    });

    it("trying to let the Password field empty", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com")
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.requiredPassword).should("be.visible");
    });

    it("trying to let the Email field empty", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.requiredEmail).should("be.visible");
    });

    it("trying to input an invalid Email", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petrowrong")
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.invalidEmail).should("be.visible");
    });

    it("trying to input an invalid short Password", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com")
        cy.get('[data-cy="password-input"]').type("test");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.shortPassword).should("be.visible");
    });

    it("trying to input an invalid long Password", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com")
        cy.get('[data-cy="password-input"]').type("test1234567890test");
        cy.get('[data-cy=signup-btn]').click();
        cy.contains(formErrorMessages.longPassword).should("be.visible");
    });

    it("trying register a new user correctly", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com")
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.wait(12000);
        cy.url().should("include", "/dashboard");
    });

    it("trying to register a new user with a email already in use", () => {
        cy.url().should("include", "/sign-up");
        cy.get('[data-cy="name-input"]').type("John");
        cy.get('[data-cy="last-name-input"]').type("Doe");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com")
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=signup-btn]').click();
        cy.wait(3000);
        cy.get('.v-card__title > .v-icon').should("be.visible");
        cy.contains(modalMessages.emailExist).should("be.visible");
        cy.get('[data-cy=error-btn]').click();
    });

});