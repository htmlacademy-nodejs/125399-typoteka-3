'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);

let server;
let actual;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});

describe(`Get all categories`, () => {
  const expectedHttpCode = 200;

  beforeAll(async () => {
    actual = await request(server).get(`/api/categories`);
  });

  test(`Should return status ${expectedHttpCode}`, async () => {
    expect(actual.statusCode).toBe(expectedHttpCode);
  });

  test(`Should return array of articles`, async () => {
    expect(actual.body).toBeInstanceOf(Array);
  });
});
