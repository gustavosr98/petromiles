import { Test, TestingModule } from '@nestjs/testing';
import {BadRequestException, UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as generator from 'generate-password';

import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';
import {AuthService} from "@/modules/auth/auth.service";
import {UserClientService} from "@/modules/user/services/user-client.service";
import {UserAdministratorService} from "@/modules/user/services/user-administrator.service";
import {JwtService} from "@nestjs/jwt";
import {MailsService} from "@/modules/mails/mails.service";
import {UserService} from "@/modules/user/services/user.service";
import {ConfigService} from "@nestjs/config";
import {SuscriptionService} from "@/modules/suscription/service/suscription.service";
import {MailsSubjets} from "@/constants/mailsSubjectConst";
import {Role} from "@/enums/role.enum";
import {Suscription} from "@/enums/suscription.enum";


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

        authService = module.get<AuthService>(AuthService);

        userService = module.get<UserService>(
            UserService,
        );

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
        let expectedCreatedToken;
        let createdUser;

        describe('case: success', ()=>{
            describe('when everything works well', ()=>{
                beforeEach( async () => {
                    user = {
                        firstName:"prueba",
                        lastName:"prueba",
                        email: 'pp1@pp.com',
                        password: "$2b$10$LYeTN2eX5DdsmdAsQCb1YO/8U4mfY.AEH91ollaf39pu45TUScwKm",
                        salt:"$2b$10$LYeTN2eX5DdsmdAsQCb1YO",
                    };
                    ip = '::ffff:127.0.0.1';
                    expectedUser = {
                        user:{
                            email:"pp1@pp.com",
                            password: "$2b$10$LYeTN2eX5DdsmdAsQCb1YO/8U4mfY.AEH91ollaf39pu45TUScwKm",
                            salt:"$2b$10$LYeTN2eX5DdsmdAsQCb1YO",
                            googleToken:null,
                            facebookToken:null,
                            idUserClient:1
                        },
                        userDetails:{
                            firstName:"prueba",
                            lastName:"prueba",
                            middleName:null,
                            secondLastName:null,
                            birthdate:null,
                            address:null,
                            phone:null,
                            photo:null,
                            language:{
                                idLanguage:1,
                                name:"english",
                                shortname:"en"
                            },
                            userClient:null,
                            customerId:" ",
                            accountId:" ",
                            accountOwner:null,
                            idUserDetails:1
                        },
                        role:"CLIENT",
                    };
                    expectedCreatedToken = {
                        email: 'pp1@pp.com',
                        role: 'CLIENT',
                    };
                    expectedCreateUserSuscription = {
                        suscription:{
                            idSuscription: 1,
                            name: 'BASIC',
                            cost: 0,
                            upgradedAmount: null,
                            description: 'Suscription initial of every new client'
                        },
                    };
                    createdUser = {
                        user: {
                            email:"pp1@pp.com",
                            password: "$2b$10$LYeTN2eX5DdsmdAsQCb1YO/8U4mfY.AEH91ollaf39pu45TUScwKm",
                            salt:"$2b$10$LYeTN2eX5DdsmdAsQCb1YO",
                            googleToken:null,
                            facebookToken:null,
                            idUserClient:1,
                        },
                        userDetails: {
                            firstName: 'prueba',
                        },
                    };

                    expectedResult = {
                        email: "pp1@pp.com",
                        userDetails: {
                            firstName:"prueba",
                            lastName:"prueba",
                            middleName:null,
                            secondLastName:null,
                            birthdate:null,
                            address:null,
                            phone:null,
                            photo:null,
                            language:{
                                idLanguage:1,
                                name:"english",
                                shortname:"en"
                            },
                            userClient:null,
                            customerId:" ",
                            accountId:" ",
                            accountOwner:null,
                            idUserDetails:1
                        },
                        role: Role.CLIENT,
                        token: undefined,
                        id: 1,
                        federated: false,
                    };

                    (userClientService.create as jest.Mock).mockResolvedValue(
                        expectedUser,
                    );

                    jest
                        .spyOn(authService, 'createWelcomeEmail')
                        .mockResolvedValue();

                    (suscriptionService.createUserSuscription as jest.Mock).mockResolvedValue(
                        expectedCreateUserSuscription,
                    );

                    // jest
                    //     .spyOn(authService, 'createToken')
                    //     .mockResolvedValue(expectedCreatedToken);

                    result = await authService.createUserClient(
                        user, ip
                    );
                });

                it('should invoke userClientService.create()',  () => {
                    expect(userClientService.create).toHaveBeenCalledTimes(1);
                    expect(userClientService.create).toHaveBeenCalledWith(
                        user,
                        ip,
                    );
                });

                it('should invoke userClientService.createUserSuscription() ',  ()=> {
                    expect(suscriptionService.createUserSuscription).toHaveBeenCalledTimes(1);
                    expect(suscriptionService.createUserSuscription).toHaveBeenCalledWith(
                        createdUser.user,
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


    describe('createUserAdministrator(user)', ()=> {
        let expectedCreatedUser;
        let result;
        let expectedResult;
        let user;
        let passwordAdmin;

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
                        password:"6OjZQfo767",
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
                        email: 'admin2@petromiles.com' ,
                        id: 2,
                        password: ' ',
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
                        role: Role.ADMINISTRATOR,
                    };


                    (userAdministratorService.create as jest.Mock).mockResolvedValue(
                        expectedCreatedUser,
                    );
                    jest
                        .spyOn(authService, 'createWelcomeEmail')
                        .mockResolvedValue();

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
            });

        });
    });

    describe('validateUser(credentials)', ()=> {
        let credentials;
        let expectedToHash;
        let expectedResult;
        let password;
        let expectedInfo;
        let expectedEmail;

        describe('case: success', () => {
            describe('when everything works well', () => {
                beforeEach(async () => {
                    credentials = {
                        email:"prueba@petromiles.com",
                        password: "test1234",
                        role:"CLIENT",
                    };
                    password = 'test1234';
                    expectedInfo = {
                        user: {
                            password:"$2$10$nTfXptbWsD.f3.RVjrXLtec9TI13jydydfr37BM1F6eqZM9DNDfj6",
                            email:"prueba@petromiles.com",
                            salt:"$2b$10$nTfXptbWsD.f3.RVjrXLte",
                            id:1,
                        },
                        userDetails: {
                            idUserDetails:1,
                            firstName:"prueba",
                            middleName:null,
                            lastName:"prueba",
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
                            country:null
                        },
                    };
                    expectedEmail = {
                        userAdmin :{
                            email: 'prueba@petromiles.com',
                        },
                        userDetails:{
                            firstName: 'prueba'
                        },
                    };
                    expectedResult = {
                        email:"prueba@petromiles.com",
                        userDetails:{
                            idUserDetails:1,
                            firstName:"prueba",
                            middleName:null,
                            lastName:"prueba",
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
                            country:null
                        },
                        role:"CLIENT",
                        id:1,
                        token:"eyJhbGciOiJIUzI1VCJ9.eyJlbWFpbCI6Im1pZ3VlbEBwZXRyb21pbGVzLmNvbSIsInJvbGUiOiJDTElFTlQiLCJpYXQiOjE1OTcxNzU5MzMsImV4cCI6MTU5NzI2MjMzM30.dLj9DofI3OQKmejzLi08rdaI8XhWRobri2l87MaBsXc",
                        federated:false,
                    };
                    expectedToHash = {
                        password: 'test1234',
                        user: {
                            salt : '$2b$10$nTfXptbWsD.f3.RVjrXLte',
                        },
                    };
                    (userService.getActive as jest.Mock).mockResolvedValue(
                        expectedInfo,
                    );

                    jest
                        .spyOn(authService, 'hashPassword')
                        .mockResolvedValue(expectedToHash);

                    jest
                        .spyOn(authService, 'createWelcomeEmail')
                        .mockResolvedValue(expectedEmail);

                });
                it('should invoke UnauThhorizedException userService.getActive', () => {
                    expect(userService.getActive(credentials)
                    ).rejects.toThrow(UnauthorizedException);
                });
            });
        });
    });


});