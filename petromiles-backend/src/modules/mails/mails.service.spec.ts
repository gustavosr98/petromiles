import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SendGridService } from '@ntegral/nestjs-sendgrid';

import { MailsService } from './mails.service';
import { SendGridConfig } from './sendGrid.config';
import { MailsModule } from './mails.module';

import { UserClient } from '@/entities/user-client.entity';

import { MailsSubjets } from '@/constants/mailsSubjectConst';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../logger/winston/winston-config';

describe('MailsService', () => {
  let mailsService: MailsService;
  let sendGridConfig: typeof SendGridConfig;
  let sendGridService: SendGridService;
  let RepositoryMock: jest.Mock;
  let userClientRepository: Repository<UserClient>;
  let SendGridConfigMock: jest.Mock<Partial<typeof SendGridConfig>>;
  let SendGridServiceMock: jest.Mock<Partial<SendGridService>>;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    SendGridConfigMock = jest.fn<
      Partial<typeof SendGridConfig>,
      typeof SendGridConfig[]
    >(() => ({}));
    SendGridServiceMock = jest.fn<Partial<SendGridService>, SendGridService[]>(
      () => ({
        send: jest.fn(),
        sendMultiple: jest.fn(),
      }),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
        SendGridConfig,
      ],
      providers: [
        MailsService,
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: 'SENDGRID_CONFIG',
          useClass: SendGridConfigMock,
        },
        {
          provide: SendGridService,
          useClass: SendGridServiceMock,
        },
      ],
    }).compile();

    userClientRepository = module.get(getRepositoryToken(UserClient));
    mailsService = module.get<MailsService>(MailsService);
    sendGridService = module.get<SendGridService>(SendGridService);
    sendGridConfig = await module.resolve('SENDGRID_CONFIG');
  });

  describe('sendEmail(user)', () => {
    let expectedUserClient;
    let template;
    let subject;
    let mailParameters;
    let emailFrom;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          expectedUserClient = {
            idUserClient: 1,
            email: 'test@petromiles.com',
            userDetails: {
              firstName: 'Petro',
              lastName: 'Miles',
              language: {
                idLanguage: 1,
                name: 'english',
                shortname: 'en',
              },
            },
          };

          template = 'welcome';
          subject = MailsSubjets.welcome;
          emailFrom = 'maalleyne.17@est.ucab.edu.ve';
          mailParameters = {
            to: expectedUserClient.email,
            subject: subject,
            templateId: template,
            dynamic_template_data: {
              user: expectedUserClient.userDetails.firstName,
            },
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (sendGridService.send as jest.Mock).mockImplementation();

          await mailsService.sendEmail(mailParameters);
        });

        it('should invoke sendGridService.send()', () => {
          expect(sendGridService.send).toHaveBeenCalledTimes(1);
          expect(sendGridService.send).toHaveBeenCalledWith({
            ...mailParameters,
            emailFrom,
          });
        });
      });
    });

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('When the mail has an error when it is sent', () => {
        beforeEach(async () => {
          expectedUserClient = {
            idUserClient: 1,
            email: 'test',
            userDetails: {
              firstName: 'Petro',
              lastName: 'Miles',
              language: {
                idLanguage: 1,
                name: 'english',
                shortname: 'en',
              },
            },
          };

          template = 'welcome';
          subject = MailsSubjets.welcome;
          emailFrom = 'maalleyne.17@est.ucab.edu.ve';
          mailParameters = {
            to: expectedUserClient.email,
            subject: subject,
            templateId: 'test',
            dynamic_template_data: {
              user: expectedUserClient.userDetails.firstName,
            },
          };

          (userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
          );

          (sendGridService.send as jest.Mock).mockImplementation();

          await mailsService.sendEmail(mailParameters);

          expectedError = new BadRequestException();

          jest
            .spyOn(mailsService, 'sendEmail')
            .mockRejectedValue(expectedError);
        });

        it('should invoke sendGridService.send()', () => {
          expect(sendGridService.send).toHaveBeenCalledTimes(1);
          expect(sendGridService.send).toHaveBeenCalledWith({
            ...mailParameters,
            emailFrom,
          });
        });

        it('should be thrown when there is an error in the mail', async () => {
          await expect(mailsService.sendEmail(mailParameters)).rejects.toThrow(
            BadRequestException,
          );
        });
      });

      describe('When the mail does not exist in sendgrid', () => {
        beforeEach(async () => {
          subject = MailsSubjets.welcome;

          mailParameters = {
            to: '',
            subject: subject,
            templateId: '',
            dynamic_template_data: {
              user: '',
            },
          };

          (sendGridService.send as jest.Mock).mockImplementation();

          await mailsService.sendEmail(mailParameters);
        });

        it('should invoke sendGridService.send()', () => {
          expect(sendGridService.send).toHaveBeenCalledTimes(1);
          expect(sendGridService.send).toHaveBeenCalledWith({
            ...mailParameters,
            emailFrom,
          });
        });
      });
    });
  });
});
