import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SendGridService, SendGridModule } from '@ntegral/nestjs-sendgrid';
import { SendGridModuleOptions } from '@ntegral/nestjs-sendgrid/lib/interfaces';

import { MailsService } from './mails.service';

import { UserClient } from '@/entities/user-client.entity';

import { MailsSubjets } from '@/constants/mailsSubjectConst';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../logger/winston/winston-config';

describe('MailsService', () => { 
  let mailsService: MailsService;
  let sendGridConfig: SendGridModule;
  let sendGridClient: SendGridService;
  let RepositoryMock: jest.Mock;
  let userClientRepository: Repository<UserClient>;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let SendGridConfigMock: jest.Mock<Partial<SendGridModule>>;
  let SendGridClientMock: jest.Mock<Partial<SendGridService>>;
  let configService: ConfigService;
  let config: SendGridModuleOptions = {
    apiKey: 'mails.sendgrid.apiKey'
  };

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
    SendGridConfigMock = jest.fn<DeepPartial<SendGridModule>, SendGridModule[]>(
      () => ({
        forRootAsync: jest.fn(),
      }),
    );
    SendGridClientMock = jest.fn<Partial<SendGridService>, SendGridService[]>(
      () => ({
      send: jest.fn(),
      sendMultiple: jest.fn(),
      })
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
        SendGridModule.forRootAsync({
          useFactory: () => (config),
        }),
      ],
      providers: [
        MailsService,
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
        {
          provide: 'SENDGRID_CONFIG',
          useClass: SendGridConfigMock,
        },
        {
          provide: SendGridService,
          useClass: SendGridClientMock,
        },
      ],
    }).compile();

    userClientRepository = module.get(getRepositoryToken(UserClient));
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
    sendGridClient = module.get<SendGridService>(SendGridService);
    sendGridConfig = await module.resolve('SENDGRID_CONFIG');
  });

	describe('sendEmail(user, file)', () => { 
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
						templateId: 'test',
						dynamic_template_data: { 
							user: expectedUserClient.userDetails.firstName, 
						},
					};
          
					(userClientRepository.findOne as jest.Mock).mockResolvedValue(
            expectedUserClient,
					);
					
          (configService.get as jest.Mock).mockReturnValue('test');
          (configService.get as jest.Mock).mockReturnValue('test@est.ucab.edu.ve');
          configService.get<string>(`mails.sendgrid.templates.${template}`);
          
          (sendGridClient.send as jest.Mock).mockImplementation();
          await sendGridClient.send({...mailParameters, emailFrom});

					await mailsService.sendEmail(mailParameters);
        });

        it('should invoke configService.get()', () => {
          expect(configService.get).toHaveBeenCalledTimes(1);
          expect(configService.get).toHaveBeenCalledWith(
            `mails.sendgrid.templates.${template}`,
          );
        });

        it('should invoke sendGridClient.send()', async() => {
          expect(sendGridClient.send).toHaveBeenCalledTimes(1);
          expect(sendGridClient.send).toHaveBeenCalledWith({...mailParameters, emailFrom});
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
					
          (configService.get as jest.Mock).mockReturnValue('test');
          (configService.get as jest.Mock).mockReturnValue('test@est.ucab.edu.ve');

          (sendGridClient.send as jest.Mock).mockImplementation();
          await sendGridClient.send({...mailParameters, emailFrom});
          
          await mailsService.sendEmail(mailParameters);

					expectedError = new BadRequestException();

          jest
            .spyOn(mailsService, 'sendEmail')
            .mockRejectedValue(expectedError);
        });
        
        it('should invoke sendGridClient.send()', () => {
          expect(sendGridClient.send).toHaveBeenCalledTimes(1);
          expect(sendGridClient.send).toHaveBeenCalledWith({...mailParameters, emailFrom});
        });
        
        it('should be thrown when there is an error in the mail', async () => {
          await expect(
            mailsService.sendEmail(mailParameters),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('When the mail does not exist in sendgrid', () => {
        beforeEach(async () => {
          emailFrom = 'maalleyne.17@est.ucab.edu.ve';

          (sendGridClient.send as jest.Mock).mockImplementation();
          await sendGridClient.send({...mailParameters, emailFrom});

          await mailsService.sendEmail(mailParameters);

					expectedError = new BadRequestException();

          jest
          .spyOn(mailsService, 'sendEmail')
          .mockRejectedValue(expectedError);
        });

        it('should invoke sendGridClient.send()', () => {
          expect(sendGridClient.send).toHaveBeenCalledTimes(1);
          expect(sendGridClient.send).toHaveBeenCalledWith({...mailParameters, emailFrom});
        });
        
        it('should be launched when there is no mail in sendgrid', async () => {
          await expect(
            mailsService.sendEmail(mailParameters),
          ).rejects.toThrow(BadRequestException);
        });
      });
    });
  });
});