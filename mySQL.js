//Импорт модуля
import mysql from 'mysql2';

//Создание соединения с базой данных:
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'GastroQuest',
  password: 'yarikbibioff',
});

//Подключение к БД
export function connectToDatabase(callback) {
  conn.connect((err) => {
    if (err) {
      console.error('Ошибка подключения к базе данных:', err);
      return;
    }

    console.log('Соединение с базой данных установлено');
    callback(conn);
  });
}

//Закрытие соединения
export function closeConnection() {
  conn.end((err) => {
    if (err) {
      console.error('Ошибка закрытия соединения с базой данных:', err);
      return;
    }

    console.log('Соединение с базой данных закрыто');
  });
}



