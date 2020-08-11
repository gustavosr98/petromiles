/// <reference types="cypress" />

const modalMessages = {
    wrongPassword: "Wrong user or password",
    noAccount: "User does not have an account in PetroMiles",
};

const snackMessages = {
    saveInformationProfile: "User Successfully Updated!",
};

context("Update user Profile", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get(".email-input").type("test@petromiles.com");
        cy.get(".password-input").type("test1234");
        cy.get(".login-btn").click();
        cy.wait(5000);
        cy.url().should("include", "/dashboard");
        cy.get(
            ":nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .app-bar > .v-toolbar__content > .v-app-bar__nav-icon > .v-btn__content > .v-icon"
        ).click();
        cy.get(
            ':nth-child(2) > .pt-0 > :nth-child(1) > :nth-child(1) > .v-navigation-drawer > .v-navigation-drawer__content > .v-list > .v-item-group > [href="/profile"]'
        ).click();
        cy.url().should("include", "/profile");
    });

    it("Updating middle name and second last name", () => {
        cy.get('[data-cy=middleName-input]').type("Lorem");
        cy.get('[data-cy=secondLastName-input]').type("Ipsum");
        cy.get('[data-cy=save-btn] > .v-btn__content').click();
        cy.wait(1000);
        cy.contains(snackMessages.saveInformationProfile).should("be.visible");
        cy.get('[data-v-23b34533=""][data-v-0020b690=""] > :nth-child(5) > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });

    // it("trying to let the password field empty", () => {
    //     cy.get(".email-input").type("test@petromiles.com");
    //     cy.get(".login-btn").click();
    //     cy.wait(1000);
    //     cy.get('.v-card__title > .v-icon').should("be.visible");
    //     cy.contains(modalMessages.wrongPassword).should("be.visible");
    //     cy.get('[data-cy=error-btn]').click();
    // });


});