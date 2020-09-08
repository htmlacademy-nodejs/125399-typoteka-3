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


describe(`Get all categories`, () => {
  const expectedHttpCode = HttpCode.OK;

  beforeAll(async () => {
    actual = await request(server).get(`/api/categories`);
  });

  afterAll(() => {
    actual = null;
  });

  test(`Should return status ${expectedHttpCode} and array of articles on GET request`, async () => {
    expect(actual.statusCode).toBe(expectedHttpCode);
    expect(actual.body).toBeInstanceOf(Array);
  });
});
