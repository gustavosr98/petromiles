context("Bank Account Verification", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get(".email-input").type("test@petromiles.com");
    cy.get(".password-input").type("test1234");
    cy.get(".login-btn").click();
    cy.get(
      ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
    ).click();

    cy.get(
      ':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/bank-accounts"]'
    ).click();
    cy.get(":nth-child(3) > .v-btn__content").click();
    cy.get(".verify-btn").click();
  });

  //   it("trying to verify an account without any amount", () => {
  //     cy.get(".verify-account").click();
  //     cy.url().should("include", "/bank-accounts");
  //     cy.contains(
  //       "The combination you have provided is invalid. Please try again"
  //     ).should("be.visible");
  //   });

  it("trying to verify an account with just first amount", () => {
    cy.get(".first-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.contains(
      "The combination you have provided is invalid. Please try again"
    ).should("be.visible");
  });
  it("trying to verify an account with just first amount", () => {
    cy.get(".second-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.contains(
      "The combination you have provided is invalid. Please try again"
    ).should("be.visible");
  });

  it("trying to verify an account with an invalid combination", () => {
    cy.get(".first-amount").type("0.2");
    cy.get(".second-amount").type("1.5");
    cy.get(".verify-account").click();
    cy.url().should("include", "/bank-accounts");
    cy.contains(
      "The combination you have provided is invalid. Please try again"
    ).should("be.visible");
  });

  it("when everything goes well", () => {
    cy.get(".first-amount").type("1.5");
    cy.get(".second-amount").type("1");
    cy.get(".verify-account").click();
    cy.wait(10000);
    cy.get(".verify-modal").should("not.be.visible");
  });
});
