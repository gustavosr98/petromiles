/// <reference types="cypress" />

const modalMessages = {
  noAccount: 'User does not have an account in PetroMiles',
};

const formErrorMessages = {
  wrongEmail: 'Must be valid e-mail',
};

const snackMessages = {
  sentEmail: 'Email sent to:'
};

context("Recover Password", () => {

  before(() => {
    cy.visit("/");
    cy.get('[data-cy="link-to-signup"]').click();
    cy.url().should("include", "/sign-up");
    cy.get('[data-cy="name-input"]').type("John");
    cy.get('[data-cy="last-name-input"]').type("Doe");
    cy.get('[data-cy="email-input"]').type("test233@petromiles.com")
    cy.get('[data-cy="password-input"]').type("test1234");
    cy.get('[data-cy=signup-btn]').click();
    cy.wait(20000);
    cy.url().should("include", "/dashboard");
    cy.get(
      ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
    ).click();
    cy.get(":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__append > .pa-2 > .logout-btn > :nth-child(1)").click();

});

  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="link-to-recover"]').click();
    cy.url().should("include", "/recover-password");
  });
  
  it("28 - trying to let the field empty", () => {
    cy.get('[data-cy=recover-btn]').click();
    cy.wait(2000);
    cy.get('.v-card__title > .v-icon').should('be.visible')
    cy.contains(modalMessages.noAccount).should("be.visible");
    cy.get('[data-cy=error-btn]').click();
  });

  it("29 - trying to enter an invalid email", () => {
    cy.get('[data-cy=email-input]').type("test233@petrowrong");
    cy.get('[data-cy=recover-btn]').click();
    cy.wait(2000);
    cy.get('.v-card__title > .v-icon').should('be.visible')
    cy.contains(modalMessages.noAccount).should("be.visible");
    cy.get('[data-cy=error-btn]').click();
    cy.contains(formErrorMessages.wrongEmail).should("be.visible");
  });

  it("30 - trying to enter the email correctly", () => {
    cy.get('[data-cy=email-input]').type("test233@petromiles.com");
    cy.get('[data-cy=recover-btn]').click();
    cy.wait(1000);
    cy.contains(snackMessages.sentEmail).should("be.visible");
    cy.get('[data-cy=close-btn]').click();
  });

});
