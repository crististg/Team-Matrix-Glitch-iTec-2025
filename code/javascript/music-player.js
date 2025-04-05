document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.music-player .close-btn');
    const musicPlayer = document.querySelector('.music-player');
    const reopenButton = document.querySelector('.reopen-btn');

    closeButton.addEventListener('click', () => {
        musicPlayer.style.display = 'none';
        reopenButton.style.display = 'block';
    });

    reopenButton.addEventListener('click', () => {
        musicPlayer.style.display = 'block';
        reopenButton.style.display = 'none';
    });
});

const playlist = [
    'public/music/Albă Ca Zăpada - Pyroblast.mp3',
    'public/music/Amurg - Pyroblast.mp3',
    'public/music/dark things - STARSET.mp3',
    'public/music/Invita-Ma La Dans - Pyroblast.mp3',
    'public/music/O noapte in Anglia - Pyroblast.mp3',
    'public/music/Showtime - Skillet.mp3',
    'public/music/TokSik - STARSET.mp3',
    'public/music/Whispers in the Dark - Skillet.mp3'
  ];

  let currentSong = 0;
  const audio = document.getElementById('audio');
  const nowPlaying = document.getElementById('now-playing');

  function loadSong(index) {
    audio.src = playlist[index];
    nowPlaying.textContent = 'Now Playing: ' + playlist[index].split('/').pop();
    audio.play();
  }

  function nextSong() {
    currentSong = (currentSong + 1) % playlist.length;
    loadSong(currentSong);
  }

  function prevSong() {
    currentSong = (currentSong - 1 + playlist.length) % playlist.length;
    loadSong(currentSong);
  }

  // Auto-play the first song on load
  window.onload = () => loadSong(currentSong);

  // Auto-play next when current ends
  audio.addEventListener('ended', nextSong);









