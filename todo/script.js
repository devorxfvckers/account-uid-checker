// To-Do List Application with Local Storage
let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
    document.getElementById('todoInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
});

// Add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const priority = document.getElementById('prioritySelect').value;
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: priority,
        createdAt: new Date().toLocaleString(),
        completedAt: null
    };

    todos.unshift(todo);
    saveTodos();
    loadTodos();
    input.value = '';
    document.getElementById('prioritySelect').value = 'medium';
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? new Date().toLocaleString() : null;
        saveTodos();
        loadTodos();
    }
}

// Delete a todo
function deleteTodo(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        loadTodos();
    }
}

// Edit a todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newText = prompt('Edit your task:', todo.text);
        if (newText && newText.trim() !== '') {
            todo.text = newText.trim();
            saveTodos();
            loadTodos();
        }
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (filter === 'all') {
        document.getElementById('filterAll').classList.add('active');
    } else if (filter === 'active') {
        document.getElementById('filterActive').classList.add('active');
    } else if (filter === 'completed') {
        document.getElementById('filterCompleted').classList.add('active');
    }
    
    loadTodos();
}

// Clear completed todos
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        loadTodos();
    }
}

// Load and display todos
function loadTodos() {
    const container = document.getElementById('todosContainer');
    container.innerHTML = '';

    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    if (filteredTodos.length === 0) {
        container.innerHTML = '<p class="empty-message">No tasks yet. Add one to get started! 🚀</p>';
        updateStats();
        return;
    }

    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        container.appendChild(todoElement);
    });

    updateStats();
}

// Create todo element
function createTodoElement(todo) {
    const div = document.createElement('div');
    div.className = `todo-item ${todo.completed ? 'completed' : ''} ${todo.priority}-priority`;
    
    const priorityEmoji = todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢';
    const timeAgo = getTimeAgo(new Date(todo.createdAt));

    div.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox" 
            ${todo.completed ? 'checked' : ''} 
            onchange="toggleTodo(${todo.id})"
        />
        <div class="todo-content">
            <div class="todo-text">${escapeHtml(todo.text)}</div>
            <div class="todo-meta">
                <span class="priority-badge ${todo.priority}">${priorityEmoji} ${todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}</span>
                <span class="time-badge">📅 ${timeAgo}</span>
                ${todo.completedAt ? `<span class="time-badge">✓ Completed ${getTimeAgo(new Date(todo.completedAt))}</span>` : ''}
            </div>
        </div>
        <div class="todo-actions">
            <button onclick="editTodo(${todo.id})" class="edit-btn">✏️ Edit</button>
            <button onclick="deleteTodo(${todo.id})" class="delete-btn">🗑️ Delete</button>
        </div>
    `;

    return div;
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const active = total - completed;

    document.getElementById('totalTodos').textContent = `Total: ${total}`;
    document.getElementById('completedTodos').textContent = `Completed: ${completed}`;
    document.getElementById('activeTodos').textContent = `Active: ${active}`;
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Export todos as JSON
function exportTodos() {
    if (todos.length === 0) {
        alert('No tasks to export!');
        return;
    }

    const dataStr = JSON.stringify(todos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import todos from JSON
function importTodos() {
    document.getElementById('importFile').click();
}

// Handle file import
function handleImport() {
    const file = document.getElementById('importFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedTodos = JSON.parse(e.target.result);
            if (Array.isArray(importedTodos)) {
                if (confirm(`Import ${importedTodos.length} tasks? This will merge with existing tasks.`)) {
                    todos = [...importedTodos, ...todos];
                    saveTodos();
                    loadTodos();
                    alert('Tasks imported successfully!');
                }
            } else {
                alert('Invalid file format!');
            }
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    };
    reader.readAsText(file);
    document.getElementById('importFile').value = '';
}

// Reset all todos
function resetAll() {
    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
        if (confirm('This action is permanent. Are you absolutely sure?')) {
            todos = [];
            saveTodos();
            loadTodos();
            alert('All tasks have been deleted!');
        }
    }
}

// Calculate time ago
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}