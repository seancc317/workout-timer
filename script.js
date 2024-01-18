document.addEventListener('DOMContentLoaded', (event) => {
    let beep = new Audio('https://raw.githubusercontent.com/seancc317/workout-timer/main/699701__magnuswaker__elevator-beep.wav');
    let applause = new Audio('https://githubusercontent.com/seancc317/workout-timer/main/181934__landub__applause2.wav'); // Insert the URL of your applause sound file
    let soundEnabled = false;

    const enableSoundButton = document.getElementById('enable-sound-button');
    enableSoundButton.textContent = 'Enable Sound';

    enableSoundButton.addEventListener('click', function() {
        beep.load();
        beep.play().then(() => {
            soundEnabled = true;
            enableSoundButton.textContent = 'Sound Enabled';
        }).catch(e => {
            console.error("Audio enable failed: ", e.message);
            enableSoundButton.textContent = 'Enable Sound (Click Again if Needed)';
            setTimeout(() => {
                enableSoundButton.textContent = 'Enable Sound';
            }, 3000);
        });
    });

    document.getElementById('start-button').addEventListener('click', function() {
        if (!validateInputs()) {
            alert('Please enter valid durations.');
            return;
        }

        const totalDuration = getSeconds('total-minutes', 'total-seconds');
        const exerciseInterval = getSeconds('exercise-minutes', 'exercise-seconds');
        const restInterval = getSeconds('rest-minutes', 'rest-seconds');

        preWorkoutCountdown(3, totalDuration, exerciseInterval, restInterval, beep, soundEnabled);
    });

    function validateInputs() {
        const totalMinutes = document.getElementById('total-minutes').value;
        const totalSeconds = document.getElementById('total-seconds').value;
        const exerciseMinutes = document.getElementById('exercise-minutes').value;
        const exerciseSeconds = document.getElementById('exercise-seconds').value;
        const restMinutes = document.getElementById('rest-minutes').value;
        const restSeconds = document.getElementById('rest-seconds').value;

        return totalMinutes !== '' && totalSeconds !== '' && exerciseMinutes !== '' &&
               exerciseSeconds !== '' && restMinutes !== '' && restSeconds !== '';
    }

    function getSeconds(minutesId, secondsId) {
        const minutes = parseInt(document.getElementById(minutesId).value) || 0;
        const seconds = parseInt(document.getElementById(secondsId).value) || 0;
        return (minutes * 60) + seconds;
    }

    function preWorkoutCountdown(countdownSeconds, totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        let countdown = countdownSeconds;
        document.getElementById('countdown-display').textContent = `Starting in ${countdown}...`;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                document.getElementById('countdown-display').textContent = `Starting in ${countdown}...`;
            } else {
                clearInterval(countdownInterval);
                document.getElementById('countdown-display').textContent = '';
                startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled);
            }
        }, 1000);
    }

    function startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        let remainingTime = totalDuration;
        let intervalTime = exerciseInterval;
        let isExercisePeriod = true;
        document.querySelector('.container').classList.remove('active');
        document.querySelector('.timer-screen').classList.add('active');
        updateMessage('GO!');

        const interval = setInterval(() => {
            if (remainingTime <= 0) {
                clearInterval(interval);
                updateTimerDisplay(0);
                updateMessage('Workout COMPLETE!');
                if (soundEnabled) {
                    applause.play();
                }
                showResetButton();
                return;
            }

            if (intervalTime <= 0) {
                isExercisePeriod = !isExercisePeriod;
                intervalTime = isExercisePeriod ? exerciseInterval : restInterval;
                updateMessage(isExercisePeriod ? 'GO!' : 'Rest!');
                if (soundEnabled) {
                    beep.play();
                }
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
        resetButton.addEventListener('click', () => {
            document.querySelector('.timer-screen').classList.remove('active');
            document.querySelector('.container').classList.add('active');
            document.getElementById('total-minutes').value = '';
            document.getElementById('total-seconds').value = '';
            document.getElementById('exercise-minutes').value = '';
            document.getElementById('exercise-seconds').value = '';
            document.getElementById('rest-minutes').value = '';
            document.getElementById('rest-seconds').value = '';
            enableSoundButton.textContent = 'Enable Sound';
            soundEnabled = false;
        });
        document.querySelector('.timer-screen').appendChild(resetButton);
    }
});
