
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
    const res = await request(server).get(encodeURI(`/api/search?query=title`));

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toHaveLength(2);
  });

  test(`Should return status ${HttpCode.BAD_REQUEST} for empty request`, async () => {
    const res = await request(server).get(encodeURI(`/api/search?query=`));

    expect(res.statusCode).toBe(HttpCode.BAD_REQUEST);
  });

  test(`Should return status ${HttpCode.NOT_FOUND} for wrong request`, async () => {
    const res = await request(server).get(encodeURI(`/api/search?query=${null}`));

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});


