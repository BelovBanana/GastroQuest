//Импорт необходимых модулей
import express from "express";
import path from "path";
import { connectToDatabase, closeConnection } from "./mySQL.js";

//Определение переменных и констант
const __dirname = path.resolve();
const PORT = process.env.PORT ?? 3000;
const app = express();

//Настройка статических файлов и парсинг JSON:
app.use(express.static(path.resolve(__dirname, "static")));
app.use(express.json());

let cafes = [];

//Подключение к базе данных и получение данных:
connectToDatabase((conn) => {
  const query = "SELECT * FROM gastroquest.cafes";
  conn.query(query, (err, rows) => {
    if (err) {
      console.error("Ошибка выполнения запроса:", err);
      return;
    }

    cafes = rows.map((row) => {
      return {
        name: row.name,
        number_of_people: JSON.parse(row.number_of_people),
        budget: JSON.parse(row.budget),
        latitude: row.latitude,
        longitude: row.longitude,
        legal_age: JSON.parse(row.legal_age),
        category: JSON.parse(row.category),
      };
    });

    closeConnection();

    app.listen(PORT, () => {
      console.log(`Сервер был запущен по порту ${PORT}...`);
    });
  });
});

//Обработчик POST-запроса
app.post("/cafes", (req, res) => {
  res.json(cafes);
});
