document.addEventListener("DOMContentLoaded", () => {
  // Element selection
  const generateQuoteBtn = document.getElementById("generateQuoteBtn");
  const selectedCategoryTag = document.getElementById("selectedCategoryTag");
  const addedByTag = document.getElementById("addedByTag");
  const quoteTextTag = document.getElementById("quoteTextTag");
  const quoteAuthorTag = document.getElementById("quoteAuthorTag");
  const shareBtns = document.getElementById("shareBtns");
  const copyToClipboardButton = document.querySelector(".copy-to-clipboard");
  const container = document.querySelector(".container");
  const quoteSection = document.querySelector(".quote");
  const colorPicker = document.getElementById("color_picker");
  const heartIcon = document.querySelector(".heart-icon");

  // Global variables
  const colorArray = [
    "rgba(237, 237, 237, 1)",
    "rgb(57 150 255 / 90%)",
    "rgb(154 72 89 / 70%)",
    "rgb(36 183 158 / 90%)",
    "rgb(255 255 145 / 70%)",
  ];
  let selectedQuote = {
    text: "",
    author: "",
    addedBy: "",
    category: "",
  };
  let webAddress = "https://quote-verse.netlify.app/";
  let themeColor = colorArray[0];

  // Theme color update
  colorPicker.addEventListener("input", (event) => {
    themeColor = event.target.value;
    updateThemeColor(themeColor);
    setCanvas();
  });

  // Function to update the theme color
  const updateThemeColor = (color) => {
    container.style.background = color;
    const brightness = getBrightness(color);
    container.style.color = brightness < 128 ? "white" : "black";
  };

  // Heart icon event listener
  heartIcon.addEventListener("click", () => {
    let quoteIndex = getQuoteIndex(quoteTextTag.textContent.trim());
    toggleLikeQuote(quoteIndex);
  });

  // Helper function to get the brightness of a color
  const getBrightness = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  };

  // Initialize categories
  const setCategories = () => {
    const categories = Array.from(new Set(window.quotes.map((q) => q.category))).sort();
    categories.unshift("Random");

    categories.forEach((category) => {
      const option = new Option(category, category, category === "Random");
      selectedCategoryTag.appendChild(option);
    });
  };

  // Function to set the value of a selector
  const setValue = (selector, value) => {
    selector.innerHTML = value;
  };

  // Set up the selected quote
  const setQuote = () => {
    selectedQuote.category = selectedCategoryTag.value;
    const filteredQuotes = window.quotes.filter(
      (quote) =>
        quote.category === selectedQuote.category ||
        selectedQuote.category === "Random"
    );
    const randomQuote = filteredQuotes[randomInteger(0, filteredQuotes.length)];

    // Update selected quote variables
    selectedQuote.text = randomQuote.quote;
    selectedQuote.author = randomQuote.author;
    selectedQuote.addedBy = randomQuote.addedBy;

    let quoteIndex = getQuoteIndex(quoteTextTag.textContent.trim());
    updateHeartIcon(quoteIndex);

    // Update the HTML with new quote information
    setValue(quoteTextTag, `"${selectedQuote.text}"`);
    setValue(quoteAuthorTag, `- ${selectedQuote.author}`);
    setValue(
      addedByTag,
      `Added by <a href="https://github.com/${selectedQuote.addedBy}" target="_blank" class="added-by">${selectedQuote.addedBy}</a>`
    );

    animateQuoteText();
    setCanvas();
  };

  // Function to find the index of the current quote
  const getQuoteIndex = (quote) => {
    for (let i = 0; i < window.quotes.length; i++) {
      if ('"' + window.quotes[i].quote + '"' === quote) {
        return i;
      }
    }
    return -1;
  };

  // Function to handle like (heart icon) toggle
  const toggleLikeQuote = (quoteIndex) => {
    let isLiked = JSON.parse(localStorage.getItem(`quote-liked-${quoteIndex}`)) || false;
    isLiked = !isLiked;

    if (isLiked) {
      heartIcon.classList.add("active");
      localStorage.setItem(`quote-liked-${quoteIndex}`, JSON.stringify(true));
    } else {
      heartIcon.classList.remove("active");
      localStorage.removeItem(`quote-liked-${quoteIndex}`);
    }
  };

  // Update the heart icon based on whether the quote is liked
  const updateHeartIcon = (quoteIndex) => {
    if (localStorage.getItem(`quote-liked-${quoteIndex}`)) {
      heartIcon.classList.add("active");
    } else {
      heartIcon.classList.remove("active");
    }
  };

  // Function to wrap text on canvas
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let testLine = "";
    let lineArray = [];

    words.forEach((word, n) => {
      testLine += word + " ";
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && n > 0) {
        lineArray.push([line, x, y]);
        y += lineHeight;
        line = word + " ";
        testLine = word + " ";
      } else {
        line += word + " ";
      }

      if (n === words.length - 1) {
        lineArray.push([line, x, y]);
      }
    });

    return lineArray;
  };

  // Draw the quote on canvas
  const setCanvas = () => {
    const canvas = document.getElementById("quoteCanvas");
    const ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight - 50 || 540;
    canvas.width = window.innerWidth - 50 || 540;

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Background color
    ctx.fillStyle = themeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quote text
    ctx.textAlign = "center";
    ctx.font = "35pt Garamond";
    ctx.fillStyle = "black";
    const wrappedText = wrapText(ctx, `"${selectedQuote.text}"`, x, 60, x * 2 - 40, 40);

    let centeringY = y - (wrappedText.length * 40) / 2;
    wrappedText.forEach(([line, lineX, lineY]) => {
      ctx.fillText(line, lineX, centeringY);
      centeringY += 50;
    });

    // Author text
    ctx.font = "15pt Calibri";
    ctx.fillText(selectedQuote.author, x, centeringY);
  };

  // Event handlers for sharing options
  const handleShareClick = (handler) => handler();

  // Copy-to-clipboard functionality
  const copyQuoteToClipboard = () => {
    const text = `"${selectedQuote.text}" - ${selectedQuote.author}`;
    navigator.clipboard.writeText(text).then(
      () => showTooltip("Quote Copied"),
      () => showTooltip("Copy Failed")
    );
  };

  // Tooltip display
  const showTooltip = (message) => {
    const tooltip = document.getElementById("copy_tooltip");
    tooltip.textContent = message;
    tooltip.classList.add("active");

    setTimeout(() => {
      tooltip.classList.remove("active");
      tooltip.textContent = "";
    }, 2000);
  };

  // Event listener setup
  quoteSection.addEventListener("click", copyQuoteToClipboard);
  generateQuoteBtn.addEventListener("click", setQuote);
  selectedCategoryTag.addEventListener("change", setQuote);

  // Initial setup
  setCategories();
  setQuote();
});
