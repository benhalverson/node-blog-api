/* eslint-disable no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable no-new */
/* eslint-disable no-console */
/* eslint-disable func-names */
/**
 * @fileoverview Overrides default exec function from mongoose.
 */
const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);

const { exec } = mongoose.Query.prototype;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || '');
  return this;
};

mongoose.Query.prototype.exec = async function () {
  // eslint-disable-next-line no-unused-expressions
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }

  const key = JSON.stringify({
    ...this.getQuery(),
    collection: this.mongooseCollection.name,
  });

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);
  // if we do return it
  if (cacheValue) {
    console.log('cached executed...');
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // otherwise issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  console.log('result', result);
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10);
  return result;
};
