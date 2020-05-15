'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">petromiles documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' : 'data-target="#xs-controllers-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' :
                                            'id="xs-controllers-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' : 'data-target="#xs-injectables-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' :
                                        'id="xs-injectables-links-module-AuthModule-90855d0cb9373cd1352fb87f5e03e6b7"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BankAccountModule.html" data-type="entity-link">BankAccountModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BankSeederModule.html" data-type="entity-link">BankSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BankSeederModule-f38ca2fd4f6ce8a407e1d084c99b3b56"' : 'data-target="#xs-injectables-links-module-BankSeederModule-f38ca2fd4f6ce8a407e1d084c99b3b56"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BankSeederModule-f38ca2fd4f6ce8a407e1d084c99b3b56"' :
                                        'id="xs-injectables-links-module-BankSeederModule-f38ca2fd4f6ce8a407e1d084c99b3b56"' }>
                                        <li class="link">
                                            <a href="injectables/BankSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BankSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ClientModule.html" data-type="entity-link">ClientModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ClientModule-a656fcf0a84ec676ba903113e46bf3c1"' : 'data-target="#xs-injectables-links-module-ClientModule-a656fcf0a84ec676ba903113e46bf3c1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ClientModule-a656fcf0a84ec676ba903113e46bf3c1"' :
                                        'id="xs-injectables-links-module-ClientModule-a656fcf0a84ec676ba903113e46bf3c1"' }>
                                        <li class="link">
                                            <a href="injectables/UserClientService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserClientService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CountrySeederModule.html" data-type="entity-link">CountrySeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CountrySeederModule-a579cbc61fc0bcfec1d6b7e3611e2a87"' : 'data-target="#xs-injectables-links-module-CountrySeederModule-a579cbc61fc0bcfec1d6b7e3611e2a87"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CountrySeederModule-a579cbc61fc0bcfec1d6b7e3611e2a87"' :
                                        'id="xs-injectables-links-module-CountrySeederModule-a579cbc61fc0bcfec1d6b7e3611e2a87"' }>
                                        <li class="link">
                                            <a href="injectables/CountrySeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CountrySeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link">DatabaseModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ExampleModule.html" data-type="entity-link">ExampleModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ExampleModule-67f532dcb5f07feae7408c0b157125b1"' : 'data-target="#xs-controllers-links-module-ExampleModule-67f532dcb5f07feae7408c0b157125b1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExampleModule-67f532dcb5f07feae7408c0b157125b1"' :
                                            'id="xs-controllers-links-module-ExampleModule-67f532dcb5f07feae7408c0b157125b1"' }>
                                            <li class="link">
                                                <a href="controllers/ExampleController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ExampleController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LanguageModule.html" data-type="entity-link">LanguageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' : 'data-target="#xs-controllers-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' :
                                            'id="xs-controllers-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' }>
                                            <li class="link">
                                                <a href="controllers/LanguageController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LanguageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' : 'data-target="#xs-injectables-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' :
                                        'id="xs-injectables-links-module-LanguageModule-f702da9418e91eb3c2d1144b69386b6b"' }>
                                        <li class="link">
                                            <a href="injectables/LanguageService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LanguageService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PoeditorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PoeditorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/LanguageSeederModule.html" data-type="entity-link">LanguageSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LanguageSeederModule-7d049d48fbf9f8dc7a5d9043a8ba3fbf"' : 'data-target="#xs-injectables-links-module-LanguageSeederModule-7d049d48fbf9f8dc7a5d9043a8ba3fbf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LanguageSeederModule-7d049d48fbf9f8dc7a5d9043a8ba3fbf"' :
                                        'id="xs-injectables-links-module-LanguageSeederModule-7d049d48fbf9f8dc7a5d9043a8ba3fbf"' }>
                                        <li class="link">
                                            <a href="injectables/LanguageSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LanguageSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MailsModule.html" data-type="entity-link">MailsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MailsModule-692ce909cd3a07b15ae288e85b26027b"' : 'data-target="#xs-injectables-links-module-MailsModule-692ce909cd3a07b15ae288e85b26027b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailsModule-692ce909cd3a07b15ae288e85b26027b"' :
                                        'id="xs-injectables-links-module-MailsModule-692ce909cd3a07b15ae288e85b26027b"' }>
                                        <li class="link">
                                            <a href="injectables/MailsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PlatformAdministratorModule.html" data-type="entity-link">PlatformAdministratorModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PlatformAdministratorModule-e10e103c39e11e39ac767b5ac5ca37a7"' : 'data-target="#xs-injectables-links-module-PlatformAdministratorModule-e10e103c39e11e39ac767b5ac5ca37a7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PlatformAdministratorModule-e10e103c39e11e39ac767b5ac5ca37a7"' :
                                        'id="xs-injectables-links-module-PlatformAdministratorModule-e10e103c39e11e39ac767b5ac5ca37a7"' }>
                                        <li class="link">
                                            <a href="injectables/RoleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RoleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PlatformInterestSeederModule.html" data-type="entity-link">PlatformInterestSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PlatformInterestSeederModule-d0830e410ab8409fcaf79092d65918d2"' : 'data-target="#xs-injectables-links-module-PlatformInterestSeederModule-d0830e410ab8409fcaf79092d65918d2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PlatformInterestSeederModule-d0830e410ab8409fcaf79092d65918d2"' :
                                        'id="xs-injectables-links-module-PlatformInterestSeederModule-d0830e410ab8409fcaf79092d65918d2"' }>
                                        <li class="link">
                                            <a href="injectables/PlatformInterestSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PlatformInterestSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PointsConversionSeederModule.html" data-type="entity-link">PointsConversionSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PointsConversionSeederModule-91b73cdd36134fb2089ef980357df67a"' : 'data-target="#xs-injectables-links-module-PointsConversionSeederModule-91b73cdd36134fb2089ef980357df67a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PointsConversionSeederModule-91b73cdd36134fb2089ef980357df67a"' :
                                        'id="xs-injectables-links-module-PointsConversionSeederModule-91b73cdd36134fb2089ef980357df67a"' }>
                                        <li class="link">
                                            <a href="injectables/PointsConversionSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PointsConversionSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoleSeederModule.html" data-type="entity-link">RoleSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RoleSeederModule-678b4cbb4a5dd83cf8937f17c2dbf865"' : 'data-target="#xs-injectables-links-module-RoleSeederModule-678b4cbb4a5dd83cf8937f17c2dbf865"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoleSeederModule-678b4cbb4a5dd83cf8937f17c2dbf865"' :
                                        'id="xs-injectables-links-module-RoleSeederModule-678b4cbb4a5dd83cf8937f17c2dbf865"' }>
                                        <li class="link">
                                            <a href="injectables/RolesSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RolesSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SeederModule.html" data-type="entity-link">SeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SeederModule-81afdd2b13368995cfc767e46a86a1ae"' : 'data-target="#xs-injectables-links-module-SeederModule-81afdd2b13368995cfc767e46a86a1ae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SeederModule-81afdd2b13368995cfc767e46a86a1ae"' :
                                        'id="xs-injectables-links-module-SeederModule-81afdd2b13368995cfc767e46a86a1ae"' }>
                                        <li class="link">
                                            <a href="injectables/Seeder.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>Seeder</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/StatesSeederModule.html" data-type="entity-link">StatesSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StatesSeederModule-41a5664d136b83596ff866b7b4646f55"' : 'data-target="#xs-injectables-links-module-StatesSeederModule-41a5664d136b83596ff866b7b4646f55"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StatesSeederModule-41a5664d136b83596ff866b7b4646f55"' :
                                        'id="xs-injectables-links-module-StatesSeederModule-41a5664d136b83596ff866b7b4646f55"' }>
                                        <li class="link">
                                            <a href="injectables/StateSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SuscriptionModule.html" data-type="entity-link">SuscriptionModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SuscriptionSeederModule.html" data-type="entity-link">SuscriptionSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SuscriptionSeederModule-a491633d2c48ad85d104eef33bd626ea"' : 'data-target="#xs-injectables-links-module-SuscriptionSeederModule-a491633d2c48ad85d104eef33bd626ea"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SuscriptionSeederModule-a491633d2c48ad85d104eef33bd626ea"' :
                                        'id="xs-injectables-links-module-SuscriptionSeederModule-a491633d2c48ad85d104eef33bd626ea"' }>
                                        <li class="link">
                                            <a href="injectables/SuscriptionSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SuscriptionSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThirdPartyInterestSeederModule.html" data-type="entity-link">ThirdPartyInterestSeederModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ThirdPartyInterestSeederModule-e8be2e02c68427d7830bb04c624bc426"' : 'data-target="#xs-injectables-links-module-ThirdPartyInterestSeederModule-e8be2e02c68427d7830bb04c624bc426"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThirdPartyInterestSeederModule-e8be2e02c68427d7830bb04c624bc426"' :
                                        'id="xs-injectables-links-module-ThirdPartyInterestSeederModule-e8be2e02c68427d7830bb04c624bc426"' }>
                                        <li class="link">
                                            <a href="injectables/ThirdPartyInterestSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ThirdPartyInterestSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionModule.html" data-type="entity-link">TransactionModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-fb9d0d86db6c9836bfbb66a5fa76706a"' : 'data-target="#xs-injectables-links-module-UserModule-fb9d0d86db6c9836bfbb66a5fa76706a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-fb9d0d86db6c9836bfbb66a5fa76706a"' :
                                        'id="xs-injectables-links-module-UserModule-fb9d0d86db6c9836bfbb66a5fa76706a"' }>
                                        <li class="link">
                                            <a href="injectables/StateUserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserDetailsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserDetailsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserRoleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserRoleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Bank.html" data-type="entity-link">Bank</a>
                            </li>
                            <li class="link">
                                <a href="classes/BankAccount.html" data-type="entity-link">BankAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientBankAccount.html" data-type="entity-link">ClientBankAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/Country.html" data-type="entity-link">Country</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDTO.html" data-type="entity-link">CreateUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Language.html" data-type="entity-link">Language</a>
                            </li>
                            <li class="link">
                                <a href="classes/PlatformInterest.html" data-type="entity-link">PlatformInterest</a>
                            </li>
                            <li class="link">
                                <a href="classes/PointsConversion.html" data-type="entity-link">PointsConversion</a>
                            </li>
                            <li class="link">
                                <a href="classes/PostgreExceptionFilter.html" data-type="entity-link">PostgreExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Promotion.html" data-type="entity-link">Promotion</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoutingNumber.html" data-type="entity-link">RoutingNumber</a>
                            </li>
                            <li class="link">
                                <a href="classes/State.html" data-type="entity-link">State</a>
                            </li>
                            <li class="link">
                                <a href="classes/StateBankAccount.html" data-type="entity-link">StateBankAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/StateTransaction.html" data-type="entity-link">StateTransaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/StateUser.html" data-type="entity-link">StateUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Suscription.html" data-type="entity-link">Suscription</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThirdPartyInterest.html" data-type="entity-link">ThirdPartyInterest</a>
                            </li>
                            <li class="link">
                                <a href="classes/Transaction.html" data-type="entity-link">Transaction</a>
                            </li>
                            <li class="link">
                                <a href="classes/TransactionInterest.html" data-type="entity-link">TransactionInterest</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAdministrator.html" data-type="entity-link">UserAdministrator</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserClient.html" data-type="entity-link">UserClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDetails.html" data-type="entity-link">UserDetails</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRole.html" data-type="entity-link">UserRole</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserSuscription.html" data-type="entity-link">UserSuscription</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/LoggerOptions.html" data-type="entity-link">LoggerOptions</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformSignUpInterceptor.html" data-type="entity-link">TransformSignUpInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ErrorCollection.html" data-type="entity-link">ErrorCollection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ErrorContent.html" data-type="entity-link">ErrorContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link">Response</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WinstonOptions.html" data-type="entity-link">WinstonOptions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});