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