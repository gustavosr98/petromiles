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
                                            'data-target="#controllers-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' : 'data-target="#xs-controllers-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' :
                                            'id="xs-controllers-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' : 'data-target="#xs-injectables-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' :
                                        'id="xs-injectables-links-module-AuthModule-c95e95d112cba1f21593c88eadb31275"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BankAccountModule.html" data-type="entity-link">BankAccountModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' : 'data-target="#xs-controllers-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' :
                                            'id="xs-controllers-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' }>
                                            <li class="link">
                                                <a href="controllers/BankAccountController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BankAccountController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' : 'data-target="#xs-injectables-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' :
                                        'id="xs-injectables-links-module-BankAccountModule-482614f48e9b9a8712e5063513bb2621"' }>
                                        <li class="link">
                                            <a href="injectables/BankAccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>BankAccountService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ClientBankAccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ClientBankAccountService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StateBankAccountService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateBankAccountService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateService</a>
                                        </li>
                                    </ul>
                                </li>
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
                                            'data-target="#controllers-links-module-ExampleModule-faaa1e0531d8d0ea5639c66793ce22f6"' : 'data-target="#xs-controllers-links-module-ExampleModule-faaa1e0531d8d0ea5639c66793ce22f6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ExampleModule-faaa1e0531d8d0ea5639c66793ce22f6"' :
                                            'id="xs-controllers-links-module-ExampleModule-faaa1e0531d8d0ea5639c66793ce22f6"' }>
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
                                            'data-target="#controllers-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' : 'data-target="#xs-controllers-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' :
                                            'id="xs-controllers-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' }>
                                            <li class="link">
                                                <a href="controllers/LanguageController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LanguageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' : 'data-target="#xs-injectables-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' :
                                        'id="xs-injectables-links-module-LanguageModule-dd0b12e613b281f83064785deadd1e0f"' }>
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
                                        'data-target="#injectables-links-module-MailsModule-4e9dee55af5969d14a2f95cac5cee412"' : 'data-target="#xs-injectables-links-module-MailsModule-4e9dee55af5969d14a2f95cac5cee412"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailsModule-4e9dee55af5969d14a2f95cac5cee412"' :
                                        'id="xs-injectables-links-module-MailsModule-4e9dee55af5969d14a2f95cac5cee412"' }>
                                        <li class="link">
                                            <a href="injectables/MailsService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ManagementModule.html" data-type="entity-link">ManagementModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ManagementModule-b6332da5ec585bb64bc7c6b463632f23"' : 'data-target="#xs-injectables-links-module-ManagementModule-b6332da5ec585bb64bc7c6b463632f23"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ManagementModule-b6332da5ec585bb64bc7c6b463632f23"' :
                                        'id="xs-injectables-links-module-ManagementModule-b6332da5ec585bb64bc7c6b463632f23"' }>
                                        <li class="link">
                                            <a href="injectables/PlatformInterestService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PlatformInterestService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PointsConversionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>PointsConversionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoleService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>RoleService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/StateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ThirdPartyInterestService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ThirdPartyInterestService</a>
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
                                        'data-target="#injectables-links-module-ThirdPartyInterestSeederModule-8f074e7100a92917277f8c645951aa27"' : 'data-target="#xs-injectables-links-module-ThirdPartyInterestSeederModule-8f074e7100a92917277f8c645951aa27"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThirdPartyInterestSeederModule-8f074e7100a92917277f8c645951aa27"' :
                                        'id="xs-injectables-links-module-ThirdPartyInterestSeederModule-8f074e7100a92917277f8c645951aa27"' }>
                                        <li class="link">
                                            <a href="injectables/ThirdPartyInterestSeederService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ThirdPartyInterestSeederService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TransactionModule.html" data-type="entity-link">TransactionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TransactionModule-e0cf183138ded2fd7d3f30349865343e"' : 'data-target="#xs-injectables-links-module-TransactionModule-e0cf183138ded2fd7d3f30349865343e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TransactionModule-e0cf183138ded2fd7d3f30349865343e"' :
                                        'id="xs-injectables-links-module-TransactionModule-e0cf183138ded2fd7d3f30349865343e"' }>
                                        <li class="link">
                                            <a href="injectables/StateTransactionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateTransactionService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TransactionInterestService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TransactionInterestService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TransactionService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TransactionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' : 'data-target="#xs-controllers-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' :
                                            'id="xs-controllers-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' : 'data-target="#xs-injectables-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' :
                                        'id="xs-injectables-links-module-UserModule-d672dcc03066a86bfa9e5d917cd790c0"' }>
                                        <li class="link">
                                            <a href="injectables/StateUserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StateUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserAdministratorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserAdministratorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserClientService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserClientService</a>
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
                                <a href="classes/CreateBankAccountDTO.html" data-type="entity-link">CreateBankAccountDTO</a>
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
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link">JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TransformSignUpInterceptor.html" data-type="entity-link">TransformSignUpInterceptor</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link">RolesGuard</a>
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
                                <a href="interfaces/createOptionsParams.html" data-type="entity-link">createOptionsParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Response.html" data-type="entity-link">Response</a>
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