let latitude;
let longitude;

//Функция для получения текущего местоположения пользователя с помощью API геолокации браузера
function getCurrentLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        console.log("Широта:", latitude);
        console.log("Долгота:", longitude);
        callback();
      },
      function (error) {
        console.log("Ошибка получения местоположения: " + error.message);
      }
    );
  } else {
    console.log("Геолокация не поддерживается вашим браузером.");
  }
}

//Вызывает функцию для получения текущего месторасположения пользователя
document.addEventListener("DOMContentLoaded", () => {
  getCurrentLocation(generateRandomCafe);
});

//Отображает карту с маршрутом от текущего месторасположения пользователя до рандомного заведения
function showMap(randomCafe) {
  if (!randomCafe) {
    console.log("Идёт обработка информации, подождите");
    return;
  }

  console.log("Текущие координаты:", latitude, longitude);

  const user = { lat: latitude, lng: longitude };
  const destination = { lat: randomCafe.latitude, lng: randomCafe.longitude };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 20,
    center: user,
  });

  const marker = new google.maps.Marker({
    position: user,
    map: map,
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);

  const request = {
    origin: user,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING,
  };

  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(response);
    } else {
      console.log("Ошибка при построении маршрута: " + status);
    }
  });
}

//Вычисляет расстояние между двумя точками по заданным координатам(пользователя и заведения)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371e3;

  const lat1Rad = (lat1 * Math.PI) / 180;
  const lon1Rad = (lon1 * Math.PI) / 180;
  const lat2Rad = (lat2 * Math.PI) / 180;
  const lon2Rad = (lon2 * Math.PI) / 180;

  const dLat = lat2Rad - lat1Rad;
  const dLon = lon2Rad - lon1Rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

//Фильтрует массив cafes по заданным пользователем критериям
function getRandomCafeByCriteria(cafes, lat, lng, numberOfPeople, budget, distance, legalAge , category) {
  const filteredCafes = cafes.filter(cafe => {
    return (
      cafe.number_of_people.includes(numberOfPeople) &&
      cafe.budget.includes(budget) &&
      calculateDistance(lat, lng, cafe.latitude, cafe.longitude) <= distance &&
      cafe.legal_age.includes(legalAge) &&
      cafe.category === category
    );
  });

  if (filteredCafes.length === 0) {
    return null;
  }

  return filteredCafes;
}

//Выполняет запрос на сервер для получения списка заведений
function generateRandomCafe() {
  fetch("/cafes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((cafes) => {
      const first = selectedAnswers[0];
      const second = selectedAnswers[1];
      const third = selectedAnswers[2];
      const fourth = selectedAnswers[3];
      const fifth = selectedAnswers[4];

      const firstAnswer = questions[0].answers[first];
      const secondAnswer = questions[1].answers[second];
      const thirdAnswer = questions[2].answers[third];
      const fourthAnswer = questions[3].answers[fourth];
      const fifthAnswer = questions[4].answers[fifth];

      const filteredCafes = getRandomCafeByCriteria(
        cafes,
        latitude,
        longitude,
        firstAnswer,
        secondAnswer,
        thirdAnswer,
        fourthAnswer,
        fifthAnswer
      );
      

      if (!filteredCafes) {
        console.log("Нет подходящих кафе");
        return;
      }

      const randomCafe = filteredCafes[Math.floor(Math.random() * filteredCafes.length)];

      console.log(randomCafe);
      showMap(randomCafe);
    });
}
