// JavaScript to create random glitch lines

document.addEventListener('DOMContentLoaded', () => {
    const glitchySection = document.querySelector('.glitchy-section');
    const glitchLinesContainer = document.createElement('div');
    glitchLinesContainer.classList.add('glitch-lines');
    glitchySection.appendChild(glitchLinesContainer);
  
    // Function to create random lines
    function createGlitchLines() {
      const numberOfLines = 20;
      for (let i = 0; i < numberOfLines; i++) {
        const glitchLine = document.createElement('div');
        glitchLine.classList.add('glitch-line');
        glitchLine.style.top = `${Math.random() * 100}%`;
        glitchLine.style.animationDuration = `${Math.random() * 0.2 + 0.1}s`;
        glitchLinesContainer.appendChild(glitchLine);
      }
    }
  
    createGlitchLines();
  });
  