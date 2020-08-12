context("Bank Account Verification", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="email-input"]').type("test@petromiles.com");
    cy.get('[data-cy="password-input"]').type("test1234");
    cy.get('[data-cy=login-btn]').click();
    cy.get(
      ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
    ).click();

    cy.get(
      ':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/bank-accounts"]'
    ).click();
    cy.get(":nth-child(3) > .v-btn__content").click();
    cy.get(".verify-btn").click();
    cy.wait(3000);
  });

  it("49 - trying to verify an account without any amount", () => {
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("50 - trying to verify an account with just the first amount", () => {
    cy.get(".first-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });
  it("51 - trying to verify an account with just the second amount", () => {
    cy.get(".second-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("52 - trying to verify an account with an invalid combination", () => {
    cy.get(".first-amount").type("0.2");
    cy.get(".second-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.get(".v-card__title").should("be.visible");
  });

  it("53 - when everything goes well", () => {
    cy.get(".first-amount").type("1.5");
    cy.get(".second-amount").type("1");
    cy.get(".verify-account").click();
    cy.wait(10000);
  });
});
