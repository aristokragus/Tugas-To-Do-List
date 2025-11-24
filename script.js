const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const activeList = document.getElementById('activeList');

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
    li.innerHTML = `<span class="task-text">${text}</span>`; 
    activeList.appendChild(li);
}