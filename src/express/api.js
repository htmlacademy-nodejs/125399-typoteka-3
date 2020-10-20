'use strict';

const axios = require(`axios`);
const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api`;


class API {
  constructor(baseUrl, timeout) {
    this._http = axios.create({
      baseUrl,
      timeout
    });
  }

  async _load(url, options) {
    let response;
    try {
      response = await this._http.request({url, ...options});
    } catch (err) {
      console.error(err);
    }
    return response;
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getOffer(id) {
    return this._load(`/articles/${id}`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  async getCategories() {
    return this._load(`/category`);
  }

  async createOffer(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }
}


const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
