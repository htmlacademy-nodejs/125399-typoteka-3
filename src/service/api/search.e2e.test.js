
'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);
const {HttpCode} = require(`../../constants`);

let server;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});


describe(`Search API end-points`, () => {
  test(`Should return status ${HttpCode.OK} on GET request`, async () => {
    const actual = await request(server).get(encodeURI(`/api/search?query=title`));

    expect(actual.statusCode).toBe(HttpCode.OK);
    expect(actual.body).toBeInstanceOf(Array);
  });

  test(`Should return status ${HttpCode.BAD_REQUEST} for empty request`, async () => {
    const actual = await request(server).get(encodeURI(`/api/search?query=`));

    expect(actual.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Should return status ${HttpCode.NOT_FOUND} for wrong request`, async () => {
    const actual = await request(server).get(encodeURI(`/api/search?query=${null}`));

    expect(actual.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});


