var deschis=1;
document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.music-player .close-btn');
    const musicPlayer = document.querySelector('.music-player');
    const reopenButton = document.querySelector('.reopen-btn');

    closeButton.addEventListener('click', () => {
        deschis=0;
        musicPlayer.style.display = 'none';
        reopenButton.style.display = 'block';
    });

    reopenButton.addEventListener('click', () => {
        deschis=1;
    });

    if(deschis==1){
        musicPlayer.style.display = 'block';
        reopenButton.style.display = 'none';
    }else{
        musicPlayer.style.display = 'none';
        reopenButton.style.display = 'block';
    }
});