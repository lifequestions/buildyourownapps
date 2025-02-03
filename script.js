class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.savedWorkTime = this.workTime; // Store remaining work time
        this.savedBreakTime = this.breakTime; // Store remaining break time
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkTime = true;
        this.timer = null;

        // DOM elements
        this.timerDisplay = document.getElementById('timer');
        this.modeDisplay = document.getElementById('mode');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.modeToggle = document.getElementById('modeToggle');

        // Event listeners
        this.startBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.modeToggle.addEventListener('change', () => this.switchMode());

        // Add keyboard event listener
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    handleKeyPress(e) {
        // Check if user is typing in an input field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key.toLowerCase()) {
            case 's':
                if (!this.isRunning) {
                    this.start();
                    this.startBtn.textContent = 'Pause';
                }
                break;
            case 'p':
                if (this.isRunning) {
                    this.pause();
                    this.startBtn.textContent = 'Start';
                }
                break;
            case 'r':
                this.reset();
                break;
            case 'm':
                this.switchMode();
                break;
        }
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pause();
            this.startBtn.textContent = 'Start';
        } else {
            this.start();
            this.startBtn.textContent = 'Pause';
        }
    }

    start() {
        this.isRunning = true;
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft === 0) {
                this.switchMode();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timer);
    }

    reset() {
        this.pause();
        this.isWorkTime = true;
        this.savedWorkTime = this.workTime;
        this.savedBreakTime = this.breakTime;
        this.timeLeft = this.workTime;
        this.startBtn.textContent = 'Start';
        this.modeToggle.checked = false;
        document.body.classList.remove('rest-mode');  // Reset background color
        this.updateDisplay();
    }

    switchMode() {
        // Save current time before switching
        if (this.isWorkTime) {
            this.savedWorkTime = this.timeLeft;
        } else {
            this.savedBreakTime = this.timeLeft;
        }

        this.isWorkTime = !this.isWorkTime;
        this.timeLeft = this.isWorkTime ? this.savedWorkTime : this.savedBreakTime;
        this.modeToggle.checked = !this.isWorkTime;
        document.body.classList.toggle('rest-mode', !this.isWorkTime);

        // Different effects for work and rest modes
        if (this.isWorkTime) {
            // Matrix money effect
            const duration = 2000;
            const end = Date.now() + duration;
            
            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 90,
                    spread: 100,
                    origin: { y: 0, x: 0.5 },
                    gravity: 0.35,
                    velocity: 2,
                    colors: ['#00ff00', '#32cd32'], // Matrix green colors
                    shapes: ['text'],
                    scalar: 2,
                    shapeOptions: {
                        text: { 
                            value: '$',
                            font: 'matrix',
                            size: '24px'
                        }
                    },
                    ticks: 300
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();
        } else {
            // Fireworks effect for rest mode
            const duration = 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { 
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
                    colors: ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#ee82ee'],
                }));
            }, 250);
        }

        this.updateDisplay();
        
        // Play notification sound
        const audio = new Audio('data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=');
        audio.play();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update timer display
        this.timerDisplay.textContent = timeString;
        
        // Update document title
        document.title = `${timeString} - ${this.isWorkTime ? 'Work' : 'Rest'} - Pomodoro Timer`;
        
        // Update mode display
        this.modeDisplay.textContent = this.isWorkTime ? 'Time to Work!' : 'Time to Rest!';
        this.modeDisplay.style.color = this.isWorkTime ? '#4CAF50' : '#f44336';
    }
}

// Initialize the timer
const pomodoro = new PomodoroTimer();

// Add this at the start of your script
window.onload = function() {
    const modal = document.getElementById('taskModal');
    const taskInput = document.getElementById('taskInput');
    const startFocusBtn = document.getElementById('startFocusBtn');
    const modeDiv = document.getElementById('mode');
    const closeBtn = document.querySelector('.close');
    let currentTask = ''; // Store the current task

    // Show modal and focus input when page loads
    modal.style.display = 'block';
    taskInput.focus();

    // Close modal functions
    function closeModal() {
        const task = taskInput.value.trim();
        if (task) {
            currentTask = task; // Store the task
            updateModeText(task);
            document.title = `(25:00) ${task} - Pomodoro Timer`;
        } else {
            currentTask = ''; // No task
            modeDiv.textContent = "Time to Work!";
            document.title = "Pomodoro Timer";
        }
        modal.style.display = 'none';
    }

    // Function to update mode text
    function updateModeText(task) {
        if (task) {
            modeDiv.textContent = `Time to Work on ${task}!`;
        } else {
            modeDiv.textContent = "Time to Work!";
        }
    }

    // Override any existing mode text updates in the timer
    const originalSetMode = PomodoroTimer.prototype.setMode;
    PomodoroTimer.prototype.setMode = function(isWorkTime) {
        if (currentTask) {
            updateModeText(currentTask);
        } else {
            originalSetMode.call(this, isWorkTime);
        }
    };

    // Close button click
    closeBtn.addEventListener('click', closeModal);

    // Click outside modal
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Start focus button click
    startFocusBtn.addEventListener('click', closeModal);

    // Enter key to submit
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            closeModal();
        }
    });

    // Prevent the mode text from changing when timer starts
    const startBtn = document.getElementById('startBtn');
    startBtn.addEventListener('click', function(e) {
        // Don't change the mode text here
        // The text should stay as is
        e.stopPropagation(); // Prevent any default text changes
    });
}; 