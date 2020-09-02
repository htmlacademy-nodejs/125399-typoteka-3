/* eslint-disable max-nested-callbacks */
'use strict';

const request = require(`supertest`);
const {createApp} = require(`../cli/server`);
const articlesMocks = require(`../../mocks/articlesMocks`);
const {HttpCode} = require(`../../constants`);

let server;


beforeAll(async () => {
  server = await createApp(articlesMocks);
});

describe(`Get all articles`, () => {
  const expectedHttpCode = HttpCode.OK;
  test(`Should return status ${expectedHttpCode} and array of articles on GET request`, async () => {
    const actual = await request(server).get((`/api/articles`));

    expect(actual.statusCode).toBe(HttpCode.OK);
    expect(actual.body).toBeInstanceOf(Array);
  });
});

describe(`Create new article`, () => {
  describe(`Create new article with valid params`, () => {
    const expectedHttpCode = HttpCode.CREATED;
    let actual = null;
    let expected = null;

    beforeAll(async () => {
      const testObj = {
        "title": `title-1`,
        "createdDate": `2020-07-14T16:33:44.300Z`,
        "announce": `announce-1`,
        "fullText": `fullText-1`,
        "category": [`category-1`],
      };

      actual = await request(server).post(`/api/articles`).send(testObj);
      expected = testObj;
    });

    afterAll(async () => {
      // TODO
    });

    // post
    describe(`post requests`, () => {
      test(`Should return ${expectedHttpCode} by post`, () => {
        expect(actual.statusCode).toBe(expectedHttpCode);
      });

      test(`Should return expected object by post`, () => {
        expect(actual.body).toMatchObject(expected);
      });

      test(`Should return object with id`, () => {
        expect(actual.body).toHaveProperty(`id`);
      });

    });

    // get article
    describe(`get requests article by id`, () => {
      test(`Should get article with valid id`, async () => {
        const targetArticleResult = await request(server).get((`/api/articles/${actual.body.id}`));
        expect(targetArticleResult.statusCode).toBe(HttpCode.OK);
        expect(targetArticleResult.body.id).toBe(actual.body.id);
      });
      test(`Should return status ${HttpCode.NOT_FOUND} for wrong request`, async () => {
        const targetArticleResult = await request(server).get((`/api/articles/wrongId`));
        expect(targetArticleResult.statusCode).toBe(HttpCode.NOT_FOUND);
      });
    });

    // put
    describe(`put requests`, () => {
      const newObj = {
        "title": `title-2`,
        "createdDate": `2020-07-14T16:33:44.300Z`,
        "announce": `announce-1`,
        "fullText": `fullText-1`,
        "category": [`category-1`],
      };
      test(`Should return status ${HttpCode.OK} for article update & updated object`, async () => {

        const targetArticleResult = await request(server).put(`/api/articles/${actual.body.id}`).send(newObj);

        expect(targetArticleResult.statusCode).toBe(HttpCode.OK);
        expect(targetArticleResult.body.comments).toBeInstanceOf(Object);
      });

      test(`Should return status ${HttpCode.NOT_FOUND} for update article request with wrong ID`, async () => {
        const targetArticleResult = await request(server).put(`/api/articles/wrongId`).send(newObj);
        expect(targetArticleResult.statusCode).toBe(HttpCode.NOT_FOUND);
      });
    });


    // delete
    describe(`delete requests`, () => {
      test(`Should return status ${HttpCode.OK} for delete article request`, async () => {
        const targetArticleResult = await request(server).delete(`/api/articles/${actual.body.id}`);

        expect(targetArticleResult.statusCode).toBe(HttpCode.OK);
      });

      test(`Should return status ${HttpCode.NOT_FOUND} for delete article request with wrong ID`, async () => {
        const targetArticleResult = await request(server).delete(`/api/articles/wrongId`);
        expect(targetArticleResult.statusCode).toBe(HttpCode.NOT_FOUND);
      });
    });

  });

  describe(`Create new article with invalid params`, () => {
    const testArr = [
      {
        missingParameter: `title`,
        content: {
          "createdDate": `2020-07-14T16:33:44.300Z`,
          "announce": `announce-1`,
          "fullText": `fullText-1`,
          "category": [`category-1`]
        }
      }, {
        missingParameter: `createdDate`,
        content: {
          "title": `title-1`,
          "announce": `announce-1`,
          "fullText": `fullText-1`,
          "category": [`category-1`],
        }

      }, {
        missingParameter: `announce`,
        content: {
          "title": `title-1`,
          "createdDate": `2020-07-14T16:33:44.300Z`,
          "fullText": `fullText-1`,
          "category": [`category-1`],
        }

      }, {
        missingParameter: `fullText`,
        content: {
          "title": `title-1`,
          "createdDate": `2020-07-14T16:33:44.300Z`,
          "announce": `announce-1`,
          "category": [`category-1`],
        }

      },
      {
        missingParameter: `category`,
        content: {
          "title": `title-1`,
          "createdDate": `2020-07-14T16:33:44.300Z`,
          "announce": `announce-1`,
          "fullText": `fullText-1`,
        }

      }
    ];
    describe.each(testArr)(`Create article without some params `, (testParams) => {
      describe(`Create article without parameter ${testParams.missingParameter}`, () => {
        let actual = {};
        beforeAll(async () => {
          actual = await request(server).post(`/api/articles`).send(testParams.content);
        });

        test(`Should return http code 500`, () => {
          expect(actual.statusCode).toBe(HttpCode.BAD_REQUEST);
        });

      });
    });
  });
});

// comments
describe(`Comments tests`, () => {
  let actual = null;
  let comment = null;

  describe(`Create new article`, () => {
    beforeAll(async () => {
      const testObj = {
        "title": `title-1`,
        "createdDate": `2020-07-14T16:33:44.300Z`,
        "announce": `announce-1`,
        "fullText": `fullText-1`,
        "category": [`category-1`],
      };

      actual = await request(server).post(`/api/articles`).send(testObj);
    });

    describe(`Create comment with valid params`, () => {
      beforeAll(async () => {
        const newComment = {
          text: `comment text`
        };

        comment = await request(server).post(`/api/articles/${actual.body.id}/comments`).send(newComment);
      });

      // post
      describe(`Creating results`, () => {
        test(`Should return object with comments by new article creating`, () => {
          expect(actual.body).toHaveProperty(`comments`);
          expect(actual.body.comments).toBeInstanceOf(Array);
        });

        test(`Should return status ${HttpCode.CREATED} by new comment creating`, () => {
          expect(comment.statusCode).toBe(HttpCode.CREATED);
        });

        test(`Should return object with id`, () => {
          expect(comment.body).toBeInstanceOf(Object);
          expect(comment.body).toHaveProperty(`id`);
        });
      });

      // get
      describe(`Get comments by article ID`, () => {
        test(`Should return status ${HttpCode.OK} for getting article comments & return array`, async () => {
          const targetArticleComments = await request(server).get(`/api/articles/${actual.body.id}/comments`);

          expect(targetArticleComments.statusCode).toBe(HttpCode.OK);
          expect(targetArticleComments.body).toBeInstanceOf(Array);
        });

        test(`Should return status ${HttpCode.NOT_FOUND} for getting article comments with wrong article ID`, async () => {
          const targetArticleComments = await request(server).get(`/api/articles/wrongId/comments`);
          expect(targetArticleComments.statusCode).toBe(HttpCode.NOT_FOUND);
        });
      });

      // delete
      describe(`Delete comment by ID`, () => {
        test(`Should return status ${HttpCode.OK} & return deleted object for delete article comment`, async () => {
          const targetArticleComment = await request(server).delete(`/api/articles/${actual.body.id}/comments/${comment.body.id}`);

          expect(targetArticleComment.statusCode).toBe(HttpCode.OK);
          expect(targetArticleComment.body).toBeInstanceOf(Object);
        });

        test(`Should return status ${HttpCode.NOT_FOUND} for delete article comment with wrong ID`, async () => {
          const targetArticleComment = await request(server).delete(`/api/articles/${actual.body.id}/comments/wrongId`);
          expect(targetArticleComment.statusCode).toBe(HttpCode.NOT_FOUND);
        });
      });

    });

  });
});
