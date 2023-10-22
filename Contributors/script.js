document.addEventListener('DOMContentLoaded', () => {
  const contributorsContainer = document.getElementById(
    'contributors-container'
  );
  fetch('https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors')
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((contributor) => {
        const contributor_card = getContributorCard();
        contributor_card.href = contributor.html_url;

        const img = contributor_card.querySelector('img');
        img.src = contributor.avatar_url;
        img.alt = contributor.login;

        contributor_card.querySelector('.contributor-username').textContent = contributor.login;
		if (contributor.contributions == 1)
			contributor_card.querySelector(".contributor-commits").textContent = contributor.contributions + " commit";
		else
			contributor_card.querySelector(".contributor-commits").textContent = contributor.contributions + " commits";

        contributorsContainer.appendChild(contributor_card);
      });
    });
});

function getContributorCard() {
  return document.querySelector('.contributor-card').cloneNode(true);
}
