function saveLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

const email = document.getElementById("typeEmailX");
const password = document.getElementById("typePasswordX");
const iconEye = document.getElementById("icon-eye");
const feedBackToastEl = document.getElementById("feedback-toast");

const loader = document.querySelector(".bg-loader");

const feedBackToast = new bootstrap.Toast(feedBackToastEl);
const listaUser = getLocalStorage("listaUser") || [];
let userValido = {
  email: "",
  password: "",
};
iconEye.addEventListener("click", () => {
  if (iconEye.classList.contains("bi-eye")) {
    iconEye.setAttribute("class", "bi bi-eye-slash");
    password.setAttribute("type", "text");
  } else {
    iconEye.setAttribute("class", "bi bi-eye");
    password.setAttribute("type", "password");
  }
});

function login() {
  if (!email.value || !password.value) {
    return showFeedback(false, "E-mail ou senha incorretos");
  }

  listaUser.forEach((item) => {
    if (email.value == item.email && password.value == item.password) {
      userValido = {
        email: item.email,
        password: item.password,
        todo: item.todo,
      };
    }
  });
  if (
    email.value == userValido.email &&
    password.value == userValido.password
  ) {
    saveLocalStorage("userLogin", userValido);
    loader.setAttribute("style", "display: flex");
    setTimeout(() => {
      window.location.href = "../todo/todo.html";
    }, 2200);
    return showFeedback(true, "Conectando-se ao APP");
  }

  return showFeedback(false, "E-mail não cadastrado");
}

function showFeedback(success, msg) {
  feedBackToastEl.children[0].children[0].innerHTML = msg;

  if (success) {
    feedBackToastEl.classList.remove("text-bg-danger");
    feedBackToastEl.classList.add("text-bg-success");
  } else {
    feedBackToastEl.classList.remove("text-bg-success");
    feedBackToastEl.classList.add("text-bg-danger");
  }

  feedBackToast.show();
  setTimeout(() => {
    feedBackToast.hide();
  }, 2000);
}
