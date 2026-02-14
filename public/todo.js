const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearBtn = document.getElementById('clear-completed');
const dateDisplay = document.getElementById('date-display');

// Display Date
const options = { weekday: 'long', month: 'short', day: 'numeric' };
dateDisplay.innerHTML = new Date().toLocaleDateString('en-US', options);

// GET USER ID
const userId = localStorage.getItem('hubUserId');
if (!userId) window.location.href = 'login.html'; // Protect the route

let tasks = [];

// 1. LOAD TASKS FROM DATABASE
async function fetchTasks() {
    const res = await fetch(`/api/todos?userId=${userId}`);
    tasks = await res.json();
    renderTasks();
}

function renderTasks() {
    todoList.innerHTML = '';
    let pendingCount = 0;

    tasks.forEach((task, index) => {
        if (!task.completed) pendingCount++;
        const li = document.createElement('li');
        li.classList.add('todo-item');
        if (task.completed) li.classList.add('completed');

        li.innerHTML = `
            <div class="check-btn" onclick="toggleComplete(${task.id}, ${task.completed})">
                ${task.completed ? '<i class="fas fa-check" style="font-size: 0.7rem;"></i>' : ''}
            </div>
            <span class="todo-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
        `;
        todoList.appendChild(li);
    });
    itemsLeft.innerText = `${pendingCount} task${pendingCount !== 1 ? 's' : ''} pending`;
}

// 2. ADD TASK TO DATABASE
async function addTask() {
    const text = input.value.trim();
    if (text === '') return;

    const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text })
    });
    
    if(res.ok) {
        input.value = '';
        fetchTasks(); // Reload list
    }
}

// 3. TOGGLE COMPLETE IN DATABASE
async function toggleComplete(id, currentStatus) {
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
    });
    fetchTasks();
}

// 4. DELETE FROM DATABASE
async function deleteTask(id) {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    fetchTasks();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });

// Initial Load
fetchTasks();