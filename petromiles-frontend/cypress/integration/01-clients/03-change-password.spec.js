/// <reference types="cypress" />

const snackMessages = {
    newPassword: "Error. Enter new password.",
    confirmNewPassword: "Error. Please confirm new password.",
    changedPassword: "Password Successfully Changed",
};

const modalMessages = {
    incorrectPassword: "Incorrect password",
};

const formErrorMessages = {
    shortPassword: "Password must have at least 8 characters",
    longPassword: "Password must have at most 16 characters",
    dontMatchPassword: "Passwords doesn't match",
};

context("Change Password", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(4000);
        cy.url().should("include", "/dashboard");
        cy.get(":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon").click();
        cy.get(':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/profile"] > .v-list-item__content > .v-list-item__title').click();
        cy.url().should("include", "/profile");
    });

    it("18 - Trying to Change Password with all the fields empty", () => {
        cy.get('[data-cy=change-btn]').click();
      cy.get(":nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content").click();
    });

    it("19 - Trying to Change Password with only the current password field filled correctly", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(snackMessages.newPassword).should("be.visible");
        cy.get(":nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content").click();
    });

    it("20 - Trying to Change Password with only the current password field filled wrongly", () => {
        cy.get('[data-cy=current-password-input]').type("te34st12");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(snackMessages.newPassword).should("be.visible");
        cy.get(":nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content").click();
    });

    it("21 - Trying to Change Password with only the current password field and new password field filled", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=new-password-input]').type("5678test");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(formErrorMessages.dontMatchPassword).should("be.visible");
        cy.get(":nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content").click();
    });

    it("22 - Trying to Change Password with a incorrect current password", () => {
        cy.get('[data-cy=current-password-input]').type("12test34");
        cy.get('[data-cy=new-password-input]').type("5678test");
        cy.get('[data-cy=confirm-new-password-input]').type("5678test");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.get(".v-card__title > .v-icon").should("be.visible");
        cy.contains(modalMessages.incorrectPassword).should("be.visible");
        cy.get('.v-card__actions > .v-btn > .v-btn__content').click();
    });

    it("23 - Trying to Change Password with a confirmation password that doesn't match", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=new-password-input]').type("5678test");
        cy.get('[data-cy=confirm-new-password-input]').type("91test01");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(formErrorMessages.dontMatchPassword).should("be.visible");
    });

    it("24 - Trying to Change Password with a invalid short password", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=new-password-input]').type("5678");
        cy.get('[data-cy=confirm-new-password-input]').type("5678");
        cy.get('[data-cy=change-btn]').click();
        cy.contains(formErrorMessages.shortPassword).should("be.visible");
    });

    it("25 - Trying to Change Password with a invalid long password", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=new-password-input]').type("test1234567890test");
        cy.get('[data-cy=confirm-new-password-input]').type("test1234567890test");
        cy.get('[data-cy=change-btn]').click();
        cy.contains(formErrorMessages.longPassword).should("be.visible");
    });

    it("26 - Change Password succesfully", () => {
        cy.get('[data-cy=current-password-input]').type("test1234");
        cy.get('[data-cy=new-password-input]').type("5678test");
        cy.get('[data-cy=confirm-new-password-input]').type("5678test");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(snackMessages.changedPassword).should("be.visible");
        cy.get(':nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });
});

context("Return to original tester password", () => {

    beforeEach(() => {
        cy.visit("/");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("5678test");
        cy.get('[data-cy=login-btn]').click();
        cy.wait(4000);
        cy.url().should("include", "/dashboard");
        cy.get(":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon").click();
        cy.get(':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/profile"] > .v-list-item__content > .v-list-item__title').click();
        cy.url().should("include", "/profile");
    });

    it("27 - Change to original Password", () => {
        cy.get('[data-cy=current-password-input]').type("5678test");
        cy.get('[data-cy=new-password-input]').type("test1234");
        cy.get('[data-cy=confirm-new-password-input]').type("test1234");
        cy.get('[data-cy=change-btn]').click();
        cy.wait(1000);
        cy.contains(snackMessages.changedPassword).should("be.visible");
        cy.get(':nth-child(2) > .row > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });
});