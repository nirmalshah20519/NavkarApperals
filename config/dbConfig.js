module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "123456",
    // PASSWORD: "123456",
    DB: "NavkarAppFour",
    dialect: "postgres",
    port: 5432,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
  