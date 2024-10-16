document.addEventListener('DOMContentLoaded', () => {
  const contributorsContainer = document.getElementById('contributors-container');
  const prevPageBtn = document.getElementById('prev-page');
  const nextPageBtn = document.getElementById('next-page');
  const paginationInfo = document.getElementById('pagination-info');
  const sortOptions = document.getElementById('sort-options');
  
  let pageCount = 1;
  let totalPages = 0;
  const itemsPerPage = 12; // Display 12 contributors per page
  let allContributors = []; // Store all contributors here
  let sortedContributors = []; // Store sorted contributors here

  // Load all contributors initially
  loadAllContributors();

  prevPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageCount > 1) {
      pageCount--;
      displayContributors(pageCount, contributorsContainer);
    }
  });

  nextPageBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (pageCount < totalPages) {
      pageCount++;
      displayContributors(pageCount, contributorsContainer);
    }
  });

  // Handle sort changes
  sortOptions.addEventListener('change', () => {
    applySort(); // Apply sorting when the user changes the sorting option
    pageCount = 1; // Reset to page 1 after sorting
    displayContributors(pageCount, contributorsContainer); // Display sorted contributors
  });

  // Function to fetch and store all contributors across all pages
  function loadAllContributors() {
    let currentPage = 1;
    const perPage = 100; // Fetch up to 100 contributors per API call
    const contributorsUrl = `https://api.github.com/repos/Shariar-Hasan/QuoteVerse/contributors`;

    function fetchContributorsPage(page) {
      fetch(`${contributorsUrl}?per_page=${perPage}&page=${page}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            allContributors = allContributors.concat(data); // Append contributors to the list
            fetchContributorsPage(page + 1); // Fetch next page
          } else {
            sortedContributors = [...allContributors]; // Initially, sortedContributors is the same as allContributors
            totalPages = Math.ceil(allContributors.length / itemsPerPage);
            displayContributors(pageCount, contributorsContainer);
          }
        });
    }

    fetchContributorsPage(currentPage); // Start fetching from the first page
  }

  // Display contributors for the current page
  function displayContributors(pageCount, contributorsContainer) {
    contributorsContainer.innerHTML = ""; // Clear previous results

    const startIndex = (pageCount - 1) * itemsPerPage;
    const endIndex = pageCount * itemsPerPage;
    const contributorsToShow = sortedContributors.slice(startIndex, endIndex); // Get the sorted contributors for the current page

    contributorsToShow.forEach(contributor => {
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

    paginationInfo.textContent = `Page ${pageCount} of ${totalPages}`;

    prevPageBtn.disabled = pageCount === 1;
    nextPageBtn.disabled = pageCount === totalPages;
  }

  // Apply sorting to all contributors before displaying
  function applySort() {
    const sortOption = sortOptions.value;

    if (sortOption === "commits") {
      sortedContributors.sort((a, b) => b.contributions - a.contributions); // Sort by contributions (descending)
    } else if (sortOption === "name") {
      sortedContributors.sort((a, b) => a.login.localeCompare(b.login)); // Sort by name (ascending)
    }
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
