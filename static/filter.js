//Отображает вопросы и варианты ответов на веб-странице
function displayQuestion(question, answers) {
  const questionContainer = document.getElementById("question-container");
  const answersContainer = document.getElementById("answers-container");
  questionContainer.innerHTML = "";
  answersContainer.innerHTML = "";

  const questionElement = document.createElement("h1");
  questionElement.textContent = question;
  questionContainer.appendChild(questionElement);

  answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.addEventListener("click", () => {
      handleAnswerSelection(index);
    });
    answersContainer.appendChild(button);
  });

  if (index > 0) {
    const backButton = document.getElementById("back-button");
    backButton.style.display = "block";
  } else {
    const backButton = document.getElementById("back-button");
    backButton.style.display = "none";
  }
}

//Вопросы и варианты ответов
const questions = [
  {
    question: "Сколько человек?",
    answers: ["Один", "Пара", "Компания друзей"],
  },
  {
    question: "Какой у Вас бюджет?",
    answers: ["Ниже среднего", "Средний", "Высокий"],
  },
  {
    question: "В каком диапозоне производить поиск?",
    answers: [1000, 5000, 15000],
  },
  {
    question: "В вашей компании всем есть 18?",
    answers: ["Да", "Нет"],
  },
  {
    question: "Выберите категорию",
    answers: ["Бар", "Ресторан", "Fast food", "Кофейня", "Кальянная","Кафе","Паб"],

  },
];

let randomCafe;
let index = 0;
let selectedAnswers = [];

//Функция применяется после ответа пользователя на вопрос и заносит ответ в отдельный массив
function handleAnswerSelection(answerIndex) {
  selectedAnswers.push(answerIndex);
  index++;

  if (index < questions.length) {
    const currentQuestion = questions[index];
    displayQuestion(currentQuestion.question, currentQuestion.answers);
  } else {
    const questionContainer = document.getElementById("question-container");
    const answersContainer = document.getElementById("answers-container");
    const backButton = document.getElementById("back-button");
    const generation = document.getElementById("generation");
    const map = document.getElementById('map');
    backButton.style.display = "none";
    questionContainer.innerHTML = "";
    answersContainer.innerHTML = "";
    generation.style.display = "block";
    map.style.display = "block";
  }
}

//Скрывает кнопку сгенерировать
function hideButton() {
  const button = document.getElementById("generation");
  button.style.display = "none";
}

//При нажатии на кнопку назад возвращает пользователя к предыдущему вопросу
function goBack() {
  if (index > 0) {
    index--;
    selectedAnswers.pop();
    const currentQuestion = questions[index];
    displayQuestion(currentQuestion.question, currentQuestion.answers);
  }
}

//Инициализирует вопрос и отображают его на странице
const initialQuestion = questions[index];
displayQuestion(initialQuestion.question, initialQuestion.answers);
