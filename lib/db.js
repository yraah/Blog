import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "blog_db",
  port: 3306, // change to 3307 if you changed XAMPP
});