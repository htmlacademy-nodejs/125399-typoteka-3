"use strict";

const articleValidator = require(`./articleValidator`);
const commentValidator = require(`./commentValidator`);
const articleExist = require(`./articleExist`);

module.exports = {
  articleValidator,
  commentValidator,
  articleExist
};
