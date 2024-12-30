// Get all buttons
const todoBtn = document.getElementById('todoBtn');
const musicBtn = document.getElementById('musicBtn');
const reportBtn = document.getElementById('reportBtn');
const settingBtn = document.getElementById('settingBtn');

// Ambil semua box
const todoBox = document.querySelector('.todo-box');
const musicBox = document.querySelector('.music-box');
const reportBox = document.querySelector('.report-box');
const settingBox = document.querySelector('.setting-box');


// Function to sembunyi all boxes
function sembunyiAllBoxes() {
    document.querySelectorAll('.content-box').forEach(box => {
        box.classList.add('sembunyi');
    });
}

// Add click event listeners
todoBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Todo button clicked'); // Debug log
    sembunyiAllBoxes();
    todoBox.classList.remove('sembunyi');
});

musicBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Music button clicked'); // Debug log
    sembunyiAllBoxes();
    musicBox.classList.remove('sembunyi');
});

reportBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Report button clicked'); // Debug log
    sembunyiAllBoxes();
    reportBox.classList.remove('sembunyi');
});

settingBtn.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('Setting button clicked'); // Debug log
    sembunyiAllBoxes();
    settingBox.classList.remove('sembunyi');
});

// Close boxes when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.content-box') && 
        !e.target.closest('#todoBtn') &&
        !e.target.closest('#musicBtn') &&
        !e.target.closest('#reportBtn') && 
        !e.target.closest('#settingBtn') &&
        !e.target.classList.contains('span')) {
        sembunyiAllBoxes();
    }
});

// Debug log
console.log('Script loaded successfully');

// To do list
const inputBox = document.getElementById("input-box")
const listGroup = document.getElementById("list-group")

function addTask(){
    if(inputBox.value === ''){
        alert("You must write something!");
    }
    else{
        let li = document.createElement("li")
        li.innerHTML = inputBox.value;
        listGroup.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        span.classList.add('span');
        li.appendChild(span);
    }
    inputBox.value = "";
    saveData();
    updateReport();
}

listGroup.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked");
        saveData();
        updateReport();
    } 
    else if(e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        updateReport();
    }
}, false);

function saveData(){
    localStorage.setItem("data", listGroup.innerHTML)
}

function showTodo(){
    listGroup.innerHTML = localStorage.getItem("data");
}

showTodo();
updateReport();

// Update Report
// Fungsi untuk menghitung tugas yang selesai
function getCompletedTasks() {
    const checkedTasks = document.querySelectorAll('.checked').length;
    return checkedTasks;
}

// Fungsi untuk mengupdate laporan
function updateReport() {
    const hours = Math.floor(totalFocusTime / 60);
    const minutes = totalFocusTime % 60;
    const completedTasks = getCompletedTasks();

    // Update tampilan laporan
    document.querySelector('.report-box .list-group-item:first-child .d-flex span:last-child')
        .textContent = `${hours}h ${minutes}m`;
    
    document.querySelector('.report-box .list-group-item:last-child .d-flex span:last-child')
        .textContent = completedTasks;

    saveFocusTime()
}

// Fungsi untuk menyimpan waktu fokus ke localStorage
function saveFocusTime() {
    const today = new Date().toISOString().split('T')[0]; // Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
    localStorage.setItem("totalFocusTime", JSON.stringify(totalFocusTime));
}

// Fungsi untuk mengambil waktu fokus dari localStorage
function loadFocusTime() {
    const savedFocusTime = localStorage.getItem("totalFocusTime");
    if (savedFocusTime !== null) {
        totalFocusTime = parseInt(savedFocusTime);
    }
}

// Fungsi untuk menampilkan data laporan dari localStorage
function showFocusTime() {
    const reportBoxContent = localStorage.getItem("reportFocus"); 
    if (reportBoxContent) { 
        document.querySelector('.report-box').innerHTML = reportBoxContent;
    }
}

// Panggil loadFocusTime saat halaman dimuat
document.addEventListener("DOMContentLoaded", function() { 
    loadFocusTime();
    showFocusTime(); 
    showTodo(); 
    updateReport();
});




// Update Playlist
document.getElementById('update-playlist').addEventListener('click', function() {
    // Ambil nilai URL dari input
    const newUrl = document.getElementById('input-playlist').value;
    
    // Validasi URL (opsional)
    if(newUrl.includes("https://open.spotify.com/embed/playlist/")) {
        // Perbarui URL iframe
        document.getElementById('musicPlay').src = newUrl;
    } else {
        alert('Please enter a valid Spotify playlist link');
    }
});


// Update Timer
const updateTimerBtn = document.getElementById('update-timer');

updateTimerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const pomodoroTime = parseInt(document.getElementById('pomodoroTimer').value);
    const shortBreakTime = parseInt(document.getElementById('shortBreak').value);
    const longBreakTime = parseInt(document.getElementById('longBreak').value);

    // Validasi
    if (pomodoroTime < 1 || pomodoroTime > 60 || 
        shortBreakTime < 1 || shortBreakTime > 60 || 
        longBreakTime < 1 || longBreakTime > 60) {
        alert('Please enter values between 1 and 60 minutes');
        return;
    }

    // Kirim event ke index.html
    const event = new CustomEvent('settingsUpdate', {
        detail: {
            pomodoroTime,
            shortBreakTime,
            longBreakTime
        }
    });
    window.dispatchEvent(event);
});
