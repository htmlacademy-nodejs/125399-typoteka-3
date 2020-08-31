'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);
const {HttpCode} = require(`../../constants`);

let server;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});


describe(`Get all categories`, () => {
  const expectedHttpCode = HttpCode.OK;
  test(`Should return status ${expectedHttpCode} and array of articles on GET request`, async () => {
    const actual = await request(server).get(`/api/categories`);

    expect(actual.statusCode).toBe(expectedHttpCode);
    expect(actual.body).toBeInstanceOf(Array);
  });
});
