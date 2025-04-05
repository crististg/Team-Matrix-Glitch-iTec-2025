const playlist = [
    '/public/music/Albă Ca Zăpada - Pyroblast.mp3',
    '/public/music/Amurg - Pyroblast.mp3',
    '/public/music/dark things - STARSET.mp3',
    '/public/music/Invita-Ma La Dans - Pyroblast.mp3',
    '/public/music/O noapte in Anglia - Pyroblast.mp3',
    '/public/music/Showtime - Skillet.mp3',
    '/public/music/TokSik - STARSET.mp3',
    '/public/music/Whispers in the Dark - Skillet.mp3'
];

document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.music-player .close-btn');
    const musicPlayer = document.querySelector('.music-player');
    const reopenButton = document.querySelector('.reopen-btn');
    const audio = document.getElementById('audio');
    const nowPlaying = document.getElementById('now-playing');
    let currentSong=0;

    closeButton.addEventListener('click', () => {
        musicPlayer.style.display = 'none';
        reopenButton.style.display = 'block';
    });

    reopenButton.addEventListener('click', () => {
        musicPlayer.style.display = 'block';
        reopenButton.style.display = 'none';
    });

    const playlistElement = document.querySelector('.playlist');

    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.textContent = song.split('/').pop();
        li.addEventListener('click', () => loadSong(index));
        playlistElement.appendChild(li);
    });

    function loadSong(index) {
        currentSong = index;
    
        document.querySelectorAll('.playlist li').forEach(li => li.classList.remove('active'));
    
        playlistElement.children[index].classList.add('active');
    
        audio.src = playlist[index];
        nowPlaying.textContent = 'Now Playing: ' + playlist[index].split('/').pop();
        audio.play();
    }

    audio.addEventListener('ended', () => {
        currentSong = (currentSong + 1) % playlist.length;
        loadSong(currentSong);
    });

    loadSong(currentSong);
});