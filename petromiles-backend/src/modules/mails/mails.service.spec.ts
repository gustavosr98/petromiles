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
  let sendGridConfig;
  let sendGridService: SendGridService;
  let SendGridServiceMock: jest.Mock<Partial<SendGridService>>;

  beforeEach(() => {
    SendGridServiceMock = jest.fn<Partial<SendGridService>, SendGridService[]>(
      () => ({
        send: jest.fn(),
      }),
    );

    sendGridConfig = {
      emailFrom: 'maalleyne.17@est.ucab.edu.ve',
    };
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
          provide: SendGridService,
          useClass: SendGridServiceMock,
        },
        {
          provide: 'SENDGRID_CONFIG',
          useValue: sendGridConfig,
        },
      ],
    }).compile();

    mailsService = module.get<MailsService>(MailsService);
    sendGridService = module.get<SendGridService>(SendGridService);
    sendGridConfig = await module.resolve('SENDGRID_CONFIG');
  });

  describe('sendEmail(user)', () => {
    let template;
    let subject;
    let mailParameters;
    let emailFrom;

    describe('case: success', () => {
      describe('when everything works well', () => {
        beforeEach(async () => {
          template = 'welcome';
          subject = MailsSubjets.welcome;
          emailFrom = 'maalleyne.17@est.ucab.edu.ve';
          mailParameters = {
            to: 'test@petromiles.com',
            subject: subject,
            templateId: template,
            dynamic_template_data: {
              user: 'Pedro',
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

    describe('case: failure', () => {
      let expectedError: BadRequestException;
      describe('when there is a problem sending the mail', () => {
        beforeEach(async () => {
          template = 'welcome';
          subject = MailsSubjets.welcome;
          emailFrom = 'maalleyne.17@est.ucab.edu.ve';
          mailParameters = {
            to: 'test@petromiles.com',
            subject: subject,
            templateId: 'test',
            dynamic_template_data: {
              user: 'Pedro',
            },
          };

          expectedError = new BadRequestException();

          (sendGridService.send as jest.Mock).mockRejectedValue(expectedError);

          jest
            .spyOn(mailsService, 'sendEmail')
            .mockRejectedValue(expectedError);
        });

        it('should be throw when there is a problem sending the mail', async () => {
          await expect(mailsService.sendEmail(mailParameters)).rejects.toThrow(
            BadRequestException,
          );
        });
      });

      describe('when the mail does not exist in sendgrid', () => {
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

          await mailsService.sendEmail(mailParameters);
        });

        it('should be throw when the mail does not exist in sendgrid', async () => {
          await expect(mailsService.sendEmail(mailParameters)).rejects.toThrow(
            BadRequestException,
          );
        });

        it('should invoke sendGridService.send()', () => {
          expect(sendGridService.send).not.toHaveBeenCalled();
        });
      });
    });
  });
});
