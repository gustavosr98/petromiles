import { getRepositoryToken } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { WinstonModule } from 'nest-winston';

import createOptions from '@/logger/winston/winston-config';

import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { UserRole } from '@/entities/user-role.entity';
import { StateUser } from '@/entities/state-user.entity';
import { Language } from '@/entities/language.entity';

import { PaymentProviderService } from '@/modules/payment-provider/payment-provider.service';
import { UserClientService } from '@/modules/user/services/user-client.service';
import { ManagementService } from '@/modules/management/services/management.service';

import {
  expectedActiveClient,
  expectedDeletedClient,
} from '@/modules/user/services/mocks/user-client.mock';
import { Role } from '@/enums/role.enum';
import { StateName } from '@/enums/state.enum';
import { Language as LanguageName } from '@/enums/language.enum';

describe('UserClientService', () => {
  let userClientService: UserClientService;
  let RepositoryMock: jest.Mock;
  let userClientRepository: Repository<UserClient>;
  let userDetailsRepository: Repository<UserDetails>;
  let userRoleRepository: Repository<UserRole>;
  let PaymentProviderServiceMock: jest.Mock<Partial<PaymentProviderService>>;
  let paymentProviderService: PaymentProviderService;
  let ManagementServiceMock: jest.Mock<Partial<ManagementService>>;
  let managementService: ManagementService;
  let stateUserRepository: Repository<StateUser>;
  let languageRepository: Repository<Language>;
  let execute: jest.Mock;

  beforeEach(() => {
    let innerJoin = jest.fn().mockReturnThis();
    let where = jest.fn().mockReturnThis();
    let andWhere = jest.fn().mockReturnThis();
    let set = jest.fn().mockReturnThis();
    let update = jest.fn().mockReturnThis();
    execute = jest.fn().mockReturnThis();

    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        set,
        update,
        innerJoin,
        where,
        andWhere,
        execute,
      })),
    }));

    ManagementServiceMock = jest.fn<
      Partial<ManagementService>,
      ManagementService[]
    >(() => ({
      getLanguage: jest.fn(),
      getRoleByName: jest.fn(),
      getState: jest.fn(),
    }));

    PaymentProviderServiceMock = jest.fn<
      Partial<PaymentProviderService>,
      PaymentProviderService[]
    >(() => ({
      createAccount: jest.fn(),
      createCustomer: jest.fn(),
    }));
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        UserClientService,
        {
          provide: getRepositoryToken(UserDetails),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(Language),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserRole),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: getRepositoryToken(StateUser),
          useClass: RepositoryMock,
        },
        {
          provide: PaymentProviderService,
          useClass: PaymentProviderServiceMock,
        },
        {
          provide: ManagementService,
          useClass: ManagementServiceMock,
        },
      ],
    }).compile();

    userClientService = module.get<UserClientService>(UserClientService);
    paymentProviderService = module.get<PaymentProviderService>(
      PaymentProviderService,
    );
    managementService = module.get<ManagementService>(ManagementService);
    userDetailsRepository = module.get(getRepositoryToken(UserDetails));
    userClientRepository = module.get(getRepositoryToken(UserClient));
    userRoleRepository = module.get(getRepositoryToken(UserRole));
    stateUserRepository = module.get(getRepositoryToken(StateUser));
    languageRepository = module.get(getRepositoryToken(Language));
  });

  describe('findAll()', () => {
    describe('case: success', () => {
      let expectedUsers;
      let expectedNotDeletedUsers;
      let result;
      describe('when everything works well', () => {
        expectedUsers = Array(expectedActiveClient, expectedDeletedClient);
        expectedNotDeletedUsers = Array(expectedActiveClient);
        beforeEach(async () => {
          (userClientRepository.find as jest.Mock).mockResolvedValue(
            expectedUsers,
          );

          result = await userClientService.findAll();
        });

        it('should invoke userClientRepository.find()', () => {
          expect(userClientRepository.find).toHaveBeenCalledTimes(1);
        });
        it('should return an array without deleted users', () => {
          expect(result).toStrictEqual(expectedNotDeletedUsers);
        });
      });

      describe('no deleted customers', () => {
        expectedUsers = Array(expectedActiveClient);
        expectedNotDeletedUsers = Array(expectedActiveClient);
        beforeEach(async () => {
          (userClientRepository.find as jest.Mock).mockResolvedValue(
            expectedUsers,
          );

          result = await userClientService.findAll();
        });

        it('should invoke userClientRepository.find()', () => {
          expect(userClientRepository.find).toHaveBeenCalledTimes(1);
        });
        it('should return an array without deleted users', () => {
          expect(result).toStrictEqual(expectedNotDeletedUsers);
        });
      });

      describe('no users', () => {
        expectedUsers = [];
        expectedNotDeletedUsers = [];
        beforeEach(async () => {
          (userClientRepository.find as jest.Mock).mockResolvedValue(
            expectedUsers,
          );

          result = await userClientService.findAll();
        });

        it('should invoke userClientRepository.find()', () => {
          expect(userClientRepository.find).toHaveBeenCalledTimes(1);
        });
        it('should return an empty array', () => {
          expect(result).toStrictEqual(expectedNotDeletedUsers);
        });
      });
    });
  });

  describe('create(createUserDTO,ip)', () => {
    describe('case: success', () => {
      let createUserDTO;
      let ip;
      let expectedPaymentProviderCustomer;
      let expectedPaymentProviderAccount;
      let expectedUserClient;
      let expectedUserDetails;
      let expectedLanguage;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          createUserDTO = {
            firstName: 'petro',
            lastName: 'miles',
            email: 'test@petromiles.com',
            role: 'CLIENT',
          };
          ip = '::1';
          expectedPaymentProviderCustomer = {
            id: 'cus_HojpG0r4lZKa5G',
          };
          expectedPaymentProviderAccount = {
            id: 'acct_1HF6MHAZbOHIXz51',
          };
          expectedUserClient = {
            email: 'test@petromiles.com',
            role: 'CLIENT',
            salt: null,
            googleToken: null,
            facebookToken: null,
            password: null,
            idUserClient: 1,
          };
          expectedLanguage = {
            idLanguage: 1,
            name: 'english',
            shortname: 'en',
          };
          expectedUserDetails = {
            user: {
              email: 'test@petromiles.com',
              role: 'CLIENT',
              salt: null,
              googleToken: null,
              facebookToken: null,
              password: null,
              idUserClient: 1,
            },
            userDetails: {
              firstName: 'petro',
              lastName: 'miles',
              middleName: null,
              secondLastName: null,
              birthdate: null,
              address: null,
              phone: null,
              photo: null,
              language: { idLanguage: 1, name: 'english', shortname: 'en' },
              userClient: null,
              customerId: 'cus_HojpG0r4lZKa5G',
              accountId: 'acct_1HF6MHAZbOHIXz51',
              accountOwner: null,
              idUserDetails: 4,
            },
            role: 'CLIENT',
          };

          jest.spyOn(userClientService, 'get').mockResolvedValue(undefined);

          (paymentProviderService.createCustomer as jest.Mock).mockResolvedValue(
            expectedPaymentProviderCustomer,
          );

          (paymentProviderService.createAccount as jest.Mock).mockResolvedValue(
            expectedPaymentProviderAccount,
          );

          (userClientRepository.save as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          jest
            .spyOn<any, string>(userClientService, 'completeRegistration')
            .mockResolvedValue(expectedUserDetails);

          (managementService.getLanguage as jest.Mock).mockResolvedValue(
            expectedLanguage,
          );

          result = await userClientService.create(createUserDTO, ip);
        });

        it('should invoke paymentProviderService.createCustomer()', () => {
          expect(paymentProviderService.createCustomer).toHaveBeenCalledTimes(
            1,
          );
          expect(paymentProviderService.createCustomer).toHaveBeenCalledWith({
            email: createUserDTO.email,
            name: `${createUserDTO.firstName} ${createUserDTO.lastName}`,
          });
        });

        it('should invoke paymentProviderService.createAccount()', () => {
          expect(paymentProviderService.createAccount).toHaveBeenCalledTimes(1);
          expect(paymentProviderService.createAccount).toHaveBeenCalledWith({
            email: createUserDTO.email,
            name: createUserDTO.firstName,
            lastName: createUserDTO.lastName,
            customerId: expectedPaymentProviderCustomer.id,
            ip,
          });
        });

        it('should invoke userClientRepository.save()', () => {
          const {
            firstName,
            lastName,
            middleName,
            secondLastName,
            birthdate,
            address,
            phone,
            photo,
            ...user
          } = createUserDTO;
          expect(userClientRepository.save).toHaveBeenCalledTimes(1);
          expect(userClientRepository.save).toHaveBeenCalledWith(user);
        });
        it('should invoke managementService.getLanguage()', () => {
          expect(managementService.getLanguage).toHaveBeenCalledTimes(1);
          expect(managementService.getLanguage).toHaveBeenCalledWith(
            LanguageName.ENGLISH,
          );
        });

        it('should return user details', () => {
          expect(result).toStrictEqual(expectedUserDetails);
        });
      });
    });

    describe('case: failure', () => {
      describe('when email already exists', () => {
        let createUserDTO;
        let ip;
        let expectedUserClient;
        let expectedError: BadRequestException;
        beforeEach(async () => {
          createUserDTO = {
            firstName: 'petro',
            lastName: 'miles',
            email: 'test@petromiles.com',
            role: 'CLIENT',
          };
          ip = '::1';
          expectedUserClient = {
            email: 'test@petromiles.com',
            role: 'CLIENT',
            salt: null,
            googleToken: null,
            facebookToken: null,
            password: null,
            idUserClient: 1,
          };

          jest
            .spyOn(userClientService, 'get')
            .mockResolvedValue(expectedUserClient);
          expectedError = new BadRequestException();

          jest
            .spyOn(userClientService, 'create')
            .mockRejectedValue(expectedError);
        });

        it('should throw when email is taken', async () => {
          await expect(
            userClientService.create(createUserDTO, ip),
          ).rejects.toThrow(BadRequestException);
        });

        it('should not invoke paymentProviderService.createCustomer()', () => {
          expect(paymentProviderService.createCustomer).not.toHaveBeenCalled();
        });
        it('should not invoke paymentProviderService.createAccount()', () => {
          expect(paymentProviderService.createAccount).not.toHaveBeenCalled();
        });
        it('should not invoke userClientRepository.save ()', () => {
          expect(userClientRepository.save).not.toHaveBeenCalled();
        });

        it('should not invoke managementService.getLanguage()', () => {
          expect(managementService.getLanguage).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('createRole(user)', () => {
    describe('case: success', () => {
      let user;
      let expectedUserRole;
      let expectedRole;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = {
            email: 'test@petromiles.com',
            password:
              '$2b$10$67KZFaIa/19B83PlWQQx4ecwel5GyVIjXduh8427C1yqxJ/1131Wi',
            salt: '$2b$10$67KZFaIa/19B83PlWQQx4e',
            googleToken: null,
            facebookToken: null,
            idUserClient: 1,
          };

          expectedRole = { idRole: 2, name: 'CLIENT' };
          expectedUserRole = {
            role: expectedRole,
            userClient: {
              email: 'test@petromiles.com',
              password:
                '$2b$10$67KZFaIa/19B83PlWQQx4ecwel5GyVIjXduh8427C1yqxJ/1131Wi',
              salt: '$2b$10$67KZFaIa/19B83PlWQQx4e',
              googleToken: null,
              facebookToken: null,
              idUserClient: 1,
            },
            idUserRole: 1,
          };
          (managementService.getRoleByName as jest.Mock).mockResolvedValue(
            expectedRole,
          );
          (userRoleRepository.save as jest.Mock).mockResolvedValue(
            expectedUserRole,
          );

          result = await userClientService.createRole(user);
        });

        it('should invoke managementService.getRoleByName()', () => {
          expect(managementService.getRoleByName).toHaveBeenCalledTimes(1);
          expect(managementService.getRoleByName).toHaveBeenCalledWith(
            Role.CLIENT,
          );
        });
        it('should invoke userRoleRepository.save()', () => {
          expect(userRoleRepository.save).toHaveBeenCalledTimes(1);
          expect(userRoleRepository.save).toHaveBeenCalledWith({
            role: expectedRole,
            userClient: user,
          });
        });
        it('should return an user role object', () => {
          expect(result).toStrictEqual(expectedUserRole);
        });
      });
    });
  });

  describe('createState(user,stateName,description)', () => {
    describe('case: success', () => {
      let user;
      let stateName;
      let expectedStateUser;
      let expectedState;
      let result;
      let description;
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = {
            email: 'test@petromiles.com',
            password:
              '$2b$10$De2kRxWEV1j8a5Eim2881uVPjTKrHlPhiXtpZCX26oeNO7rWMSmqO',
            salt: '$2b$10$De2kRxWEV1j8a5Eim2881u',
            googleToken: null,
            facebookToken: null,
            idUserClient: 1,
          };
          stateName = StateName.ACTIVE;
          description = 'test';
          expectedState = {
            idState: 1,
            name: 'active',
            description:
              'This state indicates that the object is ready to be used',
          };

          expectedStateUser = {
            userClient: user,
            state: expectedState,
            initialDate: '2020-08-11T23:42:35.128Z',
            description: 'test',
            finalDate: null,
            idStateUser: 1,
          };

          (managementService.getState as jest.Mock).mockResolvedValue(
            expectedState,
          );

          (stateUserRepository.save as jest.Mock).mockResolvedValue(
            expectedStateUser,
          );

          result = await userClientService.createState(
            user,
            stateName,
            description,
          );
        });

        it('should invoke managementService.getState()', () => {
          expect(managementService.getState).toHaveBeenCalledTimes(1);
          expect(managementService.getState).toHaveBeenCalledWith(stateName);
        });
        it('should invoke stateUserRepository.save()', () => {
          expect(stateUserRepository.save).toHaveBeenCalledTimes(1);
        });
        it('should return an state user object', () => {
          expect(result).toStrictEqual(expectedStateUser);
        });
      });
    });
  });

  describe('createDetails( userClientDetails,accountOwner)', () => {
    describe('case: success', () => {
      let userClientDetails;
      let expectedUserDetails;
      let accountOwner;
      let result;
      describe('when accountOwner is null', () => {
        beforeEach(async () => {
          userClientDetails = {
            firstName: 'petro',
            lastName: 'miles',
            language: { idLanguage: 1, name: 'english', shortname: 'en' },
            userClient: {
              email: 'test@petromiles.com',
              password:
                '$2b$10$H1XfwQjhOhrgXfaHGFRDRew1FIwm/.YJBbujF6hU8zCp5eiExnimS',
              salt: '$2b$10$H1XfwQjhOhrgXfaHGFRDRe',
              googleToken: null,
              facebookToken: null,
              idUserClient: 1,
            },
            customerId: 'cus_HolEeiXLpfllA2',
            accountId: 'acct_1HF7hfL9nokkIfXn',
          };
          accountOwner = null;
          expectedUserDetails = userClientDetails;
          expectedUserDetails.userClient = null;

          (userDetailsRepository.save as jest.Mock).mockResolvedValue(
            userClientDetails,
          );

          result = await userClientService.createDetails(
            userClientDetails,
            accountOwner,
          );
        });

        it('should invoke userDetailsRepository.save()', () => {
          expect(userDetailsRepository.save).toHaveBeenCalledTimes(1);
          expect(userDetailsRepository.save).toHaveBeenCalledWith({
            ...userClientDetails,
            accountOwner,
          });
        });

        it('should return an  user details object', () => {
          expect(result).toStrictEqual(expectedUserDetails);
        });
      });

      describe('when accountOwner is not null', () => {
        beforeEach(async () => {
          userClientDetails = {
            firstName: 'petro',
            lastName: 'miles',
            language: { idLanguage: 1, name: 'english', shortname: 'en' },
            userClient: {
              email: 'test@petromiles.com',
              password:
                '$2b$10$H1XfwQjhOhrgXfaHGFRDRew1FIwm/.YJBbujF6hU8zCp5eiExnimS',
              salt: '$2b$10$H1XfwQjhOhrgXfaHGFRDRe',
              googleToken: null,
              facebookToken: null,
              idUserClient: 1,
            },
            customerId: 'cus_HolEeiXLpfllA2',
            accountId: 'acct_1HF7hfL9nokkIfXn',
          };
          accountOwner = 'yes';
          expectedUserDetails = userClientDetails;
          expectedUserDetails.userClient = null;

          (userDetailsRepository.save as jest.Mock).mockResolvedValue(
            userClientDetails,
          );

          result = await userClientService.createDetails(
            userClientDetails,
            accountOwner,
          );
        });

        it('should invoke userDetailsRepository.save()', () => {
          expect(userDetailsRepository.save).toHaveBeenCalledTimes(1);
          expect(userDetailsRepository.save).toHaveBeenCalledWith({
            ...userClientDetails,
            accountOwner,
          });
        });

        it('should return an  user details object', () => {
          expect(result).toStrictEqual(expectedUserDetails);
        });
      });
    });
  });

  describe('getActive(credentials)', () => {
    describe('case: success', () => {
      let credentials;
      let result;
      let expectedClient;
      describe('when idUserClient is null', () => {
        beforeEach(async () => {
          credentials = {
            email: 'test@petromiles.com',
          };
          expectedClient = {
            idUserClient: 1,
            salt: '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/O',
            googleToken: null,
            facebookToken: null,
            email: 'test@petromiles.com',
            password:
              '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/OVi0BCakxus81xdQ3yNlVg3QJgteHGHe',
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClient,
          );

          result = await userClientService.get(credentials);
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            email: credentials.email,
          });
        });

        it('should return an active user', () => {
          expect(result).toStrictEqual(expectedClient);
        });
      });
      describe('when idUserClient is not null', () => {
        beforeEach(async () => {
          credentials = {
            idUserClient: 1,
          };
          expectedClient = {
            idUserClient: 1,
            salt: '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/O',
            googleToken: null,
            facebookToken: null,
            email: 'test@petromiles.com',
            password:
              '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/OVi0BCakxus81xdQ3yNlVg3QJgteHGHe',
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedClient,
          );

          result = await userClientService.get(credentials);
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({
            idUserClient: credentials.idUserClient,
          });
        });

        it('should return an active user', () => {
          expect(result).toStrictEqual(expectedClient);
        });
      });
    });
  });

  describe('getInfo(idUserClient)', () => {
    describe('case: success', () => {
      let idUserClient;
      let result;
      let expectedUserClient;
      let expectedUserDetails;
      let expectedResult;
      describe('when user is not federated', () => {
        beforeEach(async () => {
          idUserClient = 1;
          expectedUserClient = {
            idUserClient: 1,
            salt: '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/O',
            googleToken: null,
            facebookToken: null,
            email: 'test@petromiles.com',
            password:
              '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/OVi0BCakxus81xdQ3yNlVg3QJgteHGHe',
            userDetails: [{ accountOwner: null }],
          };
          expectedUserDetails = { accountOwner: null };

          expectedResult = {
            email: expectedUserClient.email,
            userDetails: expectedUserDetails,
            role: Role.CLIENT,
            id: expectedUserClient.idUserClient,
            federated: false,
          };
          jest
            .spyOn(userClientService, 'get')
            .mockResolvedValue(expectedUserClient);

          result = await userClientService.getInfo(idUserClient);
        });

        it('should return an active user', () => {
          expect(result).toStrictEqual(expectedResult);
        });
      });
      describe('when user is federated', () => {
        beforeEach(async () => {
          idUserClient = 1;
          expectedUserClient = {
            idUserClient: 1,
            salt: null,
            googleToken: null,
            facebookToken: null,
            email: 'test@petromiles.com',
            password: null,
            userDetails: [{ accountOwner: null }],
          };
          expectedUserDetails = { accountOwner: null };

          expectedResult = {
            email: expectedUserClient.email,
            userDetails: expectedUserDetails,
            role: Role.CLIENT,
            id: expectedUserClient.idUserClient,
            federated: true,
          };
          jest
            .spyOn(userClientService, 'get')
            .mockResolvedValue(expectedUserClient);

          result = await userClientService.getInfo(idUserClient);
        });

        it('should return an active user', () => {
          expect(result).toStrictEqual(expectedResult);
        });

        it('should not invoke paymentProviderService.createCustomer()', () => {
          expect(paymentProviderService.createCustomer).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('getDetails(userClient)', () => {
    describe('case: success', () => {
      let expectedUserClient;
      let userClient;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = {
            idUserClient: 1,
            salt: '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/O',
            googleToken: null,
            facebookToken: null,
            email: 'test@petromiles.com',
            password:
              '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/OVi0BCakxus81xdQ3yNlVg3QJgteHGHe',
          };

          expectedUserClient = {
            ...expectedActiveClient,
            userDetails: [
              { firstName: 'petro', lastName: 'miles', accountOwner: null },
            ],
          };
          (userDetailsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          result = await userClientService.getDetails(userClient);
        });

        it('should invoke userDetailsRepository.findOne()', () => {
          expect(userDetailsRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userDetailsRepository.findOne).toHaveBeenCalledWith({
            where: `fk_user_client = ${userClient.idUserClient} and "accountOwner" is NULL`,
          });
        });

        it('should return an user with details', () => {
          expect(result).toStrictEqual(expectedUserClient);
        });
      });
    });

    describe('case: failure', () => {
      let expectedUserClient;
      let userClient;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          userClient = null;

          result = await userClientService.getDetails(userClient);
        });

        it('should return null', () => {
          expect(result).toStrictEqual(userClient);
        });

        it('should not invoke  userDetailsRepository.findOne()', () => {
          expect(userDetailsRepository.findOne).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('updateDefaultLanguage(email,language)', () => {
    describe('case: success', () => {
      let email;
      let expectedUserClient;
      let expectedLanguage;
      let expectedUserDetails;
      let expectedLanguageChange;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          email = 'test@petromiles.com';
          expectedUserClient = expectedActiveClient;
          expectedLanguage = {
            idLanguage: 1,
            name: 'english',
            shortname: 'en',
          };

          expectedUserDetails = {
            firstName: 'petro',
            lastname: 'miles',
            language: null,
          };

          expectedLanguageChange = {
            firstName: 'petro',
            lastname: 'miles',
            language: expectedLanguage,
          };
          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (languageRepository.findOne as jest.Mock).mockResolvedValue(
            expectedLanguage,
          );

          (userDetailsRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserDetails,
          );

          (userDetailsRepository.save as jest.Mock).mockResolvedValue(
            expectedLanguageChange,
          );

          result = await userClientService.updateDefaultLanguage(
            email,
            'english',
          );
        });

        it('should return language object', () => {
          expect(result).toStrictEqual(expectedLanguage);
        });

        it('should invoke userClientRepository.findOne()', () => {
          expect(userClientRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userClientRepository.findOne).toHaveBeenCalledWith({ email });
        });

        it('should invoke languageRepository.findOne()', () => {
          expect(languageRepository.findOne).toHaveBeenCalledTimes(1);
          expect(languageRepository.findOne).toHaveBeenCalledWith({
            name: 'english',
          });
        });

        it('should invoke userDetailsRepository.findOne()', () => {
          expect(userDetailsRepository.findOne).toHaveBeenCalledTimes(1);
          expect(userDetailsRepository.findOne).toHaveBeenCalledWith({
            userClient: expectedUserClient,
          });
        });

        it('should invoke userDetailsRepository.save()', () => {
          expect(userDetailsRepository.save).toHaveBeenCalledTimes(1);
          expect(userDetailsRepository.save).toHaveBeenCalledWith(
            expectedUserDetails,
          );
        });
      });
    });
  });

  describe('updatePasswordWithoutCurrent(user, credentials)', () => {
    describe('case: success', () => {
      let user;
      let credentials;
      let expectedUserClient;
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          user = { email: 'test@petromiles.com', id: 1, role: 'CLIENT' };
          credentials = {
            salt: '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/O',
            password:
              '$2b$10$gOcQ/FGTjNo1Cy5zgt6g/OVi0BCakxus81xdQ3yNlVg3QJgteHGHe',
          };

          expectedUserClient = expectedActiveClient;

          jest
            .spyOn(userClientService, 'get')
            .mockResolvedValue(expectedUserClient);

          jest.spyOn(userClientService, 'updateClient').mockResolvedValue(null);

          result = await userClientService.updatePasswordWithoutCurrent(
            user,
            credentials,
          );
        });

        it('should return a user client', () => {
          expect(result).toStrictEqual(expectedUserClient);
        });
      });
    });
  });

  describe('updateClient( options, id)', () => {
    describe('case: success', () => {
      let options;
      let id;
      let expectedUpdateResult = { affected: 1 };
      let result;
      describe('when everything works well', () => {
        beforeEach(async () => {
          id = 1;
          options = {
            email: 'test@petromiles.com',
            password: 'test1234',
            salt: 'test',
          };

          execute.mockResolvedValue(expectedUpdateResult);
          result = await userClientService.updateClient(options, id);
        });

        it('should invoke userClientRepository.createQueryBuilder()', () => {
          expect(execute).toHaveBeenCalledTimes(1);
          expect(
            userClientRepository.createQueryBuilder().where,
          ).toHaveBeenCalledWith('idUserClient = :id', { id });
        });

        it('should return update result', () => {
          expect(result).toStrictEqual(expectedUpdateResult);
        });
      });
    });
  });
});
