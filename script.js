const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const activeList = document.getElementById('activeList');
const completedList = document.getElementById('completedList');
const countDisplay = document.getElementById('countDisplay');

function triggerAddTask() {
    const text = taskInput.value.trim();
    if (text !== "") {
        createTaskElement(text);
        taskInput.value = ""; 
        taskInput.focus();
    }
}

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') triggerAddTask();
});

addTaskBtn.addEventListener('click', function () {
    triggerAddTask();
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
        <div class="action-btn done-btn" onclick="toggleStatus(this)"><i class="fas fa-check"></i></div>
        <div class="action-btn delete-btn" onclick="deleteTask(this)"><i class="fas fa-trash"></i></div>`;
    }
}

function deleteTask(element) {
    if(confirm("Hapus tugas?")){
        element.closest('li').remove();
    }
}

function toggleStatus(element) {
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