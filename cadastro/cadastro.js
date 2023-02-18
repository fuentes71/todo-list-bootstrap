function saveLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
const email = document.getElementById("typeEmailX");
const password = document.getElementById("typePasswordX");
const repeatPassword = document.getElementById("typeRepeatPasswordX");
const iconEye = document.getElementById("icon-eye");
const error = document.getElementById("error");
const feedBackToastEl = document.getElementById("feedback-toast");

const loader = document.querySelector(".bg-loader");

const listaUser = getLocalStorage("listaUser") || [];

const validate = { email: false, password: false, repeatPassword: false };
const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
const validatePassword = (password) => {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/);
};

const feedBackToast = new bootstrap.Toast(feedBackToastEl);

iconEye.addEventListener("click", () => {
  if (iconEye.classList.contains("bi-eye")) {
    iconEye.setAttribute("class", "bi bi-eye-slash");
    password.setAttribute("type", "text");
    repeatPassword.setAttribute("type", "text");
  } else {
    iconEye.setAttribute("class", "bi bi-eye");
    password.setAttribute("type", "password");
    repeatPassword.setAttribute("type", "password");
  }
});

email.addEventListener("keydown", () => {
  if (validateEmail(email.value)) validate.email = true;
  else validate.email = false;
});
password.addEventListener("keydown", () => {
  if (validatePassword(password.value)) validate.password = true;
  else validate.password = false;
});
repeatPassword.addEventListener("keyup", () => {
  if (repeatPassword.value != password.value) validate.repeatPassword = false;
  else validate.repeatPassword = true;
});
function errorInput(_error) {
  error.innerHTML = _error;
  setTimeout(() => {
    error.innerHTML = "";
  }, 2000);
}
function createUser() {
  const valid = listaUser.some((user) => user.email === email.value);
  if (valid) {
    return showFeedback(false, "E-mail já existente. Tente outro e-mail!");
  }
  if (!validate.email) errorInput("Informe um email valido");
  else if (!validate.password) errorInput("Digite uma senha valida!");
  else if (!validate.repeatPassword) errorInput("Senhas diferentes!");
  else {
    listaUser.push({
      email: email.value,
      password: password.value,
      todo: [],
    });
    saveLocalStorage("listaUser", listaUser);
    loader.setAttribute("style", "display: flex !important");
    setTimeout(() => {
      window.location.href = "../login/login.html";
    }, 1700);
    return showFeedback(true, "Usuario cadastrado com sucesso");
  }
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
