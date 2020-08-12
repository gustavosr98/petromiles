import { UserClientService } from './user-client.service';
import { Repository } from 'typeorm';
import { UserClient } from '@/entities/user-client.entity';
import { UserDetails } from '@/entities/user-details.entity';
import { PaymentProviderService } from '../../payment-provider/payment-provider.service';
import { ManagementService } from '../../management/services/management.service';
import { TestingModule, Test } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import createOptions from '@/logger/winston/winston-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  expectedActiveClient,
  expectedDeletedClient,
} from './mocks/user-client.mock';
import { Language } from '@/enums/language.enum';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from '../../../entities/user-role.entity';
import { Role } from '@/enums/role.enum';
import { StateUser } from '../../../entities/state-user.entity';
import { StateName } from '@/enums/state.enum';

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

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  describe('createUserDTO,ip', () => {
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
            Language.ENGLISH,
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

        it('should return an  user details object', () => {
          expect(result).toStrictEqual(expectedUserDetails);
        });
      });
    });
  });
});
