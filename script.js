document.addEventListener('DOMContentLoaded', (event) => {
    let beep = new Audio('https://www.soundjay.com/button/beep-07.wav');

    document.getElementById('start-button').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Please enter valid durations.');
            return;
        }

        // Load the beep sound in advance to circumvent browser restrictions
        beep.load();

        const totalDuration = getSeconds('total-minutes', 'total-seconds');
        const exerciseInterval = getSeconds('exercise-minutes', 'exercise-seconds');
        const restInterval = getSeconds('rest-minutes', 'rest-seconds');

        // Start the pre-workout countdown
        preWorkoutCountdown(3, totalDuration, exerciseInterval, restInterval, beep);
    });

    function validateInputs() {
        // Ensure all elements exist before attempting to read their values
        if (!document.getElementById('total-minutes') || !document.getElementById('total-seconds') ||
            !document.getElementById('exercise-minutes') || !document.getElementById('exercise-seconds') ||
            !document.getElementById('rest-minutes') || !document.getElementById('rest-seconds')) {
            console.error('One or more input elements cannot be found.');
            return false;
        }

        const totalMinutes = parseInt(document.getElementById('total-minutes').value) || 0;
        const totalSeconds = parseInt(document.getElementById('total-seconds').value) || 0;
        const exerciseMinutes = parseInt(document.getElementById('exercise-minutes').value) || 0;
        const exerciseSeconds = parseInt(document.getElementById('exercise-seconds').value) || 0;
        const restMinutes = parseInt(document.getElementById('rest-minutes').value) || 0;
        const restSeconds = parseInt(document.getElementById('rest-seconds').value) || 0;

        return isNumberInRange(totalMinutes, 0, 180) &&
               isNumberInRange(totalSeconds, 0, 59) &&
               isNumberInRange(exerciseMinutes, 0, 180) &&
               isNumberInRange(exerciseSeconds, 0, 59) &&
               isNumberInRange(restMinutes, 0, 180) &&
               isNumberInRange(restSeconds, 0, 59);
    }

    function isNumberInRange(value, min, max) {
        return typeof value === 'number' && value >= min && value <= max;
    }

    function getSeconds(minutesId, secondsId) {
        const minutes = parseInt(document.getElementById(minutesId).value) || 0;
        const seconds = parseInt(document.getElementById(secondsId).value) || 0;
        return minutes * 60 + seconds;
    }

    function preWorkoutCountdown(countdownSeconds, totalDuration, exerciseInterval, restInterval, beep) {
        let countdown = countdownSeconds;
        updateMessage(`Starting in ${countdown}...`);
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                updateMessage(`Starting in ${countdown}...`);
            } else {
                clearInterval(countdownInterval);
                updateMessage('GO!');
                startWorkout(totalDuration, exerciseInterval, restInterval, beep);
            }
        }, 1000);
    }

    function startWorkout(totalDuration, exerciseInterval, restInterval, beep) {
        let remainingTime = totalDuration;
        let intervalTime = exerciseInterval;
        let isExercise = true;

        document.querySelector('.container').classList.remove('active');
        document.querySelector('.timer-screen').classList.add('active');
        
        beep.play(); // Play beep sound at the start

        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                updateTimerDisplay(0);
                updateMessage('Workout COMPLETE!');
                showResetButton();
                return;
            }

            if (intervalTime <= 0) {
                isExercise = !isExercise;
                intervalTime = isExercise ? exerciseInterval : restInterval;
                updateMessage(isExercise ? 'GO!' : 'Rest!');
                beep.play(); // Play beep sound at each transition
            }

            updateTimerDisplay(remainingTime);
            intervalTime--;
            remainingTime--;
        }, 1000);
    }

    function updateTimerDisplay(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        document.getElementById('timer-display').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateMessage(message) {
        document.getElementById('timer-message').textContent = message;
    }

    function showResetButton() {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Workout';
        resetButton.onclick = function() {
            document.querySelector('.timer-screen').classList.remove('active');
            document.querySelector('.container').classList.add('active');
            this.remove(); // Remove the reset button after use
        };
        document.querySelector('.timer-screen').appendChild(resetButton);
    }
});
