// ADD YOUR OWN KEYS AND RENAME THIS FILE
require("dotenv").config();

const TWITTER_TOKENS = {
  TWITTER_CONSUMER_KEY: process.env.TWITTER_API_KEY,
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_API_SECRET,
  TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN,
  TWITTER_TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET
};

const MONGODB = {
  MONGODB_URI: process.env.MONGO_URI
};

const SESSION = {
  COOKIE_KEY: "thisappisawesome"
};

const KEYS = {
  ...TWITTER_TOKENS,
  ...MONGODB,
  ...SESSION
};

module.exports = KEYS;
