document.addEventListener('DOMContentLoaded', () => {
    const closeButton = document.querySelector('.music-player .close-btn');
    const musicPlayer = document.querySelector('.music-player');
    const reopenButton = document.querySelector('.reopen-btn');
  
    closeButton.addEventListener('click', () => {
      musicPlayer.classList.add('hidden');
      setTimeout(() => {
        musicPlayer.style.display = 'none';
        reopenButton.style.display = 'block';
      }, 300); // wait for transition to end
    });
  
    reopenButton.addEventListener('click', () => {
      musicPlayer.style.display = 'block';
      // Force reflow to make transition work
      void musicPlayer.offsetWidth;
      musicPlayer.classList.remove('hidden');
      reopenButton.style.display = 'none';
    });
  });
  