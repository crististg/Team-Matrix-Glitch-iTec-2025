const playlist = [
    '/public/music/Albă Ca Zăpada - Pyroblast.mp3',
    '/public/music/Amurg - Pyroblast.mp3',
    '/public/music/dark things - STARSET.mp3',
    '/public/music/Invita-Ma La Dans - Pyroblast.mp3',
    '/public/music/O noapte in Anglia - Pyroblast.mp3',
    '/public/music/Showtime - Skillet.mp3',
    '/public/music/TokSik - STARSET.mp3',
    '/public/music/Whispers in the Dark - Skillet.mp3',
    '/public/music/Waiting On The Sky To Change - STARSET.mp3',
    '/public/music/ SOMETHING YOU COULD NEVER OWN - NEFFEX.mp3',
    '/public/music/Back from the Dead - Skillet.mp3',
    '/public/music/ Sex, Drugs, Etc. - Beach Weather.mp3',
    '/public/music/Do I Wanna Know - Arctic Monkeys.mp3',
    '/public/music/Halo - STARSET.mp3',
    '/public/music/La fereastra ta - Pyroblast.mp3'
];

document.addEventListener('DOMContentLoaded', () => {
    const musicPlayerFrame = document.getElementById('music-player-frame');
    const reopenButton = document.querySelector('.reopen-btn');

    // Restaurează starea playerului la încărcarea paginii
    const isPlayerOpen = localStorage.getItem('isPlayerOpen') === 'true';

    if (isPlayerOpen) {
        musicPlayerFrame.style.display = 'block';
        reopenButton.style.display = 'none';
    } else {
        musicPlayerFrame.style.display = 'none';
        reopenButton.style.display = 'block';
    }

    // Închide playerul muzical
    window.addEventListener('message', (event) => {
        if (event.data === 'close-player') {
            musicPlayerFrame.style.display = 'none';
            reopenButton.style.display = 'block';
            localStorage.setItem('isPlayerOpen', 'false');
        }
    });

    // Redeschide playerul muzical
    reopenButton.addEventListener('click', () => {
        musicPlayerFrame.style.display = 'block';
        reopenButton.style.display = 'none';
        localStorage.setItem('isPlayerOpen', 'true');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('audio');
    const playlistElement = document.querySelector('.playlist'); // Selectează lista din HTML
    let currentSong = 0;

    // Generează lista de melodii
    playlist.forEach((song, index) => {
        const li = document.createElement('li'); // Creează un element <li>
        li.textContent = song.split('/').pop().replace('.mp3', ''); // Extrage numele melodiei
        li.classList.add('playlist-item'); // Adaugă o clasă pentru stilizare
        li.addEventListener('click', () => loadSong(index)); // Adaugă evenimentul de click
        playlistElement.appendChild(li); // Adaugă <li> în <ul>
    });

    // Restaurează starea playerului la încărcare
    const savedSong = localStorage.getItem('currentSong');
    const savedTime = localStorage.getItem('currentTime');

    if (savedSong !== null) {
        currentSong = parseInt(savedSong, 10);
        loadSong(currentSong);

        if (savedTime !== null) {
            audio.currentTime = parseFloat(savedTime);
        }
    }

    // Salvează starea playerului înainte de a închide pagina
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('currentSong', currentSong);
        localStorage.setItem('currentTime', audio.currentTime);
    });

    // Încarcă o melodie
    function loadSong(index) {
        currentSong = index;
        audio.src = playlist[index];
        const songTitle = playlist[index].split('/').pop().replace('.mp3', ''); // Extrage titlul melodiei
        document.getElementById('song-title').textContent = songTitle; // Setează titlul în paragraf
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            item.classList.toggle('active', i === index); // Evidențiază melodia curentă
        });
        audio.play();
    }

    // Trecerea la următoarea melodie
    audio.addEventListener('ended', () => {
        currentSong = (currentSong + 1) % playlist.length;
        loadSong(currentSong);
    });

    // Încarcă prima melodie la pornire
    loadSong(currentSong);
});