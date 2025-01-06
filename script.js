let timeLeft;
let timerId = null;
let isWorkTime = true;
let currentTask = '';

const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const addTimeButton = document.getElementById('add-time');
const modeText = document.getElementById('mode-text');
const taskModal = document.getElementById('task-modal');
const taskInput = document.getElementById('task-input');
const taskSubmit = document.getElementById('task-submit');
const toggleButton = document.getElementById('toggle-mode');
const taskDisplay = document.getElementById('task-display');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

function showTaskModal() {
    taskModal.style.display = 'block';
    taskInput.focus();
}

function hideTaskModal() {
    taskModal.style.display = 'none';
    taskInput.value = '';
}

function handleTaskSubmit() {
    currentTask = taskInput.value.trim() || 'Pomodoro Session';
    hideTaskModal();
    updateTaskDisplay();
    startTimerInterval();
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = WORK_TIME;
        }
        
        if (isWorkTime) {
            showTaskModal();
            return;
        }
        
        startTimerInterval();
    }
}

function startTimerInterval() {
    if (timerId !== null) {
        clearInterval(timerId);
    }
    
    timerId = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft === 0) {
            clearInterval(timerId);
            timerId = null;
            switchMode();
            startButton.disabled = false;
            pauseButton.disabled = true;
        }
    }, 1000);

    startButton.disabled = true;
    pauseButton.disabled = false;
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    currentTask = '';
    updateTaskDisplay();
    startButton.disabled = false;
    pauseButton.disabled = true;
    updateDisplay();
}

function addFiveMinutes() {
    timeLeft += 5 * 60;
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = currentTask ? 
        `${timeString} - ${currentTask}` : 
        `${timeString} - Pomodoro`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
    modeText.textContent = isWorkTime ? 'Work Time' : 'Break Time';
    currentTask = '';
    updateTaskDisplay();
    
    if (isWorkTime) {
        toggleButton.classList.remove('rest-mode');
        toggleButton.classList.add('work-mode');
        toggleButton.innerHTML = '☽';
    } else {
        toggleButton.classList.remove('work-mode');
        toggleButton.classList.add('rest-mode');
        toggleButton.innerHTML = '☀';
    }
    
    updateDisplay();
}

function updateTaskDisplay() {
    if (currentTask && isWorkTime) {
        taskDisplay.textContent = `Focusing on: ${currentTask}`;
        taskDisplay.classList.add('active');
    } else {
        taskDisplay.classList.remove('active');
    }
}

// Event Listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
addTimeButton.addEventListener('click', addFiveMinutes);

// Modal Event Listeners
taskSubmit.addEventListener('click', handleTaskSubmit);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleTaskSubmit();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && taskModal.style.display === 'block') {
        currentTask = 'Pomodoro Session';
        hideTaskModal();
        startTimerInterval();
    }
});

taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
        currentTask = 'Pomodoro Session';
        hideTaskModal();
        startTimerInterval();
    }
});

// Add toggle button event listener
toggleButton.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    switchMode();
    startButton.disabled = false;
    pauseButton.disabled = true;
});

// Initialize the display
resetTimer(); 