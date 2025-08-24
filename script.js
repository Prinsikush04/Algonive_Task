let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

document.getElementById("task-form").addEventListener("submit", addTask);
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

window.onload = () => {
  renderTasks();
  checkReminders();
};

function addTask(e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (!title || !dueDate) return alert("Title and due date are required.");

  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    complete: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  e.target.reset();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  const filtered = tasks.filter(task =>
    filter === "all"
      ? true
      : filter === "complete"
      ? task.complete
      : !task.complete
  );

  filtered.forEach(task => {
    const li = document.createElement("li");
    li.className = `task ${task.complete ? "complete" : ""}`;

    li.innerHTML = `
      <strong>${task.title}</strong> 
      <span class="priority ${task.priority.toLowerCase()}">${task.priority}</span><br/>
      <small>${task.description || "No description"}</small><br/>
      <small>📅 Due: ${task.dueDate}</small>
      <div class="actions">
        <button onclick="toggleComplete(${task.id})">${task.complete ? "Undo" : "Complete"}</button>
        <button onclick="editTask(${task.id})">✏️ Edit</button>
        <button onclick="deleteTask(${task.id})">🗑 Delete</button>
      </div>
    `;
    list.appendChild(li);
  });

  updateProgress();
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, complete: !task.complete } : task
  );
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("due-date").value = task.dueDate;
  document.getElementById("priority").value = task.priority;

  deleteTask(id);
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(status) {
  filter = status;
  renderTasks();
}

function checkReminders() {
  const now = new Date();
  const upcomingTasks = tasks.filter(task => {
    const due = new Date(task.dueDate);
    const diff = (due - now) / (1000 * 60 * 60);
    return diff > 0 && diff <= 24 && !task.complete;
  });

  if (upcomingTasks.length > 0) {
    alert("⏰ Reminder:\nYou have tasks due within 24 hours!");
  }
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.complete).length;
  const percent = total ? (done / total) * 100 : 0;
  document.getElementById("progress").style.width = percent + "%";
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}
