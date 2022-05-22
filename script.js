window.onload = function () {
  // 배경
  const img = ["bg1", "bg2", "bg3", "bg4", "bg5"];
  let randomImg = img[Math.trunc(Math.random() * img.length)];
  const bgImg = document.createElement("img");
  bgImg.src = `images/${randomImg}.jpeg`;
  document.body.appendChild(bgImg);

  // 시계
  function jsClock() {
    const now = new Date();
    const month = now.getMonth();
    const date = now.getDate();
    const day = now.getDay();
    const hour = String(now.getHours()).padStart(2, 0);
    const minute = String(now.getMinutes()).padStart(2, 0);
    const second = String(now.getSeconds()).padStart(2, 0);
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    const clock = document.getElementById("clock");

    clock.innerText = `
    ${month + 1}월 ${date}일 ${
      week[day]
    }요일 ${hour}시 ${minute}분 ${second}초`;
  }

  setInterval(jsClock, 1000);

  // 로그인 기능
  const loginInput = document.querySelector(".login-form input");
  const loginForm = document.querySelector(".login-form");
  const greeting = document.querySelector(".greeting");

  function loginSubmit(event) {
    event.preventDefault();
    const userName = loginInput.value;

    localStorage.setItem("username", userName);
    loginForm.classList.add("hidden");
    showGreeting(userName);
  }

  function showGreeting(username) {
    greeting.classList.remove("hidden");
    greeting.innerText = `HELLO ${username} ❣️`;
  }

  const savedUsername = localStorage.getItem("username");

  if (savedUsername === null) {
    loginForm.classList.remove("hidden");
    document.querySelector("button").addEventListener("click", loginSubmit);
  } else {
    loginForm.classList.add("hidden");
    showGreeting(savedUsername);
  }

  document.querySelector("button").addEventListener("click", loginSubmit);

  // 투두리스트
  const todoForm = document.querySelector(".todo-form");
  const todoInput = document.querySelector(".todo-form input");
  const todoList = document.getElementById("todo-list");
  let savedTodos = [];

  function todoSubmit(event) {
    event.preventDefault();
    const todo = todoInput.value;
    todoInput.value = "";

    const todosObj = {
      text: todo,
      id: Date.now(),
    };

    savedTodos.push(todosObj);
    showTodo(todosObj);
    saveTodos();
  }

  todoForm.addEventListener("submit", todoSubmit);

  function saveTodos() {
    localStorage.setItem("savedTodos", JSON.stringify(savedTodos));
  }

  const todosList = localStorage.getItem("savedTodos");

  if (todosList !== null) {
    let parsedTodos = JSON.parse(todosList);
    savedTodos = parsedTodos;
    parsedTodos.forEach((item) => showTodo(item));
  }

  function showTodo(todos) {
    const li = document.createElement("li");
    li.id = todos.id;
    todoList.appendChild(li);
    const span = document.createElement("span");
    span.innerText = todos.text;
    li.appendChild(span);
    const button = document.createElement("button");
    button.innerText = "❌";
    button.addEventListener("click", deleteTodo);
    li.appendChild(button);
  }

  function deleteTodo(event) {
    const li = event.target.parentElement;
    li.remove();

    savedTodos = savedTodos.filter((todo) => todo.id !== parseInt(li.id));
    saveTodos();
  }

  // 날씨
  const API_KEY = "22a8f6013397690f58930550229a09d0";

  function forecast(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(lat);
    console.log(lon);

    const API_CALL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(API_CALL)
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const weather = document.querySelector("#weather span:first-child");
        const city = document.querySelector("#weather span:last-child");

        weather.innerText = `${result.weather[0].description} (${result.main.temp}도)`;
        city.innerText = result.name;
      });
  }

  navigator.geolocation.getCurrentPosition(forecast);
};
