document.addEventListener('DOMContentLoaded', () => {
    const contributorsContainer = document.getElementById('contributors-container');

    fetch('https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors')
        .then(response => response.json())
        .then(data => {
            data.forEach(contributor => {
                const contributorDiv = document.createElement('div');
                contributorDiv.classList.add('contributor');
                
                const img = document.createElement('img');
                img.src = contributor.avatar_url;
                img.alt = contributor.login;
                img.addEventListener("click",()=>window.open(contributor.html_url, "_blank"))
                
                const h3 = document.createElement('h3');
                h3.textContent = contributor.login;

                contributorDiv.appendChild(img);
                contributorDiv.appendChild(h3);
                contributorsContainer.appendChild(contributorDiv);
            });
        });
});