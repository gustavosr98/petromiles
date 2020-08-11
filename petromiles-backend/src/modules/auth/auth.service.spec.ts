import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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
import {MailsSubjets} from "@/constants/mailsSubjectConst";


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
    let bcrypt: bcrypt;


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
        let expectedHashed;
        let expectedToHash;
        let result;

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {
                    password = 'test1234';
                    salt = '$2b$10$LYeTN2eX5DdsmdAsQCb1YO';
                    expectedHashed = {
                        password: '$2b$10$iUCj0m4iW03/7csR8XdYDe5UXhOybn54Webvni3KgZzYWGoPxiGcW'
                    };
                    expectedToHash = {
                        password : 'test1234',
                        salt : '$2b$10$LYeTN2eX5DdsmdAsQCb1YO',
                    };
                    (bcrypt.hash as jest.Mock).mockResolvedValue(
                        expectedToHash,
                    );

                    result = await authService.hashPassword(
                        password, salt
                    );
                });
                it('should invoke bcrypt.hash',  () => {
                    expect(bcrypt.hash,).toHaveBeenCalledTimes(1);
                    expect(bcrypt.hash,).toHaveBeenCalledWith(
                        password, salt
                    );
                });
                it('should return password hashed',  () => {
                    expect(result).toStrictEqual(expectedHashed);
                });
            });
        });
        describe('case: failure', () => {
            let expectedError: BadRequestException;
            describe('when the password is empty', () => {
                beforeEach(async () => {
                    password = '';
                    salt = '$2b$10$LYeTN2eX5DdsmdAsQCb1YO';
                    expectedHashed = {
                        password: '$2b$10$iUCj0m4iW03/7csR8XdYDe5UXhOybn54Webvni3KgZzYWGoPxiGcW'
                    };
                    expectedToHash = {
                        password :'',
                        salt : '$2b$10$LYeTN2eX5DdsmdAsQCb1YO',
                    };
                    (bcrypt.hash as jest.Mock).mockResolvedValue(
                        expectedToHash,
                    );

                    result = await authService.hashPassword(
                        password, salt
                    );
                });
                it('should throw when the password is empty', async () => {
                    await expect(bcrypt.hash).rejects.toThrow(BadRequestException);
                });

            });
        });
    });

    describe('createUserAdministrator(user)', ()=> {
        let expectedCreatedUser;
        let result;
        let expectedResult;
        let user;

        describe('case: success', ()=>{
            describe('when everything works well', ()=>{
                beforeEach( async () => {
                    user = {
                        firstName:"admin",
                        middleName:"",
                        lastName:"admin",
                        secondLastName:"",
                        email:"admin2@petromiles.com",
                        birthdate:null,
                        phone:"",
                        address:"",
                        country:{},
                        salt:"$2b$10$VhjJiCEGYFRhJdrqQ.wBw.",
                        password:"$2b$10$VhjJiCEGYFRhJdrqQ.wBw.P9hAvDRPtTcWA2z5PWcF0lzDoXIb7ma",
                    };

                    expectedCreatedUser = {
                        userAdmin:{
                            email:"admin2@petromiles.com",
                            country:{},
                            salt:"$2b$10$VhjJiCEGYFRhJdrqQ.wBw.",
                            password:"$2b$10$VhjJiCEGYFRhJdrqQ.wBw.P9hAvDRPtTcWA2z5PWcF0lzDoXIb7ma",
                            photo:null,
                            idUserAdministrator:2
                        },
                        userDetails:{
                            firstName:"admin",
                            lastName:"admin",
                            middleName:"",
                            secondLastName:"",
                            birthdate:null,
                            address:"",
                            phone:"",
                            photo:null,
                            language:{
                                idLanguage:1,
                                name:"english",
                                "shortname":"en"
                            },
                            userAdministrator:null,
                            customerId:null,
                            accountId:null,
                            idUserDetails:1
                        },
                        role:"ADMINISTRATOR",
                    };
                    expectedResult = {
                        email: expectedCreatedUser.userAdmin.email,
                        password: expectedCreatedUser.password,
                        userDetails: expectedCreatedUser.userDetails,
                        role: 'ADMINISTRATOR',
                        id: 2,
                    };

                    (userAdministratorService.create as jest.Mock).mockResolvedValue(
                        user,
                    );

                    result = await authService.createUserAdministrator(
                        user,
                    );
                });

                it('should invoke userAdministratorService.create',  ()=> {
                    expect(userAdministratorService.create).toHaveBeenCalledTimes(1);
                    expect(userAdministratorService.create).toHaveBeenCalledWith(
                        user
                    );
                });
                it('should return created administrator',  ()=> {
                    expect(result).toStrictEqual(expectedResult)

                });
            });

        });
    });

    describe('validateUser(credentials)', ()=> {
        let expectedCredentials;
        let credentials;
        let expectedToHash;
        let expectedResult;
        let result;
        let password;
        let expectedInfo;

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {
                    expectedCredentials ={
                        email:"prueba@petromiles.com",
                        password:"test1234",
                        role:"CLIENT",
                    };
                    credentials = {
                        email:"prueba@petromiles.com",
                        password:"test1234",
                        role:"CLIENT",
                    };
                    password = 'test1234';
                    expectedInfo = {
                        user: {
                                password:"$2$10$nTfXptbWsD.f3.RVjrXLtec9TI13jydydfr37BM1F6eqZM9DNDfj6",
                                email:"miguel@petromiles.com",
                                salt:"$2b$10$nTfXptbWsD.f3.RVjrXLte",
                                id:1
                            },
                        userDetails: {
                            idUserDetails:1,
                            firstName:"miguel",
                            middleName:null,
                            lastName:"coccaro",
                            secondLastName:null,
                            birthdate:null,
                            address:null,
                            phone:null,
                            photo:null,
                            customerId:"",
                            accountId:"",
                            language:{
                                idLanguage:1,
                                name:"english",
                                shortname:"en"
                            },
                            country:null
                        },
                    };
                    expectedResult = {
                        email:"miguel@petromiles.com",
                        userDetails:{
                            idUserDetails:1,
                            firstName:"miguel",
                            middleName:null,
                            lastName:"coccaro",
                            secondLastName:null,
                            birthdate:null,
                            address:null,
                            phone:null,
                            photo:null,
                            customerId:'',
                            accountId:"",
                            language:{
                                idLanguage:1,
                                name:"english",
                                shortname:"en"
                            },
                            country:null
                        },
                        role:"CLIENT",
                        id:1,
                        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pZ3VlbEBwZXRyb21pbGVzLmNvbSIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE1OTcxNzU5MzMsImV4cCI6MTU5NzI2MjMzM30.dLj9DofI3OQKmejzLi08rdaI8XhWRobri2l87MaBsXc",
                        federated:false,
                    };
                    expectedToHash = {
                        password: 'test1234',
                        salt : '$2b$10$nTfXptbWsD.f3.RVjrXLte',
                    };
                    (userService.getActive as jest.Mock).mockResolvedValue(
                        expectedCredentials,
                    );
                    (authService.hashPassword as jest.Mock).mockResolvedValue(
                        expectedToHash
                    )

                    result = await authService.validateUser(
                        expectedCredentials,
                    );
                });
                it('should invoke userService.getActive', () => {
                    expect(userService.getActive).toHaveBeenCalledTimes(1);
                    expect(userService.getActive).toHaveBeenCalledWith(
                        credentials,
                    );
                });
                it('should invoke hashpassword',  () => {
                    expect(authService.hashPassword).toHaveBeenCalledTimes(1);
                    expect(authService.hashPassword).toHaveBeenCalledWith(
                        password, expectedInfo.user.salt
                    );
                });
                it('should return a result', () => {
                    expect(result).toStrictEqual(expectedResult);
                });
            });
        });
    });

    describe('recoverPassword(credentials)', ()=> {
        let expectedCredentials;
        let credentials;
        let expectedInfo;
        let user;
        let expectedUserDetails;
        let password;
        let salt;
        let expectedMessage;
        let subject;
        let languageMails

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {
                    expectedCredentials = {
                        email:"ed@co.com",
                        role:"CLIENT",
                    };
                    credentials = {
                        email:"ed@co.com",
                        role:"CLIENT",
                    }
                    password= "$2b$10$/hMgSe.ho1Gt.8cnVAcVKOYtzJePi/N/EEOo8FKsVqWWBZtsEawde";
                    salt = "$2b$10$/hMgSe.ho1Gt.8cnVAcVKO";
                    expectedInfo = {
                        user:{
                            password:"$2b$10$/hMgSe.ho1Gt.8cnVAcVKOYtzJePi/N/EEOo8FKsVqWWBZtsEawde",
                            email:"ed@co.com",
                            salt:"$2b$10$/hMgSe.ho1Gt.8cnVAcVKO",
                            id:1,
                        },
                        userDetails:{
                            idUserDetails:14,
                            firstName:"Ed",
                            middleName:"Jose",
                            lastName:"Cocca",
                            secondLastName:null,
                            birthdate:null,
                            address:null,
                            phone:null,
                            photo:null,
                            customerId:"",
                            accountId:" ",
                            language:{
                                idLanguage:1,
                                name:"english",
                                shortname:"en"
                            },
                            country:null
                        },
                    };
                    user = {
                        password:"$2b$10$/hMgSe.ho1Gt.8cnVAcVKOYtzJePi/N/EEOo8FKsVqWWBZtsEawde",
                        email:"ed@co.com",
                        salt:"$2b$10$/hMgSe.ho1Gt.8cnVAcVKO",
                        id:6,
                    };
                    expectedUserDetails = {
                        idUserDetails:14,
                        firstName:"Ed",
                        middleName:"Jose",
                        lastName:"Cocca",
                        secondLastName:null,
                        birthdate:null,
                        address:null,
                        phone:null,
                        photo:null,
                        customerId:" ",
                        accountId:" ",
                        language:{
                            idLanguage:1,
                            name:"english",
                            shortname:"en"
                        },
                        country:null,
                    };
                    languageMails = expectedInfo.userDetails.language.name;
                    subject = MailsSubjets.recover[languageMails];

                    expectedMessage = {
                        to: expectedInfo.user.email,
                        subject: subject,
                        templateId: 'prueba',
                        dynamic_template_data: {
                            user: expectedInfo.userDetails.firstName,
                        }
                    };

                    (userService.getActive as jest.Mock).mockResolvedValue(
                        expectedCredentials,
                    );
                    (userAdministratorService.updatePasswordWithoutCurrent as jest.Mock).mockResolvedValue(
                        user,
                    );
                    (mailsService.sendEmail as jest.Mock).mockImplementation();

                });
                it('should invoke userService.getActive',  () => {
                    expect(userService.getActive).toHaveBeenCalledTimes(1);
                    expect(userService.getActive).toHaveBeenCalledWith(
                        credentials,
                    );
                });
                it('should invoke userAdminitratorService.updatePasswordWithoutCurrent',  ()=> {
                    expect(userAdministratorService.updatePasswordWithoutCurrent).toHaveBeenCalledTimes(1);
                    expect(userAdministratorService.updatePasswordWithoutCurrent).toHaveBeenCalledWith(
                        user, password, salt,
                    )

                });

                it('should invoke mailsService.sendEmail()', () => {
                    expect(mailsService.sendEmail).toHaveBeenCalledTimes(1);
                    expect(mailsService.sendEmail).toHaveBeenCalledWith(expectedMessage);
                });
            });
        });
    });

});