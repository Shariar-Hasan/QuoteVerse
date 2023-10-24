// when dom fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // all the required dom element selected
  const generateQuoteBtn = document.getElementById("generateQuoteBtn");
  const selectedCategoryTag = document.getElementById("selectedCategoryTag");
  const addedByTag = document.getElementById("addedByTag");
  const quoteTextTag = document.getElementById("quoteTextTag");
  const quoteAuthorTag = document.getElementById("quoteAuthorTag");
  const shareBtns = document.getElementById("shareBtns");
  const copyToClipboardButton = document.querySelector(".copy-to-clipboard");

  // overall global variable to use in all function
  let selectedQuoteText = "";
  let selectedQuoteAuthor = "";
  let selectedQuoteAddedBy = "";
  let webAddress = "https://quote-verse.netlify.app/";

  // setting categories options
  const setCategories = () => {
    const quotes = window.quotes;

    //   getting all the categories
    const categories = [...new Set(quotes.map((quote) => quote.category))];
    // adding random as first element
    categories.unshift("random");

    // sort categories alphabetically
    categories.sort();

    // move "random" to the beginning
    const randomIndex = categories.indexOf("random");
    if (randomIndex !== -1) {
      categories.splice(randomIndex, 1);
      categories.unshift("random");
    }

    //setting options
    categories.forEach((category) => {
      const option = new Option(
        category,
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
      .sort(() => Math.random() - 0.6)
      .filter(
        (quote) =>
          isIncluded(quote.category, selectedCategory) ||
          isIncluded(selectedCategory, "random")
      );

    // make a random selection from quotes\
    const selectedQuote = quotes[randomInteger(0, quotes.length)];
    // setting global variable
    selectedQuoteText = selectedQuote.quote;
    selectedQuoteAuthor = selectedQuote.author;
    selectedQuoteAddedBy = selectedQuote.addedBy;

    // setting the visual innerhtml values
    setValue(quoteTextTag, `"${selectedQuote.quote}"`);
    setValue(quoteAuthorTag, `- ${selectedQuote.author}`);
    setValue(
      addedByTag,
      `Added by <br/> <a
      href="https://github.com/${selectedQuoteAddedBy}"
      target="_blank"
      rel="noopener noreferrer"
      class="added-by capitalise"
    >
    ${selectedQuoteAddedBy}</a
    >`
    );

    // animation section
    animateQuoteText();

    // set canvas to generate image to download
    setCanvas();
  };

// function to wrap text; reference: https://fjolt.com/article/html-canvas-how-to-wrap-text
const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';
    let testLine = ''; 
    let lineArray = [];

    for(var n = 0; n < words.length; n++) {
        testLine += `${words[n]} `;
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;
    
        if (testWidth > maxWidth && n > 0) {
            lineArray.push([line, x, y]);
            y += lineHeight;
            line = `${words[n]} `;
            testLine = `${words[n]} `;
        }
        else {
            line += `${words[n]} `;
        }
  
        if(n === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
  
    return lineArray;
}

  // draw the quote as an image on the canvas
  const setCanvas = () => {
    var canvas = document.getElementById("quoteCanvas");
    canvas.height = 540;
    canvas.width = 540;
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var ctx = canvas.getContext("2d");

    // add background color
    const grd = ctx.createLinearGradient(0, 0, 500, 0);
    grd.addColorStop(0, "#e9fcc7");
    grd.addColorStop(1, "#d1fc83");
    // Fill background with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add wrapped text to canvas
    ctx.textAlign = "center";
    ctx.font = "35pt garamond";
    ctx.fillStyle = "black";
    let wrappedText = wrapText(ctx, '\"' + selectedQuoteText + '\"', x, 60, x*2 - 40, 40);
    var len = wrappedText.length;
    var centeringY = y - (len * 40) / 2;
    wrappedText.forEach(function(item) {
        ctx.fillText(item[0], item[1], centeringY);
        centeringY += 50; 
    })
    ctx.font = "25pt calibri";
    ctx.fillText(selectedQuoteAuthor, wrappedText[len-1][1], centeringY);
  }

  // button click handling section
  const handleTwitterClick = () => {
    let text =
      '"' +
      selectedQuoteText +
      '"%0D%0A- ' +
      selectedQuoteAuthor +
      ",%0D%0A%0D%0AI found this on " +
      webAddress +
      ",%0D%0AYou can check this out";
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };
  const handleWhatsAppClick = () => {
    let text =
      '"' +
      selectedQuoteText +
      '"%0D%0A- ' +
      selectedQuoteAuthor +
      ",%0D%0A%0D%0AI found this on " +
      webAddress +
      ",%0D%0AYou can check this out";
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };
  const handleFacebookClick = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fquote-verse.netlify.app%2F`,
      "_blank"
    );
  };
  const handleDownloadClick = () => {
    var link = document.createElement('a');
    link.download = 'quote-verse.png';
    link.href = document.getElementById('quoteCanvas').toDataURL();
    link.click();
  };
  const copyHandler = (func) => {
    // Get quote and author as text
    const text = `"${selectedQuoteText}" - ${selectedQuoteAuthor}`;
    // Copy to clipboard and handle success or failure
    // Check if the Clipboard API is supported
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      func(true);
      return true;
    } else {
      // Fallback for browsers that do not support Clipboard API
      var textArea = document.createElement("textarea");
      document.body.appendChild(textArea);
      textArea.value = text;
      textArea.select();
      var successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      func(successful);
      return successful;
    }
  };

  // set up the selected quote
  // set all funtionalities
  setCategories();
  setQuote();
  // when generate button clicked
  generateQuoteBtn.addEventListener("click", setQuote);
  selectedCategoryTag.addEventListener("change", setQuote);

  // Function to replace icon class with a fade effect
  function replaceIconClass(item, newClass) {
    item.style.opacity = 0; // Set initial opacity to 0
    console.log(item);
    setTimeout(function () {
      item.className = `fa ${newClass} icon`;
      item.style.opacity = 1; // Set opacity to 1 after changing the class
    }, 250); // You can adjust the duration of the fade (in milliseconds) here
  }

  // // Async function to copy text to clipboard
  // function copyToClipboard(text) {
  //   // Check if the Clipboard API is supported
  //   if (navigator.clipboard && window.isSecureContext) {
  //     navigator.clipboard.writeText(text);
  //     return true;
  //   } else {
  //     // Fallback for browsers that do not support Clipboard API
  //     var textArea = document.createElement("textarea");
  //     document.body.appendChild(textArea);
  //     textArea.value = text;
  //     textArea.select();
  //     var successful = document.execCommand("copy");
  //     document.body.removeChild(textArea);
  //     return successful;
  //   }
  // }

  // Function to display copy message tooltip
  function copyMessageTooltip(copyButtonMessage) {
    const tooltipVisibleTime = 2000; // How long to leave tooltip visible
    const tooltipHideTime = 100; // Matches .inactive animation time

    // Tooltip
    const tooltip = document.getElementById("copy_tooltip");
    tooltip.textContent = copyButtonMessage;
    tooltip.classList.add("active");

    setTimeout(function () {
      tooltip.classList.remove("active");
      tooltip.classList.add("inactive");
      // Create a clone of the tooltip to restart the animation
      const newTooltip = tooltip.cloneNode(true);
      tooltip.parentNode.replaceChild(newTooltip, tooltip);
      setTimeout(function () {
        newTooltip.classList.remove("inactive");
        newTooltip.textContent = "";
      }, tooltipHideTime);
    }, tooltipVisibleTime);
  }

  // Event listener for quote section click to copy
  const quoteSection = document.querySelector(".quote");
  quoteSection.addEventListener("click", async function () {
    // Get quote body and author text
    const text = `${selectedQuoteText} - ${selectedQuoteAuthor}`;
    // Copy to clipboard and display tooltip
    copyHandler(() => copyMessageTooltip("Quote Copied"));
  });

  // added sharing options
  let sharingOptions = [
    {
      title: "Whatsapp",
      icon: `<i class="fa-brands fa-whatsapp fa-xl" style="color: #00ff33" title="Share to Whatsapp"></i>`,
      clickhandler: handleWhatsAppClick,
    },
    {
      title: "Facebook",
      icon: `<i class="fa-brands fa-facebook fa-xl" style="color: #0084ff" title="Share to Facebook"></i>`,
      clickhandler: handleFacebookClick,
    },
    {
      title: "Twitter",
      icon: `<i class="fa-brands fa-x-twitter fa-xl" style="color: #5f99fc"  title="Share to Twitter"></i>`,
      clickhandler: handleTwitterClick,
    },
    {
      title: "Download",
      icon: `<i class="fas fa-thin fa-download fa-lg" id="download-icon" style="color: #ffffff" title="Download this Quote"></i>`,
      clickhandler: handleDownloadClick,
    },
    {
      title: "Copy",
      icon: `<i class="fa-regular fa-copy icon" id="copy-icon"  title="Copy this Quote"></i>`,
      clickhandler: () =>
        copyHandler((validation) => {
          const copyIcon = document.getElementById("copy-icon");
          replaceIconClass(
            copyIcon,
            validation
              ? "fa-solid fa-check check-icon fa-xl"
              : "fa-solid fa-xmark cross-icon fa-xl"
          );
          // Reset to copy icon after 0.5s
          setTimeout(() => {
            replaceIconClass(copyIcon, "fa-regular fa-copy icon");
          }, 800);
        }),
    },
  ];
  // self calling function 
  (function setShareButtons() {
    shareBtns.innerHTML = "";
    sharingOptions.forEach((option) => {
      const div = document.createElement("div");
      div.innerHTML = option.icon;
      div.addEventListener("click", option.clickhandler);
      shareBtns.appendChild(div);
    });
  })();
});
