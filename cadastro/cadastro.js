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
const feedBackToastEl = document.getElementById("feedback-toast");

const loader = document.querySelector(".bg-loader");

const listaUser = getLocalStorage("listaUser") || [];
const validate = { email: false, password: false, repeatPassword: false };

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
  if (email.value) validate.email = true;
  else validate.email = false;
});
password.addEventListener("keydown", () => {
  if (password.value) validate.password = true;
  else validate.password = false;
});
repeatPassword.addEventListener("keydown", () => {
  if (repeatPassword.value) validate.repeatPassword = true;
  else validate.repeatPassword = false;
});

function createUser() {
  const valid = listaUser.some((user) => user.email === email.value);
  if (valid) {
    return showFeedback(false, "E-mail já existente. Tente outro e-mail!");
  }
  if (validate.email && validate.password && validate.repeatPassword) {
    if (password.value != repeatPassword.value) {
      password.focus();
      return showFeedback(false, "As senhas são diferentes!");
    }
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
  } else {
    email.focus();
    return showFeedback(false, "Preencha corretamente todos os campos!");
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
