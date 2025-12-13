const todoList = document.getElementById("todoList");
const todoInput = document.getElementById("todoInput");
const dateInput = document.getElementById("dateInput");

/*display todo*/
function addTodo() {
        const input = document.getElementById("todoInput").value;
        const inputdate = document.getElementById("dateInput").value;
        /*const value = input.value.trim();*/

        if (input.trim() === "" || inputdate.trim() === "") {
        alert("Nama task dan deadline harus diisi!");
        return;
        }

        // Buat elemen <li> baru
        let li = document.createElement("li");

        // Tentukan warna berdasarkan deadline
        li.style.background = getColor(inputdate);

        // Isi text task
        let span = document.createElement("span");
        span.textContent = `${input} — ${inputdate}`;
        li.appendChild(span);

        // Masukkan ke dalam list
        document.getElementById("todoList").appendChild(li);

        // Tombol Edit
        let editBtn = document.createElement("button");
        // Tombol Delete
        let delBtn = document.createElement("button");
        delBtn.textContent = "Hapus";
        editBtn.textContent = "Edit";
        delBtn.className = "button:hover delete-btn";
        editBtn.className = "button:hover edit-btn";
        editBtn.onclick = function() {
            editTask(span, li);
        };
        delBtn.onclick = function() {
            li.remove();
        };

        li.appendChild(editBtn);
        li.appendChild(delBtn);

        // Edit task
        function editTask(span, li) {
        const [oldName, oldDeadline] = span.textContent.split(" — ");

        let newName = prompt("Edit nama task:", oldName);
        let newDeadline = prompt("Edit deadline (YYYY-MM-DD):", oldDeadline);

        if (newName && newDeadline) {
            span.textContent = `${newName} — ${newDeadline}`;
            li.style.background = getColor(newDeadline);
        }
        }
        
        

        document.getElementById("todoList").appendChild(li);

        document.getElementById("input").value = "";
        document.getElementById("inputdate").value = "";
    }

    // Warna berdasarkan deadline
    function getColor(inputdate) {
        const today = new Date().toISOString().split("T")[0];

        if (inputdate < today) {
            return "#e93333ff"; // merah (telat)
        } else if (inputdate === today) {
            return "#8adaffff"; // oranye (hari ini)
        } else {
            return "#49fc49ff"; // hijau (masih jauh)
        }
    }

    /* --------------------- FILTER ----------------------- */
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    function renderTasks() {
        const list = document.getElementById("todoList");
        list.innerHTML = "";

        const filter = document.getElementById("filterSelect").value;
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0];

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        // Filter task sesuai pilihan filter
        let filteredTasks = tasks.filter(task => {
            switch(filter) {
                case 'today':
                    return task.deadline === todayStr;
                case 'tomorrow':
                    return task.deadline === tomorrowStr;
                case 'overdue':
                    return task.deadline < todayStr;
                case 'upcoming':
                    return task.deadline > tomorrowStr;
                case 'all':
                default:
                    return true;
            }
        });
}