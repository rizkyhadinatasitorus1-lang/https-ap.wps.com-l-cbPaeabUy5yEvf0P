// Alarm functionality
const alarmTimeInput = document.getElementById('alarmTime');
const alarmLabelInput = document.getElementById('alarmLabel');
const addAlarmBtn = document.getElementById('addAlarmBtn');
const alarmList = document.getElementById('alarmList');
const clockDisplay = document.getElementById('clockDisplay');
const alarmSound = document.getElementById('alarmSound');
const themeToggle = document.getElementById('themeToggle');

let alarms = [];
let alarmCheckInterval;

// Theme Management
function toggleTheme() {
    document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light');
    updateThemeIcon();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark-mode');
    themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadAlarms();
    updateClock();
    startClockUpdate();
    themeToggle.addEventListener('click', toggleTheme);
    addAlarmBtn.addEventListener('click', addAlarm);
    alarmTimeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addAlarm();
    });
});

// Update clock display
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    
    // Check alarms
    checkAlarms();
}

function startClockUpdate() {
    alarmCheckInterval = setInterval(updateClock, 1000);
}

// Add alarm
function addAlarm() {
    const time = alarmTimeInput.value;
    const label = alarmLabelInput.value || 'Alarm';
    
    if (!time) {
        alert('Please select a time');
        return;
    }
    
    const alarm = {
        id: Date.now(),
        time: time,
        label: label,
        active: true
    };
    
    alarms.push(alarm);
    saveAlarms();
    renderAlarms();
    
    alarmTimeInput.value = '';
    alarmLabelInput.value = '';
}

// Delete alarm
function deleteAlarm(id) {
    alarms = alarms.filter(alarm => alarm.id !== id);
    saveAlarms();
    renderAlarms();
}

// Toggle alarm
function toggleAlarm(id) {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
        alarm.active = !alarm.active;
        saveAlarms();
        renderAlarms();
    }
}

// Check if any alarm matches current time
function checkAlarms() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    alarms.forEach(alarm => {
        if (alarm.active && alarm.time === currentTime && !alarm.triggered) {
            triggerAlarm(alarm);
            alarm.triggered = true;
        }
    });
    
    // Reset trigger flag at next minute
    if (now.getSeconds() === 0) {
        alarms.forEach(alarm => {
            alarm.triggered = false;
        });
    }
}

// Trigger alarm
function triggerAlarm(alarm) {
    // Play sound
    alarmSound.play().catch(e => console.log('Audio playback failed:', e));
    
    // Show notification
    showAlarmNotification(alarm);
    
    // Vibrate if available
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200, 100, 200]);
    }
}

// Show alarm notification
function showAlarmNotification(alarm) {
    const notification = document.createElement('div');
    notification.className = 'alarm-notification';
    notification.innerHTML = `
        <button class="alarm-notification-close" onclick="this.parentElement.remove()">×</button>
        <h2>🔔 Alarm!</h2>
        <p><strong>${alarm.label}</strong></p>
        <p>${alarm.time}</p>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 10000);
}

// Render alarms
function renderAlarms() {
    if (alarms.length === 0) {
        alarmList.innerHTML = `
            <div class="empty-alarms">
                <i class="fas fa-inbox" style="font-size: 3em; margin-bottom: 10px; display: block;"></i>
                <p>No alarms set. Add one to get started!</p>
            </div>
        `;
        return;
    }
    
    alarmList.innerHTML = alarms.map(alarm => `
        <div class="alarm-item">
            <div>
                <div class="alarm-time">${alarm.time}</div>
                <div class="alarm-label">${alarm.label}</div>
            </div>
            <div class="alarm-actions">
                <button class="alarm-toggle ${!alarm.active ? 'disabled' : ''}" onclick="toggleAlarm(${alarm.id})" title="${alarm.active ? 'Disable' : 'Enable'}">
                    <i class="fas fa-${alarm.active ? 'toggle-on' : 'toggle-off'}"></i>
                </button>
                <button class="alarm-delete" onclick="deleteAlarm(${alarm.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Save alarms to localStorage
function saveAlarms() {
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// Load alarms from localStorage
function loadAlarms() {
    const saved = localStorage.getItem('alarms');
    if (saved) {
        try {
            alarms = JSON.parse(saved);
        } catch (e) {
            alarms = [];
        }
    }
    renderAlarms();
}
