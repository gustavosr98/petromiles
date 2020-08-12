/// <reference types="cypress" />


const snackMessages = {
    saveInformationProfile: "User Successfully Updated!",
};
const formMessages = {
    requiredName: "First name is required",
    requiredLastname: "Last name is required",
};


context("Update user Profile", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.get('[data-cy="email-input"]').type("test@petromiles.com");
        cy.get('[data-cy="password-input"]').type("test1234");
        cy.get('[data-cy=login-btn]').click();
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

    it("31 - Updating all the information possible", () => {
        cy.get('[data-cy=firstName-input]').clear().type("Richard");
        cy.get('[data-cy=lastName-input]').clear().type("Roe");
        cy.get('[data-cy=middleName-input]').clear().type("Lorem");
        cy.get('[data-cy=secondLastName-input]').clear().type("Ipsum");
        cy.get('[data-cy=phone-input]').type("0491579212");
        cy.get('[data-cy=country-selector]').click();
        cy.contains("UNITED STATES").click();
        cy.get('[data-cy=address-input]').type("3133  Sampson Street, Aurora, Colorado");
        cy.get('[data-cy=save-btn] > .v-btn__content').click();
        cy.wait(1000);
        cy.contains(snackMessages.saveInformationProfile).should("be.visible");
        cy.get('[data-v-23b34533=""][data-v-0020b690=""] > :nth-child(5) > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });

    it("32 - Trying to clean all the forms", () => {
        cy.get('[data-cy=firstName-input]').clear();
        cy.get('[data-cy=lastName-input]').clear();
        cy.get('[data-cy=middleName-input]').clear();
        cy.get('[data-cy=secondLastName-input]').clear();
        cy.get('[data-cy=birthdate-input]').clear();
        cy.get('[data-cy=phone-input]').clear();
        cy.get('[data-cy=address-input]').clear();
        cy.get('[data-cy=save-btn] > .v-btn__content').click();
        cy.contains(formMessages.requiredName).should("be.visible");
        cy.contains(formMessages.requiredLastname).should("be.visible");
        cy.get('[data-cy=reset-btn] > .v-btn__content').click();
    });


    it("33 - Cleaning all the possible forms", () => {
        cy.get('[data-cy=middleName-input]').clear();
        cy.get('[data-cy=secondLastName-input]').clear();
        cy.get('[data-cy=birthdate-input]').clear();
        cy.get('[data-cy=phone-input]').clear();
        cy.get('[data-cy=address-input]').clear();
        cy.get('[data-cy=save-btn] > .v-btn__content').click();
        cy.wait(1000);
        cy.contains(snackMessages.saveInformationProfile).should("be.visible");
        cy.get('[data-v-23b34533=""][data-v-0020b690=""] > :nth-child(5) > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });


    it("34 - Updating Name and Last Name correctly", () => {
        cy.get('[data-cy=firstName-input]').clear().type("John");
        cy.get('[data-cy=lastName-input]').clear().type("Doe");
        cy.get('[data-cy=save-btn] > .v-btn__content').click();
        cy.wait(1000);
        cy.contains(snackMessages.saveInformationProfile).should("be.visible");
        cy.get('[data-v-23b34533=""][data-v-0020b690=""] > :nth-child(5) > .text-center > .v-snack > .v-snack__wrapper > .v-snack__content > .v-btn > .v-btn__content').click();
    });

});