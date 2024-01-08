document.addEventListener('DOMContentLoaded', (event) => {
    let beep = new Audio('https://www.soundjay.com/button/beep-07.wav');
    let soundEnabled = false;

    document.getElementById('enable-sound-button').addEventListener('click', function() {
        beep.load();
        beep.play().then(() => {
            soundEnabled = true;
            this.textContent = 'Sound Enabled (Click to Test)';
            beep.pause();
        }).catch(e => {
            console.log("Audio enable failed: ", e.message);
            this.textContent = 'Enable Sound (Click Again if Needed)';
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

    // ... [Rest of your existing functions] ...

    function preWorkoutCountdown(countdownSeconds, totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        // ... [Existing countdown functionality] ...

        startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled);
    }

    function startWorkout(totalDuration, exerciseInterval, restInterval, beep, soundEnabled) {
        // ... [Existing workout functionality] ...
    }

    // ... [Rest of your script.js code] ...
});
