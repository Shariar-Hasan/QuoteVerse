document.addEventListener('DOMContentLoaded', () => {
    const contributorsContainer = document.getElementById('contributors-container');

    fetch('https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors')
        .then(response => response.json())
        .then(data => {
            data.forEach(contributor => {
                const contributorDiv = document.createElement('div');
                contributorDiv.classList.add('contributor');

                const contributorLink = document.createElement('a');
                contributorLink.href = contributor.html_url;
                contributorLink.target = '_blank';
                contributorLink.rel = 'noopener noreferrer';

                const img = document.createElement('img');
                img.src = contributor.avatar_url;
                img.alt = contributor.login;

                const h3 = document.createElement('h3');
                h3.textContent = contributor.login;

                contributorLink.appendChild(img);
                contributorLink.appendChild(h3);
                contributorDiv.appendChild(contributorLink);
                contributorsContainer.appendChild(contributorDiv);
            });
        });
});