//UTIL FUNCTIONS
function saveLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

function generateID() {
  const id = new Date().getTime();

  return id;
}
//UTIL FUNCTIONS
const listaUser = getLocalStorage("listaUser") || [];
const data = getLocalStorage("todo") || [];
const confirmDeleteValue = false;
const userLogin = getLocalStorage("userLogin") || false;

const textTodo = document.getElementById("text-todo");
const _editTodo = document.getElementById("edit-todo");
const buttonCreate = document.getElementById("button-create");
const buttonLogin = document.getElementById("button-login");
const deleteButton = document.getElementById("delete-button");
const editButton = document.getElementById("edit-button");
const userIcon = document.getElementById("user-icon");
const feedBackToastEl = document.getElementById("feedback-toast");
const listTodo = document.getElementById("list-todo");
const login = document.getElementById("login");
const password = document.getElementById("password");
const createEmail = document.getElementById("createEmail");
const createpassword = document.getElementById("createPassword");
const createRepeatPassword = document.getElementById("createRepeatPassword");
const buttonPassword = document.getElementById("button-password");
const buttonCreatePassword = document.getElementById("button-create-password");

const createTodoModal = new bootstrap.Modal("#create-todo-modal");
const loginTodoModal = new bootstrap.Modal("#login-todo-modal");
const createUserTodoModal = new bootstrap.Modal("#create-user-todo-modal");
const exitUserTodoModal = new bootstrap.Modal("#exit-todo-modal");
const deleteTodoModal = new bootstrap.Modal("#delete-todo-modal");
const editTodoModal = new bootstrap.Modal("#edit-todo-modal");
const feedBackToast = new bootstrap.Toast(feedBackToastEl);

buttonCreate.addEventListener("click", () => {
  if (userLogin == false) {
    showFeedback(false, "Conecte-se para criar Todo");
    loginTrue();
  }
});
buttonPassword.addEventListener("click", () => {
  if (buttonPassword.classList.contains("bi-eye")) {
    buttonPassword.setAttribute("class", "bi bi-eye-slash");
    password.setAttribute("type", "text");
  } else {
    buttonPassword.setAttribute("class", "bi bi-eye");
    password.setAttribute("type", "password");
  }
});
buttonCreatePassword.addEventListener("click", () => {
  if (buttonCreatePassword.classList.contains("bi-eye")) {
    buttonCreatePassword.setAttribute("class", "bi bi-eye-slash");
    createpassword.setAttribute("type", "text");
    createRepeatPassword.setAttribute("type", "text");
  } else {
    buttonCreatePassword.setAttribute("class", "bi bi-eye");
    createpassword.setAttribute("type", "password");
    createRepeatPassword.setAttribute("type", "password");
  }
});
function userExit() {
  listaUser.forEach((user) => {
    if (user.email === userLogin.email) {
      user.todo = userLogin.todo;
      saveLocalStorage("listaUser", listaUser);
    }
  });
  localStorage.removeItem("todo");
  localStorage.removeItem("userLogin");
  loginTrue();
  exitUserTodoModal.hide();
}
function loginTrue() {
  if (userLogin != false) {
    buttonCreate.setAttribute("data-bs-target", "#create-todo-modal");
    userIcon.children[0].setAttribute("class", "bi bi-person text-white ");
    userIcon.setAttribute("data-bs-target", "#exit-todo-modal");

    buttonCreate.setAttribute(
      "class",
      "btn btn-info position-fixed float-button"
    );
  } else {
    showFeedback(false, "Conecte-se para cadastrar");
    buttonCreate.removeAttribute("data-bs-target", "#create-todo-modal");
    buttonCreate.setAttribute(
      "class",
      "btn position-fixed float-button btn-secondary"
    );

    userIcon.children[0].setAttribute(
      "class",
      "bi bi-person-fill-exclamation text-danger"
    );
    userIcon.setAttribute("data-bs-target", "#login-todo-modal");
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

function checkTodo(element) {
  const id = element.getAttribute("data-id");
  console.log();
  const filtered = data.find((item) => {
    return item.id === Number(id);
  });

  filtered.done = !filtered.done;

  if (filtered.done) {
    element.innerHTML = `<i class="bi bi-clipboard2-check fs-3"></i>`;
    document.getElementById(id).classList.add("line-through");
  } else {
    document.getElementById(id).classList.remove("line-through");
    element.innerHTML = `<i class="bi bi-clipboard2 fs-3"></i>`;
  }
}

function deleteTodo(element) {
  const id = element.getAttribute("data-id");
  deleteButton.setAttribute("data-id", id);
  deleteTodoModal.show();
}
function editTodo(element) {
  const id = element.getAttribute("data-id");
  editButton.setAttribute("data-id", id);
  editTodoModal.show();
}

function confirmEdit(element) {
  const id = element.getAttribute("data-id");
  const index = data.findIndex((item) => item.id === Number(id));
  let msg = "";
  let sucess = false;
  console.log(_editTodo.value);
  if (_editTodo.value.length <= 3) {
    msg = "Ops! Descrição precisa ter mais de 3 caracteres.";
  } else {
    data[index].note = _editTodo.value;
    editTodoModal.hide();
    document.getElementById(
      id
    ).children[1].innerHTML = `<span for="${id}" class="note">${data[index].note}</span>`;
    sucess = true;
    msg = "To Do editado com sucesso!";
    _editTodo.value = "";
  }
  saveLocalStorage("todo", data);
  showFeedback(sucess, msg);
}

function confirmDelete(element) {
  console.log(element);
  const id = element.getAttribute("data-id");
  const index = data.findIndex((item) => item.id === id);

  deleteTodoModal.hide();
  document.getElementById(id).remove();
  data.splice(index, 1);

  saveLocalStorage("todo", data);
}

function addTodo(todo) {
  listTodo.innerHTML += `
    <li id="${
      todo.id
    }" class="list-group-item d-flex justify-content-between align-items-center">
    <div>
      <button
          data-id="${todo.id}"
          onclick="checkTodo(this)"
          class="btn"
        >
        <i class="bi bi-clipboard2${todo.done ? "-check" : ""} fs-3"></i>
        </button></div>
      <span for="${todo.id}"   class="note">${todo.note}</span>
      <div class="content-buttons">
        <button
          data-id="${todo.id}"
          onclick="editTodo(this)"
          class="btn"
        >
          <i class="bi bi-pencil fs-3 icon-edit"></i>

        </button>
        <button
          data-id="${todo.id}"
          onclick="deleteTodo(this)"
          class="btn"
        >
          <i class="bi bi-trash3 fs-3 icon-delete"></i>
        </button>
      </div>
    </li>
  `;
}

function createTodo() {
  const value = textTodo.value;
  const id = generateID();
  const todo = { note: value, done: false, id: id };

  let success = true;
  let msg = "";

  if (value.length > 3) {
    data.push(todo);
    addTodo(todo);
    textTodo.value = "";

    createTodoModal.hide();
    msg = "ToDo criado com sucesso!";
  } else {
    success = false;
    msg = "Ops! Descrição precisa ter mais de 3 caracteres.";
  }

  saveLocalStorage("todo", data);
  showFeedback(success, msg);
}

function renderFirst() {
  loginTrue();
  data.forEach((item) => {
    addTodo(item);
  });
}

function loginUser() {
  buttonPassword.setAttribute("class", "bi bi-eye");
  password.setAttribute("type", "password");
  if (!login.value || !password.value) {
    return showFeedback(false, "Preencha corretamente todos os campos!");
  }
  listaUser.forEach((user) => {
    if (user.email == login.value && user.password == password.value) {
      showFeedback(true, "logado");
      userLogin.push({ email: user.email, todo: [] });
      saveLocalStorage("userLogin", userLogin);
      loginTrue();
      loginTodoModal.hide();
      login.value = "";
      password.value = "";
    } else {
      return showFeedback(false, "E-mail ou senha invalidos!");
    }
  });
}
function createModalUser() {
  buttonCreatePassword.setAttribute("class", "bi bi-eye");
  createpassword.setAttribute("type", "password");
  createRepeatPassword.setAttribute("type", "password");
  loginTodoModal.hide();
  createUserTodoModal.show();
}

function createUser() {
  const valid = listaUser.some((user) => user.email === createEmail.value);
  if (valid) {
    return showFeedback(false, "E-mail já existente. Tente outro e-mail!");
  }
  if (validate.email && validate.password && validate.repeatPassword) {
    listaUser.push({
      email: createEmail.value,
      password: createpassword.value,
      todo: [],
    });
    saveLocalStorage("listaUser", listaUser);
  } else {
    return showFeedback(false, "Preencha corretamente todos os campos!");
  }
}

setTimeout(() => {
  renderFirst();
  if (!userLogin) {
    loginTodoModal.show();
  }
});
