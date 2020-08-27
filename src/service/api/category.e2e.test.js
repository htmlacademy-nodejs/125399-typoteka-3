'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);

let server;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});


describe(`Categories`, () => {
  test(`categories test`, async () => {
    const res = await request(server).get(`/api/categories`);

    expect(res.statusCode).toBe(200);
  });
});
