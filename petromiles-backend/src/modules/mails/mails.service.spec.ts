import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { MailsService } from './mails.service';

import { UserClient } from '@/entities/user-client.entity';

import { MailsSubjets } from '@/constants/mailsSubjectConst';

import { WinstonModule } from 'nest-winston';
import createOptions from '../../logger/winston/winston-config';

describe('MailsService', () => { 
	let mailsService: MailsService;
  let RepositoryMock: jest.Mock;
  let userClientRepository: Repository<UserClient>;
  let MailsServiceMock: jest.Mock<Partial<MailsService>>;
  let ConfigServiceMock: jest.Mock<Partial<ConfigService>>;
  let configService: ConfigService;

  beforeEach(() => {
    RepositoryMock = jest.fn(() => ({
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));
    MailsServiceMock = jest.fn<Partial<MailsService>, MailsService[]>(() => ({
      sendEmail: jest.fn(),
    }));
    ConfigServiceMock = jest.fn<Partial<ConfigService>, ConfigService[]>(
      () => ({
        get: jest.fn(),
      }),
    );
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot(
          createOptions({ fileName: 'petromiles-global.log' }),
        ),
      ],
      providers: [
        MailsService,
        {
          provide: getRepositoryToken(UserClient),
          useClass: RepositoryMock,
        },
        {
          provide: MailsService,
          useClass: MailsServiceMock,
        },
        {
          provide: ConfigService,
          useClass: ConfigServiceMock,
        },
      ],
    }).compile();

    userClientRepository = module.get(getRepositoryToken(UserClient));
    mailsService = module.get<MailsService>(MailsService);
    configService = module.get<ConfigService>(ConfigService);
  });

	describe('sendEmail(user, file)', () => { 
		let expectedUserClient;
		let template;
		let subject;
    let mailParameters;

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
					
					(configService.get as jest.Mock).mockReturnValue(template);

					await mailsService.sendEmail(mailParameters);
				});

        it('should invoke mailsService.sendEmail()', () => {
          expect(mailsService.sendEmail).toHaveBeenCalledTimes(1);
          expect(mailsService.sendEmail).toHaveBeenCalledWith(mailParameters);
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

					expectedError = new BadRequestException();

          jest
            .spyOn(mailsService, 'sendEmail')
            .mockRejectedValue(expectedError);
        });

        it('should be thrown when there is an error in the mail', async () => {
          await expect(
            mailsService.sendEmail(mailParameters),
          ).rejects.toThrow(BadRequestException);
        });
      });

      describe('When the mail does not exist in sendgrid', () => {
        beforeEach(async () => {
          jest
          .spyOn(mailsService, 'sendEmail')
          .mockRejectedValue(expectedError);
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