const sql = require("mssql");
require("dotenv").config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    instanceName: process.env.DB_INSTANCE,
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    enableArithAbort: true
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

async function getConnection() {
  try {
    return await sql.connect(dbConfig);
  } catch (error) {
    console.log("ERROR SQL SERVER");
    console.log("DB_SERVER:", process.env.DB_SERVER);
    console.log("DB_INSTANCE:", process.env.DB_INSTANCE);
    console.log("DB_DATABASE:", process.env.DB_DATABASE);
    console.log("DETALLE:", error.message);
    throw error;
  }
}

module.exports = { sql, getConnection };