import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';
import {AuthService} from "@/modules/auth/auth.service";
import {UserClientService} from "@/modules/user/services/user-client.service";
import {UserAdministratorService} from "@/modules/user/services/user-administrator.service";
import {JwtService} from "@nestjs/jwt";
import {MailsService} from "@/modules/mails/mails.service";
import {UserService} from "@/modules/user/services/user.service";
import {PaymentProviderService} from "@/modules/payment-provider/payment-provider.service";
import {ConfigService} from "@nestjs/config";
import {SuscriptionService} from "@/modules/suscription/service/suscription.service";
import {PaymentsService} from "@/modules/payments/services/payments.service";
import {ClientBankAccount} from "@/entities/client-bank-account.entity";
import {UserClient} from "@/entities/user-client.entity";
import {Transaction} from "@/entities/transaction.entity";
import {TransactionService} from "@/modules/transaction/services/transaction.service";
import {PointsConversionService} from "@/modules/management/services/points-conversion.service";
import {ThirdPartyInterestService} from "@/modules/management/services/third-party-interest.service";
import {PlatformInterestService} from "@/modules/management/services/platform-interest.service";
import {http} from "winston";
import exp = require("constants");


describe( 'AuthService', () => {
    let authService: AuthService;
    let RepositoryMock: jest.Mock;
    let userClientService: UserClientService;
    let UserClientServiceMock: jest.Mock<Partial<UserClientService>>;
    let userAdministratorService: UserAdministratorService;
    let UserAdministratorServiceMock: jest.Mock<Partial<UserAdministratorService>>;
    let jwtService: JwtService;
    let JwtServiceMock: jest.Mock<Partial<JwtService>>;
    let mailsService: MailsService;
    let MailsServiceMock: jest.Mock<Partial<MailsService>>
    let configService: ConfigService;
    let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
    let userService: UserService;
    let UserServiceMock: jest.Mock<Partial<UserService>>;
    let suscriptionService: SuscriptionService;
    let SuscriptionServiceMock: jest.Mock<Partial<SuscriptionService>>;


    beforeEach( () => {
        RepositoryMock = jest.fn(()=>({
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }));
        UserClientServiceMock = jest.fn<
            Partial<UserClientService>,
            UserClientService[]
            >(() => ({
            create: jest.fn(),
            updatePasswordWithoutCurrent: jest.fn(),
        }));
        UserAdministratorServiceMock = jest.fn<
            Partial<UserAdministratorService>,
            UserAdministratorService[]
            >(() => ({
            create: jest.fn(),
            updatePasswordWithoutCurrent: jest.fn(),
        }));
        JwtServiceMock = jest.fn<
            Partial<JwtService>,
            JwtService[]
            >(() => ({
            sign: jest.fn(),
        }));
        MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
            sendEmail: jest.fn(),
        }));
        ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
            () => ({
                get: jest.fn(),
            }),
        );
        UserServiceMock = jest.fn<Partial<UserService>, UserService[]>(
            () => ({
                getActive: jest.fn(),
            }),
        );
        SuscriptionServiceMock = jest.fn<
            Partial<SuscriptionService>,
            SuscriptionService[]
            >(() => ({
            createUserSuscription: jest.fn(),
        }));
    });

    beforeEach( async ()=> {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                WinstonModule.forRoot(
                    createOptions({ fileName: 'petromiles-global.log' }),
                ),
            ],
            providers: [
                AuthService,
                {
                    provide: UserClientService,
                    useClass: UserClientServiceMock,
                },
                {
                    provide: UserAdministratorService,
                    useClass: UserAdministratorServiceMock,
                },
                {
                    provide: JwtService,
                    useClass: JwtServiceMock,
                },
                {
                    provide: MailsService,
                    useClass: MailsServiceMock,
                },
                {
                    provide: ConfigService,
                    useClass: ConfigServiceMock,
                },
                {
                    provide: UserService,
                    useClass: UserServiceMock,
                },
                {
                    provide: SuscriptionService,
                    useClass: SuscriptionServiceMock,
                },
            ],
        }).compile();

        userClientService = module.get<UserClientService>(
            UserClientService,
        );
        userAdministratorService = module.get<UserAdministratorService>(UserAdministratorService);
        jwtService = module.get<JwtService>(
            JwtService
        );
        userClientService = module.get<UserClientService>(UserClientService);
        mailsService = module.get<MailsService>(MailsService);
        configService = module.get<ConfigService>(ConfigService);
        suscriptionService = module.get<SuscriptionService>(SuscriptionService);
    });

    describe('createUserClient(user, ip)', ()=>{
        let expectedUser;
        let expectedCreateUserSuscription;
        let result;
        let expectedResult;
        let user;
        let ip;
        let createdUser;
        let Suscription;

        describe('case: success', ()=>{
            describe('when everything works well', ()=>{
                beforeEach( async () => {
                    user = {
                        email: 'pp1@pp.com',
                        firstName:"prueba",
                        lastName:"petro",
                        password: "$2b$10$LYeTN2eX5DdsmdAsQCb1YO/8U4mfY.AEH91ollaf39pu45TUScwKm",
                        salt:"$2b$10$LYeTN2eX5DdsmdAsQCb1YO",
                    };
                    ip = {
                        ip : '::ffff:127.0.0.1'
                    };
                    expectedUser = {
                        firstName:"prueba",
                        lastName:"petro",
                        email: "pp1@pp.com",
                        password: "$2b$10$LYeTN2eX5DdsmdAsQCb1YO/8U4mfY.AEH91ollaf39pu45TUScwKm",
                        salt:"$2b$10$LYeTN2eX5DdsmdAsQCb1YO",
                        ip : '::ffff:127.0.0.1'
                    };
                    expectedCreateUserSuscription = {
                        user: {
                            email:"pp1@pp.com",
                            password:"$2b$10$nBRiB1brpskYQn0YoO9IdOdyoZge/k/fQ/.DW.Jf5b4C0CJkdXZVi",
                            salt:"$2b$10$nBRiB1brpskYQn0YoO9IdO",
                            googleToken:null,
                            facebookToken:null,
                            idUserClient:1
                        },
                    };
                    expectedResult = {
                        email: 'pp1@pp.com',
                        userDetails : {
                            firstName: "pruebaC",
                            lastName: "charlie",
                            middleName: null,
                            secondLastName: null,
                            birthdate: null,
                            address: null,
                            phone: null,
                            photo: null,
                            language: {
                                idLanguage: 1,
                                name: "english",
                                shortname: "en"
                            },
                            userClient: null,
                            customerId: "cus_HoPFey3NEkJDHv",
                            accountId: "acct_1HEmRKC2gPHNel3Q",
                            idUserDetails: 19
                        },
                        token: 'prueba',
                        id: 1,
                        federated: false,
                    };

                    (userClientService.create as jest.Mock).mockResolvedValue(
                        expectedUser,
                    );
                    (suscriptionService.createUserSuscription as jest.Mock).mockResolvedValue(
                        expectedCreateUserSuscription,
                    );

                    result = await authService.createUserClient(
                        user, ip
                    );
                });

                it('should invoke userClientService.create()',  () => {
                    expect(userClientService.create).toHaveBeenCalledTimes(1);
                    expect(userClientService.create).toHaveBeenCalledWith({
                        user: expectedUser,
                        ip: expectedUser.ip,
                        }
                    );
                });

                it('shouldinvoke userClientService.createUserSuscriptioin() ',  ()=> {
                    expect(suscriptionService.createUserSuscription).toHaveBeenCalledTimes(1);
                    expect(suscriptionService.createUserSuscription).toHaveBeenCalledWith(
                        expectedCreateUserSuscription.user,
                        Suscription.BASIC,
                        null)
                });

                it('should return a created user client', () => {
                    expect(result).toStrictEqual(expectedResult);
                });
            });

        });
    });

    describe('createToken(email,role)', ()=> {
        let expectedPayload;
        let email;
        let role;
        let result;

        describe('case: success', ()=>{
            describe('when everything works well', () => {
                beforeEach( async ()=> {
                    email= 'pp1@pp.com';
                    role= 'CLIENT';
                    expectedPayload= {
                        email: 'pp1@pp.com',
                        role: 'CLIENT',
                    };

                    (jwtService.sign as jest.Mock).mockResolvedValue(
                        expectedPayload,
                    );

                    result = await authService.createToken(
                        email, role,
                    );
                });
                it('should invoke pointsConversionService.getRecentPointsConversion()', ()=>{
                    expect(jwtService.sign,).toHaveBeenCalledTimes(1);
                });
                it('should return a token', ()=> {
                    expect(result).toStrictEqual(expectedPayload);
                });
            });
        });
    });

    describe('hashPassword(password,salt)', ()=> {
        let password;
        let salt;

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {
                    password = 'prueba';
                    salt = '$2b$10$LYeTN2eX5DdsmdAsQCb1YO'
                });
            });
        });
    });

    describe('createUserAdministrator(user)', ()=> {

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {

                });
            });
        });
    });

    describe('validateUser(credentials)', ()=> {

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {

                });
            });
        });
    });

    describe('recoverPassword(credentials)', ()=> {

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {

                });
            });
        });
    });

    describe('createWelcomeEmail(email, name)', ()=> {

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {

                });
            });
        });
    });


});