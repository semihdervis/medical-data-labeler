module.exports = {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/test',
    options: {},
    port: process.env.PORT || 3001,
  };