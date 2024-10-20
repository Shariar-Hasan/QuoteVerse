// Wait for the DOM to be fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Object to store all DOM elements
  const elements = {
    generateQuoteBtn: document.getElementById("generateQuoteBtn"),
    selectedCategoryTag: document.getElementById("selectedCategoryTag"),
    addedByTag: document.getElementById("addedByTag"),
    quoteTextTag: document.getElementById("quoteTextTag"),
    quoteAuthorTag: document.getElementById("quoteAuthorTag"),
    shareBtns: document.getElementById("shareBtns"),
    container: document.querySelector(".container"),
    quoteSection: document.querySelector(".quote"),
    colorSelection: document.querySelectorAll(".select_color"),
    heartIcon: document.querySelector(".heart-icon"),
    colorPicker: document.getElementById("color_picker"),
  };

  // Object to store application state
  const state = {
    colorArray: [
      "rgba(237, 237, 237, 1)",
      "rgb(57 150 255 / 90%)",
      "rgb(154 72 89/ 70%)",
      "rgb(36 183 158 / 90%)",
      "rgb(255 255 145 / 70%)",
    ],
    selectedQuoteText: "",
    selectedQuoteAuthor: "",
    selectedQuoteAddedBy: "",
    selectedCategory: "",
    webAddress: "https://quote-verse.netlify.app/",
    themeColor: "rgba(237, 237, 237, 1)",
  };

  // Function to update theme color and related UI elements
  function updateThemeColor(color) {
    state.themeColor = color;
    elements.container.style.background = color;
    elements.container.style.color = getBrightness(color) < 128 ? "white" : "black";
    setCanvas();
  }

  // Event listener for color picker changes
  elements.colorPicker.addEventListener("input", (event) => {
    updateThemeColor(event.target.value);
  });

  // Event listener for heart icon (like/unlike quote)
  elements.heartIcon.addEventListener('click', function () {
    const quote = elements.quoteTextTag.textContent.trim();
    const quoteInd = window.quotes.findIndex(q => `"${q.quote}"` === quote);
    
    if (quoteInd === -1) return;

    const storageKey = `quote-liked-${quoteInd}`;
    const isLiked = !JSON.parse(localStorage.getItem(storageKey) || "false");

    this.classList.toggle('active', isLiked);
    localStorage.setItem(storageKey, JSON.stringify(isLiked));

    console.log("Heart clicked on quote index:", quoteInd, "Liked:", isLiked);
  });

  // Function to calculate brightness of a color
  function getBrightness(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  // Function to set up category options
  function setCategories() {
    const categories = ["Random", ...new Set(window.quotes.map(quote => quote.category))].sort();
    elements.selectedCategoryTag.innerHTML = categories.map(category => 
      `<option value="${category}" ${category === "Random" ? "selected" : ""}>${category}</option>`
    ).join('');
  }

  // Function to set a new quote
  function setQuote() {
    state.selectedCategory = elements.selectedCategoryTag.value;
    const filteredQuotes = window.quotes.filter(quote => 
      state.selectedCategory === "Random" || quote.category === state.selectedCategory
    );
    const selectedQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

    state.selectedQuoteText = selectedQuote.quote;
    state.selectedQuoteAuthor = selectedQuote.author;
    state.selectedQuoteAddedBy = selectedQuote.addedBy;

    elements.quoteTextTag.textContent = `"${selectedQuote.quote}"`;
    elements.quoteAuthorTag.textContent = `- ${selectedQuote.author}`;
    elements.addedByTag.innerHTML = `Added by <br/> <a href="https://github.com/${selectedQuote.addedBy}" target="_blank" rel="noopener noreferrer" class="added-by capitalise">${selectedQuote.addedBy}</a>`;

    const quoteInd = window.quotes.findIndex(q => q.quote === selectedQuote.quote);
    elements.heartIcon.classList.toggle('active', JSON.parse(localStorage.getItem(`quote-liked-${quoteInd}`) || "false"));

    animateQuoteText();
    setCanvas();
  }

  // Function to wrap text for canvas rendering
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    const lineArray = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = `${line}${words[n]} `;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lineArray.push([line, x, y]);
        line = `${words[n]} `;
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    lineArray.push([line, x, y]);

    return lineArray;
  }

  // Function to set up the canvas for quote image
  function setCanvas() {
    const canvas = document.getElementById("quoteCanvas");
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight - 50 || 540;
    canvas.width = window.innerWidth - 50 || 540;

    ctx.fillStyle = state.themeColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textAlign = "center";
    ctx.font = "35pt garamond";
    ctx.fillStyle = "black";

    const wrappedText = wrapText(ctx, `"${state.selectedQuoteText}"`, canvas.width / 2, 60, canvas.width - 40, 40);
    const centerY = canvas.height / 2 - (wrappedText.length * 40) / 2;

    wrappedText.forEach((item, index) => {
      ctx.fillText(item[0], item[1], centerY + index * 50);
    });

    ctx.font = "15pt calibri";
    ctx.fillText(state.selectedQuoteAuthor, canvas.width / 2, centerY + wrappedText.length * 50);
  }

  // Object containing handlers for different sharing options
  const sharingHandlers = {
    handleTwitterClick: () => {
      const text = encodeURIComponent(`"${state.selectedQuoteText}"\n- ${state.selectedQuoteAuthor}\n\nI found this on ${state.webAddress}\nYou can check this out`);
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    },
    handleWhatsAppClick: () => {
      const text = encodeURIComponent(`"${state.selectedQuoteText}"\n- ${state.selectedQuoteAuthor}\n\nI found this on ${state.webAddress}\nYou can check this out`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    },
    handleFacebookClick: () => {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(state.webAddress)}`, "_blank");
    },
    handleDownloadClick: () => {
      const link = document.createElement("a");
      link.download = `${state.selectedCategory} Quote by ${state.selectedQuoteAuthor}-(quote-verse.netlify.app).png`;
      link.href = document.getElementById("quoteCanvas").toDataURL();
      link.click();
    },
    handleCopyClick: (callback) => {
      const text = `"${state.selectedQuoteText}" - ${state.selectedQuoteAuthor}`;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => callback(true));
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        callback(successful);
      }
    },
  };

  // Function to replace icon class with fade effect
  function replaceIconClass(item, newClass) {
    item.style.opacity = 0;
    setTimeout(() => {
      item.className = `fa ${newClass} icon`;
      item.style.opacity = 1;
    }, 250);
  }

  // Function to display copy message tooltip
  function copyMessageTooltip(copyButtonMessage) {
    const tooltip = document.getElementById("copy_tooltip");
    tooltip.textContent = copyButtonMessage;
    tooltip.classList.add("active");

    setTimeout(() => {
      tooltip.classList.remove("active");
      tooltip.classList.add("inactive");
      const newTooltip = tooltip.cloneNode(true);
      tooltip.parentNode.replaceChild(newTooltip, tooltip);
      setTimeout(() => {
        newTooltip.classList.remove("inactive");
        newTooltip.textContent = "";
      }, 100);
    }, 2000);
  }

  // Event listener for quote section click (copy quote)
  elements.quoteSection.addEventListener("click", () => {
    sharingHandlers.handleCopyClick(() => copyMessageTooltip("Quote Copied"));
  });

  // Array of sharing options with their respective icons and handlers
  const sharingOptions = [
    { title: "Whatsapp", icon: `<i class="fa-brands fa-whatsapp fa-xl" style="color: #00ff33" title="Share to Whatsapp"></i>`, clickHandler: sharingHandlers.handleWhatsAppClick },
    { title: "Facebook", icon: `<i class="fa-brands fa-facebook fa-xl" style="color: #0084ff" title="Share to Facebook"></i>`, clickHandler: sharingHandlers.handleFacebookClick },
    { title: "Twitter", icon: `<i class="fa-brands fa-x-twitter fa-xl" style="color: #5f99fc"  title="Share to Twitter"></i>`, clickHandler: sharingHandlers.handleTwitterClick },
    { title: "Download", icon: `<i class="fas fa-thin fa-download fa-lg" id="download-icon" style="color: #ffffff" title="Download this Quote"></i>`, clickHandler: sharingHandlers.handleDownloadClick },
    { title: "Copy", icon: `<i class="fa-regular fa-copy icon" id="copy-icon"  title="Copy this Quote"></i>`, clickHandler: () =>
      sharingHandlers.handleCopyClick((validation) => {
        const copyIcon = document.getElementById("copy-icon");
        replaceIconClass(copyIcon, validation ? "fa-solid fa-check check-icon fa-xl" : "fa-solid fa-xmark cross-icon fa-xl");
        setTimeout(() => replaceIconClass(copyIcon, "fa-regular fa-copy icon"), 800);
      })
    },
  ];

  // Function to set up sharing buttons
  function setShareButtons() {
    elements.shareBtns.innerHTML = sharingOptions.map(option => 
      `<div>${option.icon}</div>`
    ).join('');
    sharingOptions.forEach((option, index) => {
      elements.shareBtns.children[index].addEventListener("click", option.clickHandler);
    });
  }

  // Event listeners for color selection
  elements.colorSelection.forEach((item, index) => {
    item.addEventListener("click", () => {
      updateThemeColor(state.colorArray[index]);
    });
  });

  // Initialize the application
  setCategories();
  setQuote();
  setShareButtons();
  elements.generateQuoteBtn.addEventListener("click", setQuote);
  elements.selectedCategoryTag.addEventListener("change", setQuote);
});