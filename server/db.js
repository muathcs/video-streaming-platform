const Pool = require("pg").Pool;
require("dotenv").config();

// postgres://yqulijajlzjeon:bb28a738237388902aa7bc4956a4d714285def48c8d0e73d62da5c527d627e75@ec2-54-208-11-146.compute-1.amazonaws.com:5432/d6thdmdt3f322n
const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV === "production" ? proConfig : devConfig,
});

module.exports = pool;
