// Deklarasi variabel
let focusButton = document.getElementById("pomodoro");
let buttons = document.querySelectorAll("button");
let shortBreakButton = document.getElementById("shortbreak");
let longBreakButton = document.getElementById("longbreak");
let startBtn = document.getElementById("btn-start");
let reset = document.getElementById("btn-reset");
let pause = document.getElementById("btn-pause");
let time = document.getElementById("time");
let totalFocusTime = 0;
let set;

// Time
let active = "pomodoro";
let count = 59; // menyimpan hitungan detik
let paused = true; // menyimpan status jeda
let minCount = 24; // menyimpan hitungan menit
time.textContent = `${minCount + 1}:00`; // Menampilkan waktu awal "25:00" di elemen time

// Menambahkan angka 0 di depan
const appendZero = (value) => {
  value = value < 10 ? `0${value}` : value; // angka kurang dari 10 akan memiliki nol di depan
  return value;
};

// Event Listener tombol reset
reset.addEventListener( // menghentikan timer, mengatur ulang hitungan menit berdasarkan status aktif
  "click",
  (resetTime = () => {
    pauseTimer();
    switch (active) {
      case "long":  // untuk long break
        minCount = 14;
        break;
      case "short":  // untuk short break
        minCount = 4;
        break;
      default:
        minCount = 24;
        break;
    }
    count = 59;
    time.textContent = `${minCount + 1}:00`;
  })
);

// Mengubah Focus
const removeFocus = () => {
  buttons.forEach((button) => {
    button.classList.remove("button-focus"); // remove focus untuk button yang memiliki kelas button-focus
  });
};

focusButton.addEventListener("click", () => {
  removeFocus();
  focusButton.classList.add("button-focus"); // mengatur ulang ke mode awalnya
  pauseTimer();
  minCount = 24;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

shortBreakButton.addEventListener("click", () => {
  active = "short";
  removeFocus();
  shortBreakButton.classList.add("button-focus"); // add button-focus untuk button short break
  pauseTimer();
  minCount = 4;
  count = 59;
  time.textContent = `${appendZero(minCount + 1)}:00`;
});

longBreakButton.addEventListener("click", () => {
  active = "long";
  removeFocus();
  longBreakButton.classList.add("button-focus"); // add button-focus untuk button long break
  pauseTimer();
  minCount = 14;
  count = 59;
  time.textContent = `${minCount + 1}:00`;
});

// Event untuk tombol pause
pause.addEventListener(
  "click",
  (pauseTimer = () => {
    paused = true;
    clearInterval(set);
    startBtn.classList.remove("hide");
    pause.classList.remove("show");
    reset.classList.remove("show");
  })
);

// Event untuk tombol start
startBtn.addEventListener("click", () => {
  reset.classList.add("show");
  pause.classList.add("show");
  startBtn.classList.add("hide");
  startBtn.classList.remove("show");
  if (paused) {
    paused = false; // ketika paused bernilai false, maka timer akan mulai berjalan
    time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
    set = setInterval(() => { // menjalankan interval timer
      count--;
      time.textContent = `${appendZero(minCount)}:${appendZero(count)}`;
      if (count == 0) { // ketika detiknya 0
        if (minCount != 0) { // jika menit belum 0
            minCount--;
            count = 60;
        } else { // jika menit sudah 0 (timer selesai)
            clearInterval(set);
            
            // Update laporan hanya jika mode pomodoro
            if (active === "pomodoro") {
                totalFocusTime += currentSettings.pomodoroTime;
                updateReport();
            }
    
            // Mainkan alarm
            const alarm = new Audio('../assets/audio/alarm-clock.mp3'); // Path ke file audio
            // Tambahkan event listener untuk memastikan audio sudah siap
            alarm.addEventListener('canplaythrough', () => {
              alarm.play()
                  .then(() => console.log("Alarm played successfully"))
                  .catch(error => console.log("Error playing audio:", error));
            });
        }
      }
    }, 1000); // fungsi dijalankan setiap 1000 milidetik (1 detik)
  }
});


// Memuat sidebar.html ke dalam div dengan id="sidebar" 
fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
        // Menyisipkan HTML ke dalam elemen sidebar
        document.getElementById('sidebar').innerHTML = data;

        // Menambahkan skrip eksternal setelah memuat HTML
        let script = document.createElement('script');
        script.src = 'js/sidebar.js'; // Path ke file sidebar.js
        script.defer = true;
        document.body.appendChild(script);  // Menambahkan ke body atau head
    });


// Di script.js - tambahkan variabel untuk menyimpan setting terakhir
let currentSettings = {
  pomodoroTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15
};

// Update event listeners untuk buttons
focusButton.addEventListener("click", () => {
  active = "pomodoro";
  removeFocus();
  focusButton.classList.add("button-focus");
  pauseTimer();
  minCount = currentSettings.pomodoroTime - 1;
  count = 59;
  time.textContent = `${appendZero(currentSettings.pomodoroTime)}:00`;
});

shortBreakButton.addEventListener("click", () => {
  active = "short";
  removeFocus();
  shortBreakButton.classList.add("button-focus");
  pauseTimer();
  minCount = currentSettings.shortBreakTime - 1;
  count = 59;
  time.textContent = `${appendZero(currentSettings.shortBreakTime)}:00`;
});

longBreakButton.addEventListener("click", () => {
  active = "long";
  removeFocus();
  longBreakButton.classList.add("button-focus");
  pauseTimer();
  minCount = currentSettings.longBreakTime - 1;
  count = 59;
  time.textContent = `${appendZero(currentSettings.longBreakTime)}:00`;
});

// Update event listener settingsUpdate untuk menyimpan setting
window.addEventListener('settingsUpdate', function(e) {
  currentSettings = e.detail;
});

// Update Timer
window.addEventListener('settingsUpdate', function(e) {
  const { pomodoroTime, shortBreakTime, longBreakTime } = e.detail;
  
  // Update timer sesuai mode aktif
  switch (active) {
      case "pomodoro":
          minCount = pomodoroTime - 1;
          time.textContent = `${appendZero(pomodoroTime)}:00`;
          break;
      case "short":  
          minCount = shortBreakTime - 1; 
          time.textContent = `${appendZero(shortBreakTime)}:00`;
          break;
      case "long":
          minCount = longBreakTime - 1;
          time.textContent = `${appendZero(longBreakTime)}:00`;
          break;
  }
  count = 59;
  pauseTimer();
});
