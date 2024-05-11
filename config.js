module.exports = {
  jwt: {
    secret: "secret-key",
    options: {
      algorithm: "HS256",
      expiresIn: "1d",
    },
  },
  jwtAlgorithm: "HS256",
  expiresLong: "1d",
  expiresShort: "10s",
  querys: {
    tables: {
      reports: "reports",
      comments: "comments",
      users: "users",
      tasks: "tasks",
      dailyTasks: "dailytasks",
    },
  },
};
