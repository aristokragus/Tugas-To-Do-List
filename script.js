const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const activeList = document.getElementById('activeList');
const completedList = document.getElementById('completedList');
const completedContainer = document.getElementById('completedContainer')
const toggleIcon = document.getElementById('toggleIcon')
const countDisplay = document.getElementById('countDisplay');
const deleteModal = document.getElementById('deleteModal');
const confirmBtn = document.getElementById('confirmBtn');
const cancelBtn = document.getElementById('cancelBtn');

let taskToDelete = null;

function clickAdd() {
    if (taskInput.value.trim() !== "") {
        addTask(taskInput.value);
        taskInput.value = "";
    }
}

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') clickAdd();
});

addTaskBtn.addEventListener('click', function () {
    clickAdd();
});

function addTask(text) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span class="task-text">${text}</span>
        <div class="actions">
            ${generateButtons('active')}
        </div>
    `;

    li.style.opacity = '0';
    activeList.appendChild(li);
    setTimeout(() => li.style.opacity = '1', 10);
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

function toggleComplete(element) {
    const li = element.closest('li');
    const actionDiv = li.querySelector('.actions');
    
    li.classList.toggle('completed');
    
    li.style.opacity = '0';
    li.style.transform = 'translateX(20px)';
    
    setTimeout(() => {
        if (li.classList.contains('completed')) {
            completedList.prepend(li);
            actionDiv.innerHTML = generateButtons('completed'); 
        } else {
            activeList.prepend(li);
            actionDiv.innerHTML = generateButtons('active');
        }

        li.style.opacity = '1';
        li.style.transform = 'translateX(0)';
        updateCount();
    }, 300);
}


function toggleCompleteSection() {
    completedContainer.classList.toggle('show');
    toggleIcon.classList.toggle('rotate');
}

function saveTask(li, input) {
    const newText = input.value;

    const finalText = newText.trim() === "" ? "Tugas Kosong" : newText;

    const span = document.createElement('span');
    span.className = 'task-text';
    span.innerText = finalText;

    try {
        li.replaceChild(span, input);
    } catch (e) {
    }
}

function deleteTask(element) {
    taskToDelete = element.closest('li');
    
    deleteModal.classList.add('active');
}

function editTask(element) {
    const li = element.closest('li');
    const spanText = li.querySelector('.task-text');

    if (li.querySelector('.edit-input')) return;

    const currentText = spanText.innerText;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input'; 

    li.replaceChild(input, spanText);
    input.focus();

    
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveTask(li, input);
        }
    });

    input.addEventListener('blur', function() {
        saveTask(li, input);
    });
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

function toggleCompletedSection() {
    completedContainer.classList.toggle('show');
    toggleIcon.classList.toggle('rotate');
}

function updateCount() {
    countDisplay.innerText = completedList.children.length;
}

confirmBtn.addEventListener('click', function() {
    if (taskToDelete) {
        
        taskToDelete.style.opacity = '0';
        taskToDelete.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            taskToDelete.remove();
            updateCount();
            taskToDelete = null; 
        }, 300);
    }
    closeModal();
});

cancelBtn.addEventListener('click', function() {
    taskToDelete = null; 
    closeModal();
});

function closeModal() {
    deleteModal.classList.remove('active');
}

deleteModal.addEventListener('click', function(e) {
    if (e.target === deleteModal) {
        closeModal();
    }
});