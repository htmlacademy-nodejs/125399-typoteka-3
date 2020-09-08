
'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);
const {HttpCode} = require(`../../constants`);

let server;
let actual;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});

afterAll(() => {
  server = null;
});


describe(`Search API end-points`, () => {

  afterAll(() => {
    actual = null;
  });


  describe(`Search with valid parameters`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=title`));
    });

    test(`Should return status ${HttpCode.OK}`, async () => {
      expect(actual.statusCode).toBe(HttpCode.OK);
      expect(actual.body).toBeInstanceOf(Array);
    });
  });


  describe(`Search with empty request`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=`));
    });


    test(`Should return status ${HttpCode.BAD_REQUEST}`, async () => {
      expect(actual.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });


  describe(`Search with invalid parameters`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=${null}`));
    });


    test(`Should return status ${HttpCode.NOT_FOUND}`, async () => {
      expect(actual.statusCode).toBe(HttpCode.NOT_FOUND);
    });
  });

});


