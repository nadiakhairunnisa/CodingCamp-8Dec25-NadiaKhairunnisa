const taskList = document.getElementById("taskList");
const darkModeBtn = document.getElementById("darkModeBtn");

// Load semua saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
    loadTasks();
    loadTheme();
});

/* --------------------- TAMBAHKAN TUGAS ----------------------- */
function addTask() {
    let taskText = document.getElementById("taskInput").value.trim();
    let taskDate = document.getElementById("dateInput").value;

    if (taskText === "") {
        alert("Tugas tidak boleh kosong!");
        return;
    }

    createTaskElement(taskText, taskDate);
    saveTasks();

    document.getElementById("taskInput").value = "";
    document.getElementById("dateInput").value = "";
}

function createTaskElement(text, date, completed = false) {
    let li = document.createElement("li");
    li.draggable = true;

    li.className = completed ? "completed" : "";

    li.innerHTML = `
        <span class="task-text">${text}</span>
        <span class="date-info">${date || ""}</span>
        <div class="btn-box">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Hapus</button>
        </div>
    `;

    taskList.appendChild(li);
}

/* --------------------- CLICK EVENT ----------------------- */
taskList.addEventListener("click", (e) => {
    let li = e.target.closest("li");

    if (e.target.classList.contains("task-text")) {
        li.classList.toggle("completed");
    }

    if (e.target.classList.contains("delete-btn")) {
        li.remove();
    }

    if (e.target.classList.contains("edit-btn")) {
        let newText = prompt("Edit tugas:", li.querySelector(".task-text").innerText);
        if (newText !== null && newText.trim() !== "") {
            li.querySelector(".task-text").innerText = newText.trim();
        }
    }

    saveTasks();
});

/* --------------------- FILTER ----------------------- */
function filterTasks() {
    let filter = document.getElementById("filter").value;
    let tasks = document.querySelectorAll("li");

    tasks.forEach((li) => {
        li.style.display =
            filter === "all" ? "flex" :
            filter === "active" && !li.classList.contains("completed") ? "flex" :
            filter === "completed" && li.classList.contains("completed") ? "flex" :
            "none";
    });
}

/* --------------------- DARK MODE ----------------------- */
darkModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

function loadTheme() {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }
}

/* --------------------- DRAG & DROP ----------------------- */
let dragItem = null;

taskList.addEventListener("dragstart", (e) => {
    dragItem = e.target;
    e.target.classList.add("dragging");
});

taskList.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
    dragItem = null;
    saveTasks();
});

taskList.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(taskList, e.clientY);
    if (afterElement == null) {
        taskList.appendChild(dragItem);
    } else {
        taskList.insertBefore(dragItem, afterElement);
    }
});

function getDragAfterElement(list, y) {
    const draggable = [...list.querySelectorAll("li:not(.dragging)")];

    return draggable.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/* --------------------- SAVE & LOAD ----------------------- */
function saveTasks() {
    let data = [];

    document.querySelectorAll("li").forEach((li) => {
        data.push({
            text: li.querySelector(".task-text").innerText,
            date: li.querySelector(".date-info").innerText,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem("tasks", JSON.stringify(data));
}

function loadTasks() {
    let saved = JSON.parse(localStorage.getItem("tasks")) || [];

    saved.forEach(t => createTaskElement(t.text, t.date, t.completed));
}