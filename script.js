const songs = [
  { name: "มาร์ชโรงเรียนเทพศิรินทร์", file: "song_1.mp3" },
  { name: "มาร์ชเทพศิรินทร์", file: "song_2.mp3" },
  { name: "อโหกุมาร", file: "song_3.mp3" },
  { name: "เทพฯสู้ตาย", file: "song_4.mp3" },
  { name: "ดอกรำเพย", file: "song_5.mp3" },
  { name: "เทพฯไม่สิ้น", file: "song_6.mp3" },
  { name: "เราเทพศิรินทร์", file: "song_7.mp3" },
  { name: "จตุรมิตรสามัคคี", file: "song_8.mp3" },
  { name: "จตุรมิตรสามัคคี (เก่า)", file: "song_9.mp3" },
  { name: "แผ่นดินเกียรติภูมิ", file: "song_10.mp3" },
];

// Shuffle helper function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

let score = 0;
let isPlaying = false;

// Song shuffle state
let shuffledSongs = shuffleArray([...songs]);
let currentSongIndex = 0;

// Custom player elements
const audioPlayer = document.getElementById("audioPlayer");
const playPauseButton = document.getElementById("playPauseButton");
const audioProgress = document.getElementById("audioProgress");
const audioProgressBar = document.getElementById("audioProgressBar");
const notification = document.getElementById("notification");

// Function to display notifications
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = type;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 2000);
}

// Load the next song in shuffled queue
function loadRandomSong() {
  // Reshuffle if at the end of list
  if (currentSongIndex >= shuffledSongs.length) {
    shuffledSongs = shuffleArray([...songs]);
    currentSongIndex = 0;
  }

  const correctSong = shuffledSongs[currentSongIndex];
  currentSongIndex++;

  audioPlayer.src = `static/${correctSong.file}`;
  audioPlayer.load();
  audioProgressBar.style.width = "0%";
  playPauseButton.textContent = "▶";

  // Create 3 incorrect choices
  const otherSongs = songs.filter(song => song.name !== correctSong.name);
  const randomIncorrect = shuffleArray(otherSongs).slice(0, 3);
  const allChoices = shuffleArray([
    correctSong.name,
    ...randomIncorrect.map(song => song.name),
  ]);

  const choiceButtons = document.querySelectorAll(".choice");
  choiceButtons.forEach((button, index) => {
    button.textContent = allChoices[index];
    button.onclick = () => {
      if (button.textContent === correctSong.name) {
        showNotification("Correct!", "correct");
        score++;
      } else {
        showNotification("Wrong!", "wrong");
      }
      document.getElementById("score").textContent = score;
      setTimeout(loadRandomSong, 2000);
    };
  });
}

// Play/Pause button logic
playPauseButton.addEventListener("click", () => {
  if (isPlaying) {
    audioPlayer.pause();
    playPauseButton.textContent = "▶";
  } else {
    audioPlayer.play();
    playPauseButton.textContent = "⏸";
  }
  isPlaying = !isPlaying;
});

// Update progress bar
audioPlayer.addEventListener("timeupdate", () => {
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  audioProgressBar.style.width = `${progress}%`;
});

// Seek on progress bar click
audioProgress.addEventListener("click", (event) => {
  const width = audioProgress.offsetWidth;
  const clickX = event.offsetX;
  const duration = audioPlayer.duration;
  audioPlayer.currentTime = (clickX / width) * duration;
});

// Exit button logic
document.getElementById("exitButton").addEventListener("click", () => {
  showNotification(`Game Over! Your final score is: ${score}`, "correct");
  setTimeout(() => window.location.reload(), 2000);
});

// Start game
window.onload = loadRandomSong;
