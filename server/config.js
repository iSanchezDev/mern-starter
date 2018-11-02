const config = {
  mongoURL: process.env.MONGO_URL + 'mern-starter' || 'mongodb://localhost:27017/mern-starter',
  port: process.env.PORT || 8000,
};

export default config;
