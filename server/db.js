// const { Pool } = require("pg").Pool;
import Pool from "pg";
import dotenv from "dotenv";
dotenv.config();

console.log("dd: ", process.env.PG_PORT);
const pool = new Pool.Pool({
  user: process.env.PG_USER,
  // user: "hikdev_user",
  host: process.env.PG_HOST,
  // host: "dpg-cpdd2qlds78s73ed4jqg-a",
  database: process.env.PG_DATABASE,
  // database: "hikdev",
  password: process.env.PG_PASSWORD,
  // password: "J9CVUuqMQJdIGGg4kWym7ZNXQ7atCLzX",
  port: process.env.PG_PORT, // Default PostgreSQL port
  // port: 5432, // Default PostgreSQL port

  // ssl: {
  // rejectUnauthorized: false, // Use this line only for development, not for production
  // },
});

// postgres://yqulijajlz  jeon:bb28a738237388902aa7bc4956a4d714285def48c8d0e73d62da5c527d627e75@ec2-54-208-11-146.compute-1.amazonaws.com:5432/d6thdmdt3f322n
const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

// const pool = new Pool({
//   connectionString:
//     process.env.NODE_ENV === "production" ? proConfig : devConfig,
// });

export default pool;

// UPDATE Celeb
// SET document_with_idx = TO_TSVECTOR('simple', displayname);
