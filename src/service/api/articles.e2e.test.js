'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);
const {HttpCode} = require(`../../constants`);

let server;

// const articleMock = {
//   "id": `id-1`,
//   "title": `title-1`,
//   "createdDate": `2020-07-14T16:33:44.300Z`,
//   "announce": `announce-1`,
//   "fullText": `fullText-1`,
//   "category": [`category-1`],
//   "comments": [
//     {
//       "id": `commentsId-1`,
//       "text": `commentsText-1`
//     }
//   ]
// };

beforeAll(async () => {
  server = await createApp(articlesMocks);
});


describe(`Articles API end-points`, () => {
  test(`Should return status ${HttpCode.OK} and array of articles on GET request`, async () => {
    const res = await request(server).get((`/api/articles`));

    expect(res.statusCode).toBe(HttpCode.OK);
    expect(res.body).toHaveProperty(`length`);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test(`Should return status ${HttpCode.NOT_FOUND} for wrong request`, async () => {
    const res = await request(server).get(`/api/articles/wrongId`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
    expect(res.body).toEqual({});
  });

  test(`Should return status ${HttpCode.OK} for delete article request`, async () => {
    const res = await request(server).delete(`/api/articles/id-1`);

    expect(res.statusCode).toBe(HttpCode.OK);
  });

  test(`Should return status ${HttpCode.NOT_FOUND} for delete offer request with wrong ID`, async () => {
    const res = await request(server).delete(`/api/articles/wrongId`);

    expect(res.statusCode).toBe(HttpCode.NOT_FOUND);
  });
});


