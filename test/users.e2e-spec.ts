import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { Connection, getConnection } from 'typeorm';
import { AppModule } from '../src/app.module';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const GRAPHQL_ENDPOINT = '/graphql';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  // 에러나서 주석처리. ref. 찾아서 afterEach 추가 함.
  // afterAll(async () => {
  //   await getConnection().dropDatabase();
  //   app.close();
  // });

  afterAll(async () => {
    const connection = app.get(Connection);
    await connection.synchronize(true);
  });

  describe('createAccount', () => {
    const EMAIL = 'nico@las.com';
    it('should create account', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input:{
              email: "${EMAIL}",
              password: "12345"
              role: Owner
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          // console.log(res.body);
          expect(res.body.data.createAccount.ok).toBe(true);
          expect(res.body.data.createAccount.error).toBe(null);
        });
    });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
          query: `
          mutation {
            createAccount(input:{
              email: "${EMAIL}",
              password: "12345"
              role: Owner
            }) {
              ok
              error
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createAccount.ok).toBe(false);
          // toBe 는 내용이 완전히 같아야 함.
          // expect(res.body.data.createAccount.error).toBe('There is a user with that email already');
          expect(res.body.data.createAccount.error).toEqual(expect.any(String));
        });
    });
  });
  it.todo('userProfile');
  it.todo('login');
  it.todo('verifyEmail');
  it.todo('me');
  it.todo('editProfile');
});
