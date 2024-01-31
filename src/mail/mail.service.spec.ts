import { Test } from '@nestjs/testing';
import got from 'got';
import * as FormData from 'form-data';
import { MailService } from './mail.service';
import { CONFIG_OPTIONS } from 'src/common/common.constants';

// got(npm package) 자체가 function 이므로 이대로 모킹.
jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = 'test-domain';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test-apiKey',
            domain: TEST_DOMAIN,
            fromEmail: 'test-fromEmail',
            myEmail: 'test-myEmail',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
    // jest.spyOn(service, 'sendEmail').mockImplementation(async () => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email',
        code: 'code',
      };
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'Verify your email',
        'verify-email',
        [
          { key: 'code', value: sendVerificationEmailArgs.code },
          { key: 'username', value: sendVerificationEmailArgs.email },
        ],
      );
    });
  });

  describe('sendEmail', () => {
    it('sends email', async () => {
      const ok = await service.sendEmail('', '', [{ key: 'one', value: '1' }]);
      // object 를 spy.
      const formSpy = jest.spyOn(FormData.prototype, 'append'); // append 함수는 새로운 객체 생성 후 사용할 수 있음.
      expect(formSpy).toHaveBeenCalled();
      expect(got.post).toHaveBeenCalledTimes(1);
      expect(got.post).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`,
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });

    it('fails on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail('', '', [{ key: 'one', value: '1' }]);
      expect(ok).toEqual(false);
    });
  });
});
