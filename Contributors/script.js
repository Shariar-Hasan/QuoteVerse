document.addEventListener('DOMContentLoaded', () => {
  const contributorsContainer = document.getElementById(
    'contributors-container'
  );
  const load_more_btn = document.getElementById("load-more")

  let page_count = 1;
  loadMore(page_count, contributorsContainer);

  load_more_btn.addEventListener("click", (e) => {
    e.preventDefault();

    page_count++;
    return loadMore(page_count, contributorsContainer, load_more_btn);
  })
});

function loadMore(page_count, contributorsContainer, load_more_btn) {
  fetch(`https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors?per_page=30&page=${page_count}`)
    .then((response) => response.json())
    .then((data) => {

      if (data.length === 0) {
          load_more_btn.classList.remove("active")
          load_more_btn.classList.add("blocked")
          return;
      }

      data.forEach((contributor) => {
        const contributor_card = getContributorCard();
        contributor_card.href = contributor.html_url;

        const img = contributor_card.querySelector('img');
        img.src = contributor.avatar_url;
        img.alt = contributor.login;

        contributor_card.querySelector('.contributor-username').textContent = contributor.login;
        if (contributor.contributions == 1) {
          contributor_card.querySelector(".contributor-commits").textContent = contributor.contributions + " commit";
        } else {
          contributor_card.querySelector(".contributor-commits").textContent = contributor.contributions + " commits";
        }
        contributorsContainer.appendChild(contributor_card);
      });
    });
}

function getContributorCard() {
  return document.querySelector('.contributor-card').cloneNode(true);
}
