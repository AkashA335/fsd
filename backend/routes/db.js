import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Akash@2005',
  database: 'todo_db'
});

db.connect(err =>
{
  if (err) {
    console.error('DB connection error:', err);
    return;
  }
  console.log('db connected');
});

export default db;
