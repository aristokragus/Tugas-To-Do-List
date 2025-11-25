const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const activeList = document.getElementById('activeList');
const completedList = document.getElementById('completedList');
const countDisplay = document.getElementById('countDisplay');


function clickAdd() {
    if (taskInput.value.trim() !== "") {
        addTask(taskInput.value);
        taskInput.value = "";
    }
}

function AddTask() {
    const text = taskInput.value.trim();
    if (text !== "") {
        createTaskElement(text);
        taskInput.value = ""; 
        taskInput.focus();
    }
}

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') AddTask();
});

addTaskBtn.addEventListener('click', function () {
    AddTask();
});

function createTaskElement(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${text}</span>
        <div class="actions">
            ${generateButtons('active')}
        </div>
    `;
    activeList.appendChild(li);
}

function generateButtons(status) {
    if (status === 'active') {
        return `
            <div class="action-btn pin-btn" onclick="togglePin(this)" title="Pin ke atas"> <i class="fas fa-thumbtack"></i></div>
            <div class="action-btn edit-btn" onclick="editTask(this)" title="Edit Tugas"><i class="fas fa-pen"></i></div>
            <div class="action-btn done-btn" onclick="toggleComplete(this)" title="Selesai"><i class="fas fa-check"></i></div>
            <div class="action-btn delete-btn" onclick="deleteTask(this)" title="Hapus"><i class="fas fa-trash"></i></div>
        `;
    } else if (status === 'completed'){
        return `
            <div class="action-btn undo-btn" onclick="toggleComplete(this)" title="Batal"><i class="fas fa-rotate-left"></i></div>
            <div class="action-btn delete-btn" onclick="deleteTask(this)" title="Hapus"><i class="fas fa-trash"></i></div>
        `;
    }
}

function deleteTask(element) {
    if(confirm("Hapus tugas?")){
        element.closest('li').remove();
    }
}

function toggleComplete(element) {
    const li = element.closest('li');
    li.classList.toggle('completed');
    
    if (li.classList.contains('completed')) {
        completedList.prepend(li);
        li.querySelector('.actions').innerHTML = generateButtons('completed');
    } else {
        activeList.prepend(li);
        li.querySelector('.actions').innerHTML = generateButtons('active');
    }
}

function togglePin(element) {
    element.classList.toggle('active');
    const li = element.closest('li');
    const parentList = li.parentElement;

    if (element.classList.contains('active')) {
        li.style.transition = 'opacity 0.3s';
        li.style.opacity = '0.4';
        setTimeout(() => {
            parentList.prepend(li);
            li.style.opacity = '1'
        }, 300);
    }
}

function toggleCompleteSection() {
    completedContainer.classList.toggle('show');
    toggleIcon.classList.toggle('rotate');
}