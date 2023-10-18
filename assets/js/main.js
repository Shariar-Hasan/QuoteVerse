// when dom fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // all the required dom element selected
  const generateQuoteBtn = document.getElementById("generateQuoteBtn");
  const selectedCategoryTag = document.getElementById("selectedCategoryTag");
  const addedByTag = document.getElementById("addedByTag");
  const quoteTextTag = document.getElementById("quoteTextTag");
  const quoteAuthorTag = document.getElementById("quoteAuthorTag");

  // setting categories options
  const setCategories = () => {
    const quotes = window.quotes;

    //   getting all the categories
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    // adding random as first element
    categories.unshift("random");

    //setting options
    const selectedCategoryTag = document.getElementById("selectedCategoryTag");
    categories.forEach((category) => {
      const option = new Option(
        category + " category",
        category,
        isIncluded(category, "random")
      );
      selectedCategoryTag.appendChild(option);
    });
  };

  // setting innerHTML of the selector
  const setValue = (selector, value) => {
    selector.innerHTML = value;
  };

  // set up the selected quote
  const setQuote = () => {
    const selectedCategory = selectedCategoryTag.value;

    // categorically selected quotes
    const quotes = window.quotes
      .sort((a, b) => Math.random() - 0.6)
      .filter(
        (quote) =>
          isIncluded(quote.category, selectedCategory) ||
          isIncluded(selectedCategory, "random")
      );

    // make a random selection from quotes\
    const selectedQuote = quotes[randomInteger(0, quotes.length)];
    setValue(quoteTextTag, `"${selectedQuote.quote}"`);
    setValue(quoteAuthorTag, `- ${selectedQuote.author}`);
    setValue(
      addedByTag,
      `Added by : <a
      href="https://github.com/${selectedQuote.addedBy}"
      target="_blank"
      rel="noopener noreferrer"
      class="added-by capitalise"
    >
    ${selectedQuote.addedBy}</a
    >`
    );
    animateQuoteText();
    addedByTag.classList.remove('animate');

    // Trigger reflow to restart the animation
    void addedByTag.offsetWidth;

    // Add the 'animate' class to apply the animation
    addedByTag.classList.add('animate');

    // console.log({
    //   quotes,
    //   selectedCategory,
    //   rnd: randomInteger(2, 5),
    // });
  };
  // set all funtionalities
  setCategories();
  setQuote();

  // when generate button clicked
  generateQuoteBtn.addEventListener("click", setQuote);
  selectedCategoryTag.addEventListener("change", setQuote);
});


// Copy to clipboard functionality
const copyToClipboardButton = document.querySelector('.copy-to-clipboard');
const copyIcon = document.getElementById('copy-icon');

// Event listener for copy button click
copyToClipboardButton.addEventListener('click', function () {
  // Get quote body and author text
  const quoteBody = document.querySelector('.quote .quote-text').innerHTML;
  const quoteAuthor = document.querySelector('.quote .quote-author').innerHTML;
  const text = quoteBody + quoteAuthor;

  // Copy to clipboard and handle success or failure
  copyToClipboard(text)
    .then((successful) => {
      // Replace icon class based on copy success
      if (successful) {
        replaceIconClass('fa-solid fa-check check-icon');
      } else {
        replaceIconClass('fa-solid fa-xmark cross-icon');
      }

      // Reset to copy icon after 0.5s
      setTimeout(() => {
        replaceIconClass('fa-regular fa-copy icon');
      }, 800);
    })
    .catch((err) => {
      console.error('Clipboard write permission request failed', err);
    });
});

// Function to replace icon class with a fade effect
function replaceIconClass(newClass) {
  copyIcon.style.opacity = 0; // Set initial opacity to 0

  setTimeout(function () {
    copyIcon.className = `fa ${newClass} icon`;
    copyIcon.style.opacity = 1; // Set opacity to 1 after changing the class
  }, 250); // You can adjust the duration of the fade (in milliseconds) here
}

// Async function to copy text to clipboard
async function copyToClipboard(text) {
  // Check if the Clipboard API is supported
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text successfully copied to clipboard');
      return true;
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
      return false;
    }
  } else {
    // Fallback for browsers that do not support Clipboard API
    return new Promise((resolve) => {
      var textArea = document.createElement('textarea');
      textArea.value = text;

      // Make the textarea invisible
      textArea.style.position = 'fixed';
      textArea.style.top = 0;
      textArea.style.left = 0;
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = 0;
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';

      document.body.appendChild(textArea);
      textArea.select();

      try {
        // Execute copy command
        var successful = document.execCommand('copy');
        var msg = successful ? 'Text successfully copied to clipboard' : 'Unable to copy to clipboard';
        console.log(msg);
        resolve(successful);
      } catch (err) {
        console.error('Unable to copy to clipboard', err);
        resolve(false);
      } finally {
        document.body.removeChild(textArea);
      }
    });
  }
}

// Function to display copy message tooltip
function copyMessageTooltip(copyButton, copyButtonMessage) {
  const tooltipVisibleTime = 2000; // How long to leave tooltip visible
  const tooltipHideTime = 100; // Matches .inactive animation time

  // Tooltip
  const tooltip = document.getElementById('copy_tooltip');
  tooltip.textContent = copyButtonMessage;
  tooltip.classList.add('active');
  copyButton.setAttribute('aria-describedby', 'copy_tooltip');

  setTimeout(function () {
    tooltip.classList.remove('active');
    tooltip.classList.add('inactive');

    // Create a clone of the tooltip to restart the animation
    const newTooltip = tooltip.cloneNode(true);
    tooltip.parentNode.replaceChild(newTooltip, tooltip);

    copyButton.removeAttribute('aria-describedby');

    setTimeout(function () {
      newTooltip.classList.remove('inactive');
      newTooltip.textContent = '';
    }, tooltipHideTime);
  }, tooltipVisibleTime);
}

// Event listener for quote section click to copy
const quoteSection = document.querySelector('.quote')

quoteSection.addEventListener('click', async function () {
  // Get quote body and author text
  const quoteBody = document.querySelector('.quote .quote-text').innerHTML;
  const quoteAuthor = document.querySelector('.quote .quote-author').innerHTML;
  const text = quoteBody + quoteAuthor;

  // Copy to clipboard and display tooltip
  await copyToClipboard(text)
    .then((successful) => {
      // Replace icon class based on copy success
      if (successful) {
        copyMessageTooltip(quoteSection, "Quote copied!");
      } else {
        copyMessageTooltip(quoteSection, "Quote copy failed!");
      }
    })
    .catch((err) => {
      console.error('Clipboard write permission request failed', err);
    });
});
