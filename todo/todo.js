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
const userLogin = getLocalStorage("userLogin") || null;
const listaUser = getLocalStorage("listaUser");
const loader = document.querySelector(".bg-loader");

const confirmDeleteValue = false;
const textTodo = document.getElementById("text-todo");
const _editTodo = document.getElementById("edit-todo");
const buttonCreate = document.getElementById("button-create");
const buttonLogin = document.getElementById("button-login");
const deleteButton = document.getElementById("delete-button");
const editButton = document.getElementById("edit-button");
const feedBackToastEl = document.getElementById("feedback-toast");
const listTodo = document.getElementById("list-todo");

const createTodoModal = new bootstrap.Modal("#create-todo-modal");
const exitUserTodoModal = new bootstrap.Modal("#exit-todo-modal");
const deleteTodoModal = new bootstrap.Modal("#delete-todo-modal");
const editTodoModal = new bootstrap.Modal("#edit-todo-modal");
const feedBackToast = new bootstrap.Toast(feedBackToastEl);

function userExit() {
  atualizaUsuario();
  localStorage.removeItem("userLogin");
  loader.setAttribute("style", "display: flex");
  setTimeout(() => {
    window.location.href = "../login/login.html";
  }, 1000);
  return showFeedback(true, "Desconectando... Por favor, aguarde.");
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
  const filtered = userLogin.todo.find((item) => {
    return item.id === Number(id);
  });

  filtered.done = !filtered.done;

  if (filtered.done) {
    element.innerHTML = `<i class="bi icon bi-clipboard2-check fs-3"></i>`;
    document.getElementById(id).classList.add("line-through");
  } else {
    document.getElementById(id).classList.remove("line-through");
    element.innerHTML = `<i class="bi icon bi-clipboard2 fs-3"></i>`;
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
  const index = userLogin.todo.findIndex((item) => item.id === Number(id));
  let msg = "";
  let sucess = false;
  if (_editTodo.value.length <= 3) {
    msg = "Ops! Descrição precisa ter mais de 3 caracteres.";
  } else {
    userLogin.todo[index].note = _editTodo.value;
    editTodoModal.hide();
    document.getElementById(
      id
    ).children[1].innerHTML = `<span for="${id}" class="note">${userLogin.todo[index].note}</span>`;
    sucess = true;
    msg = "To Do editado com sucesso!";
    _editTodo.value = "";
  }
  saveLocalStorage("userLogin", userLogin);
  showFeedback(sucess, msg);
}

function confirmDelete(element) {
  console.log(element);
  const id = element.getAttribute("data-id");
  const index = userLogin.todo.findIndex((item) => item.id === id);

  deleteTodoModal.hide();
  document.getElementById(id).remove();
  userLogin.todo.splice(index, 1);

  saveLocalStorage("todo", data);
}

function addTodo(todo) {
  listTodo.innerHTML += `
    <li id="${
      todo.id
    }" class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
    <div>
      <button
          data-id="${todo.id}"
          onclick="checkTodo(this)"
          class="btn"
        >
        <i class="bi icon bi-clipboard2${todo.done ? "-check" : ""} fs-3"></i>
        </button></div>
      <span for="${todo.id}" class="lead note">${todo.note}</span>
      <div class="content-buttons">
        <button
          data-id="${todo.id}"
          onclick="editTodo(this)"
          class="btn "
        >
          <i class="bi bi-pencil fs-3 icon icon-edit"></i>

        </button>
        <button
          data-id="${todo.id}"
          onclick="deleteTodo(this)"
          class="btn"
        >
          <i class="bi icon bi-trash3 fs-3 icon-delete"></i>
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
    userLogin.todo.push(todo);
    addTodo(todo);
    textTodo.value = "";

    createTodoModal.hide();
    msg = "ToDo criado com sucesso!";
  } else {
    success = false;
    msg = "Ops! Descrição precisa ter mais de 3 caracteres.";
  }

  saveLocalStorage("userLogin", userLogin);
  showFeedback(success, msg);
}

function renderFirst() {
  userLogin.todo.forEach((item) => {
    addTodo(item);
  });
}

function atualizaUsuario() {
  listaUser.forEach((user) => {
    if (user.email === userLogin.email) {
      user.todo = userLogin.todo;
      saveLocalStorage("listaUser", listaUser);
    }
  });
}

setTimeout(() => {
  if (!userLogin) return (window.location.href = "../login/login.html");
  else return renderFirst();
});
