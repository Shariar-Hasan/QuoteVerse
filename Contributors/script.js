document.addEventListener('DOMContentLoaded', () => {
  const contributorsContainer = document.getElementById('contributors-container');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const paginationInfo = document.getElementById('pagination-info');
  
  let pageCount = 1;
  let totalPages = 0;
  const itemsPerPage = 10; // Display 10 contributors per page

  loadContributors(pageCount, contributorsContainer);

  prevPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageCount > 1) {
      pageCount--;
      loadContributors(pageCount, contributorsContainer);
    }
  });

  nextPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageCount < totalPages) {
      pageCount++;
      loadContributors(pageCount, contributorsContainer);
    }
  });

  function loadContributors(pageCount, contributorsContainer) {
    fetch(`https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors?per_page=${itemsPerPage}&page=${pageCount}`)
      .then(response => response.json())
      .then(data => {
        contributorsContainer.innerHTML = ""; // Clear previous results

        data.forEach(contributor => {
          const contributorCard = getContributorCard();
          contributorCard.href = contributor.html_url;

          const img = contributorCard.querySelector('img');
          img.src = contributor.avatar_url;
          img.alt = contributor.login;

          contributorCard.querySelector('.contributor-username').textContent = contributor.login;
          contributorCard.querySelector('.contributor-commits').textContent =
            contributor.contributions + (contributor.contributions === 1 ? " commit" : " commits");

          contributorsContainer.appendChild(contributorCard);
        });

        // Update the pagination to reflect total contributors and pages
        fetchTotalContributors().then(totalContributors => {
          totalPages = Math.ceil(totalContributors / itemsPerPage);
          paginationInfo.textContent = `Page ${pageCount} of ${totalPages}`;

          prevPageBtn.disabled = pageCount === 1;
          nextPageBtn.disabled = pageCount === totalPages;
        });
      });
  }

  function fetchTotalContributors() {
    return fetch('https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors')
      .then(response => response.json())
      .then(data => data.length); // Get total contributors count
  }

  function getContributorCard() {
    return document.querySelector('.contributor-card').cloneNode(true);
  }
});


// Search and Sorting
function searchContributors() {
  let input = document.getElementById('search-bar').value.toLowerCase();
  let contributorCards = document.getElementsByClassName('contributor-card');

  Array.from(contributorCards).forEach(card => {
    let contributorName = card.querySelector('.contributor-username').textContent.toLowerCase();
    if (contributorName.includes(input)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}

function sortContributors() {
  let sortOption = document.getElementById('sort-options').value;
  let contributors = Array.from(document.getElementsByClassName('contributor-card'));

  if (sortOption === "commits") {
    contributors.sort((a, b) => {
      return parseInt(b.querySelector('.contributor-commits').textContent.split(" ")[0]) -
             parseInt(a.querySelector('.contributor-commits').textContent.split(" ")[0]);
    });
  } else if (sortOption === "name") {
    contributors.sort((a, b) => {
      return a.querySelector('.contributor-username').textContent.localeCompare(b.querySelector('.contributor-username').textContent);
    });
  }

  let container = document.getElementById('contributors-container');
  contributors.forEach(contributor => container.appendChild(contributor));
}
