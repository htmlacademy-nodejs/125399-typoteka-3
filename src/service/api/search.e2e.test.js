
'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);

let server;
let actual;

beforeAll(async () => {
  server = await createApp(articlesMocks);
});

describe(`Search API end-points`, () => {
  const codeNotFound = 404;
  const codeBadRequest = 400;
  const codeOk = 200;

  describe(`Search with valid parameters`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=title`));
    });

    test(`Should return status ${codeOk}`, async () => {
      expect(actual.statusCode).toBe(codeOk);
    });

    test(`Should return array`, async () => {
      expect(actual.body).toBeInstanceOf(Array);
    });
  });


  describe(`Search with empty request`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=`));
    });


    test(`Should return status ${codeBadRequest}`, async () => {
      expect(actual.statusCode).toBe(codeBadRequest);
    });
  });


  describe(`Search with invalid parameters`, () => {
    beforeAll(async () => {
      actual = await request(server).get(encodeURI(`/api/search?query=${null}`));
    });


    test(`Should return status ${codeNotFound}`, async () => {
      expect(actual.statusCode).toBe(codeNotFound);
    });
  });

});


