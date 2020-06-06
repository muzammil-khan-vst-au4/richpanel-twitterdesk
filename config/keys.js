// ADD YOUR OWN KEYS AND RENAME THIS FILE TO keys.js
const TWITTER_TOKENS = {
  TWITTER_CONSUMER_KEY: "vo3by5TK8DzOkfwS2bKWNuWfU",
  TWITTER_CONSUMER_SECRET: "wJYE6OCWsNTJqpKhzNcVfVBBGPkV5frUKoIrjQXOIvfm0xRUet",
  TWITTER_ACCESS_TOKEN: '1044627079-W7t2F96vsIehFkNYMJA4z6hWspfD0l9Y456WiSu',
  TWITTER_TOKEN_SECRET: 'SOGbNFRbKzkOy87HhQ4OF7bKEmn9t43dnCixKoCs82f8Z'
};

const MONGODB = {
  MONGODB_URI: "mongodb+srv://root:root@cluster0-mw4n7.mongodb.net/<dbname>?retryWrites=true&w=majority"
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
