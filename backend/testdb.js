require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Connection failed ❌', err);
    return;
  }
  console.log('Connected to database ✅');

  connection.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Query failed ❌', err);
    } else {
      console.log('Query success! Events:', results);
    }
    connection.end();
  });
});
