import supertest from 'supertest';
import app from '../src';
import * as mocks from './__mocks___';
import {
  SUCCESS, ALREADY_EXIST, LOGIN_SUCCESS, INVALID_USER, SERVER_ERROR_MESSAGE
} from '../src/utils/constant';

let userToken;
const request = supertest(app);
describe('SIGNUP API', () => {
  it('should create new user', (done) => {
    request
      .post(mocks.baseUrl)
      .send(mocks.newUser)
      .end((err, res) => {
        if (err) done(err);
          expect(res.statusCode).toEqual(201);
          expect(res.body.message).toEqual(SUCCESS);        
        done();
      });
  });
  it('should throw validation error firstName', (done) => {
    request
      .post(mocks.baseUrl)
      .send(mocks.emptyName)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('firstName can not be empty field');
        done();
      });
  });
  it('should throw validation error on phone', (done) => {
    request
      .post(mocks.baseUrl)
      .send(mocks.emptyPhone)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(422);
        expect(res.body.message).toEqual('phone must be a number');
        done();
      });
  });
});

describe('AUTH LOGIN IN API', () => {
  it('should login user', (done) => {
    request
      .post(mocks.baseUrlLogin)
      .send(mocks.wrongLoginUser)
      .end((err, res) => {
        if (err) done(err);
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual(INVALID_USER);
        done();
      });
  });
});

describe('auth Users', () => {
  beforeAll((done) => {
    request
      .post(mocks.baseUrlLogin)
      .send(mocks.loginUser)
      .end((err, res) => {
        userToken = res.body.jwtToken;
        if (err) done(err);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual(LOGIN_SUCCESS);
        done();
      });
  });
  describe('EDIT PROFILE', () => {
    it('It should Update a User', (done) => {
      request
        .patch(mocks.baseUrlUpdateProfile)
        .set('authorization', userToken)
        .send(mocks.editProfile)
        .end((err, res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body.message).toEqual('User Updated Successfully');
          done();
        });
    });
  });
});
