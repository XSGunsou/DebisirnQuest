const songs = [
    { name: "มาร์ชโรงเรียนเทพศิรินทร์", file: "song_1.mp3" },
    { name: "มาร์ชเทพศิรินทร์", file: "song_2.mp3" },
    { name: "อโหกุมาร", file: "song_3.mp3" },
    { name: "เทพฯสู้ตาย", file: "song_4.mp3" },
    { name: "ดอกรำเพย", file: "song_5.mp3" },
    { name: "เทพฯไม่สิ้น", file: "song_6.mp3" },
  ];
  
  // Shuffle helper function
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  let score = 0;
  let lastPlayedSongIndex = null;
  let isPlaying = false;
  
  // Custom audio player elements
  const audioPlayer = document.getElementById("audioPlayer");
  const playPauseButton = document.getElementById("playPauseButton");
  const audioTitle = document.getElementById("audioTitle");
  const audioProgress = document.getElementById("audioProgress");
  const audioProgressBar = document.getElementById("audioProgressBar");
  
  // Load a new random song
  function loadRandomSong() {
    let correctSongIndex;
  
    // Ensure the next song doesn't repeat immediately
    do {
      correctSongIndex = Math.floor(Math.random() * songs.length);
    } while (correctSongIndex === lastPlayedSongIndex);
    lastPlayedSongIndex = correctSongIndex;
  
    const correctSong = songs[correctSongIndex];
  
    // Update audio player
    audioPlayer.src = `static/${correctSong.file}`; // Set the new audio file
    audioTitle.textContent = correctSong.name;      // Update the song title
    audioPlayer.load();                             // Reload the audio
    isPlaying = false;
    playPauseButton.textContent = "▶";             // Reset the play/pause button
    
    // Reset progress bar
    audioProgressBar.style.width = "0%";
  
    // Set incorrect options and shuffle for multiple choice
    const otherSongs = songs.filter((song, index) => index !== correctSongIndex);
    const randomIncorrectChoices = shuffleArray(otherSongs).slice(0, 3);
    const allChoices = shuffleArray([
      correctSong.name, 
      ...randomIncorrectChoices.map(song => song.name)
    ]);
  
    // Update choice buttons
    const choiceButtons = document.querySelectorAll(".choice");
    choiceButtons.forEach((button, index) => {
      button.textContent = allChoices[index];
      button.onclick = () => {
        if (button.textContent === correctSong.name) {
          alert("Correct!");
          score++;
        } else {
          alert("Wrong!");
        }
        // Update score and load next song
        document.getElementById("score").textContent = score;
        loadRandomSong();
      };
    });
  }
  
  // Play or pause the audio
  playPauseButton.addEventListener("click", () => {
    if (isPlaying) {
      audioPlayer.pause();
      playPauseButton.textContent = "▶"; // Update to play icon
    } else {
      audioPlayer.play();
      playPauseButton.textContent = "⏸"; // Update to pause icon
    }
    isPlaying = !isPlaying;
  });
  
  // Update the progress bar as the song plays
  audioPlayer.addEventListener("timeupdate", () => {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    audioProgressBar.style.width = `${progressPercent}%`;
  });
  
  // Seek when progress bar is clicked
  audioProgress.addEventListener("click", (event) => {
    const progressWidth = audioProgress.offsetWidth;
    const clickX = event.offsetX;
    const newTime = (clickX / progressWidth) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  });
  
  // Handle exit button
  document.getElementById("exitButton").addEventListener("click", () => {
    alert(`Game Over! Your final score is: ${score}`);
    window.location.reload();
  });
  
  // Start the game on window load
  window.onload = loadRandomSong;