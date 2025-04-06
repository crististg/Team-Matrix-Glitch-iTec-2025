document.addEventListener('DOMContentLoaded', () => {
    const collaborationsContainer = document.getElementById('collaborations-container');

    // Fetch colaborări din backend
    fetch('http://localhost:3000/collaborations')
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch collaborations');
            }
            return response.json();
        })
        .then((collaborations) => {
            collaborations.forEach((collaboration) => {
                const collaborationCard = document.createElement('div');
                collaborationCard.classList.add('collaboration-card');
                collaborationCard.innerHTML = `
                    <div class="collaboration-images">
                        <img src="${collaboration.image}" class="collaboration-image">
                        <img src="${collaboration.image2}" class="collaboration-image">
                    </div>
                    <h3>${collaboration.name}</h3>
                    <p>${collaboration.description}</p>
                    <p><strong>Price:</strong> $${collaboration.price.toFixed(2)}</p>
                `;
                collaborationsContainer.appendChild(collaborationCard);
            });
        })
        .catch((error) => {
            console.error('Error fetching collaborations:', error);
        });
});