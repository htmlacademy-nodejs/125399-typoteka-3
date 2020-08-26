'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);

describe(`Categories`, () => {
  test(`categories test`, async () => {
    const server = await createApp(articlesMocks);
    const res = await request(server).get(`/api/categories`);

    expect(res.statusCode).toBe(200);
  });
});
