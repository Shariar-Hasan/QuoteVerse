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
  const container = document.querySelector(".container");
  const quoteSection = document.querySelector(".quote");
  const color_selection = document.querySelectorAll(".select_color");
  const heartIcon = document.querySelector(".heart-icon");

  // overall global variable to use in all function

  var color_array = [
    "rgba(237, 237, 237, 1)",
    "rgb(57 150 255 / 90%)",
    "rgb(154 72 89/ 70%)",
    "rgb(36 183 158 / 90%)",
    "rgb(255 255 145 / 70%)",
  ];
  let selectedQuoteText = "";
  let selectedQuoteAuthor = "";
  let selectedQuoteAddedBy = "";
  let selectedCategory = "";
  let webAddress = "https://quote-verse.netlify.app/";
  let themeColor = color_array[0];

  let currentQuoteIndex = -1; // Variable to store the index of the currently selected quote
  // categorically selected quotes
  var quotes = window.quotes
  .sort(() => Math.random() - 0.6)
  .filter(
    (quote) =>
      isIncluded(quote.category, selectedCategory) ||
      isIncluded(selectedCategory, "Random")
  );

  // update the themeColor when the color picker changes
document.getElementById("color_picker").addEventListener("input", (event) => {
  themeColor = event.target.value;
  container.style.background = themeColor;

  const brightness = getBrightness(themeColor);
  if (brightness < 128) {
    container.style.color = "white";
  } else {
    container.style.color = "black";
  }
  setCanvas();
});

heartIcon.addEventListener('click', function () {
  let quote = quoteTextTag.textContent.trim(); 
  console.log(quote);
  console.log("##############################");
  let quoteInd = -1;

  for (let i = 0; i < window.quotes.length; i++) {
    if ('"' + window.quotes[i].quote + '"' === quote) {  
      quoteInd = i;
      break;
    }
  }

  let isLiked = JSON.parse(localStorage.getItem(`quote-liked-${quoteInd}`)) || false;

  isLiked = !isLiked;

  if (isLiked) {
    this.classList.add('active'); 
    localStorage.setItem(`quote-liked-${quoteInd}`, JSON.stringify(true));
  } else {
    this.classList.remove('active'); 
    localStorage.removeItem(`quote-liked-${quoteInd}`);
  }

  console.log("Heart clicked on quote index: ", quoteInd, "Liked:", isLiked);
});



//calculating the brightness of the color picked
function getBrightness(hexColor) {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}


  // setting categories options
  const setCategories = () => {
    const quotes = window.quotes;

    //   getting all the categories
    const categories = [...new Set(quotes.map((quote) => quote.category))];


    // sort categories alphabetically
    categories.sort();
    categories.unshift("Random");

    //setting options
    categories.forEach((category) => {
      const option = new Option(
        category,
        category,
        isIncluded(category, "Random")
      );
      selectedCategoryTag.appendChild(option);
    });
  };

  // setting innerHTML of the selector
  const setValue = (selector, value) => {
    selector.innerHTML = value;
  };

  // set up the selected quote
  const setQuote = (isLanguageChange = false, isCategoryChange = false) => {
    const selectedLanguage = document.getElementById("languageSwitcher").value;
    console.log("selectedLanguage",selectedLanguage);
    console.log(currentQuoteIndex);
    console.log(isLanguageChange);

    selectedCategory = selectedCategoryTag.value;
    console.log(quotes);
    

    
    

    // If the language is changed, keep the current quote but find the translation
    if (isLanguageChange && currentQuoteIndex !== -1) {
      // Use the same quote's index to find the translation
      var selectedQuote = quotes[currentQuoteIndex];
    }else {
      // categorically selected quotes
      quotes = window.quotes
      .sort(() => Math.random() - 0.6)
      .filter(
        (quote) =>
          isIncluded(quote.category, selectedCategory) ||
          isIncluded(selectedCategory, "Random")
      );
      // Pick a new random quote if it's not a language change
      selectedQuote = quotes[randomInteger(0, quotes.length)];
      currentQuoteIndex = quotes.indexOf(selectedQuote); // Store the index of the selected quote
      
      
    }

    console.log("quote",selectedQuote);

    // setting global variable
    if ("translations" in selectedQuote){
      selectedQuoteText = selectedQuote.translations[selectedLanguage] || selectedQuote.quote;
    }else{
      selectedQuoteText = selectedQuote.quote;
    }
    
    selectedQuoteAuthor = selectedQuote.author;
    selectedQuoteAddedBy = selectedQuote.addedBy;


    let quote = quoteTextTag.textContent.trim(); 
    let quoteInd = -1;
    for (let i = 0; i < window.quotes.length; i++) {
      if ('"' + window.quotes[i].quote + '"' === quote) {  
        quoteInd = i;
        break;
      }
    }

    if (localStorage.getItem(`quote-liked-${quoteInd}`)){
      console.log("already liked : quote ind - ", quoteInd);
      heartIcon.classList.add('active');
    }else{
      console.log("not liked");
      heartIcon.classList.remove('active');
    }

    // setting the visual innerhtml values
    setValue(quoteTextTag, `"${selectedQuoteText}"`);
    setValue(quoteAuthorTag, `- ${selectedQuoteAuthor}`);
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
  const wrapText = function (ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split(" ");
    let line = "";
    let testLine = "";
    let lineArray = [];

    for (var n = 0; n < words.length; n++) {
      testLine += `${words[n]} `;
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        lineArray.push([line, x, y]);
        y += lineHeight;
        line = `${words[n]} `;
        testLine = `${words[n]} `;
      } else {
        line += `${words[n]} `;
      }

      if (n === words.length - 1) {
        lineArray.push([line, x, y]);
      }
    }

    return lineArray;
  };

  // draw the quote as an image on the canvas
  const setCanvas = () => {
    var canvas = document.getElementById("quoteCanvas");
    canvas.height = window.innerHeight - 50 || 540;
    canvas.width = window.innerWidth - 50 || 540;

    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var ctx = canvas.getContext("2d");

    // add background color
    const grd = ctx.createLinearGradient(0, 0, 500, 0);
    grd.addColorStop(0, themeColor);
    grd.addColorStop(1, themeColor);
    // Fill background with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // add wrapped text to canvas
    ctx.textAlign = "center";
    ctx.font = "35pt garamond";
    ctx.fillStyle = "black";
    let wrappedText = wrapText(
      ctx,
      '"' + selectedQuoteText + '"',
      x,
      60,
      x * 2 - 40,
      40
    );
    var len = wrappedText.length;
    var centeringY = y - (len * 40) / 2;
    wrappedText.forEach(function (item) {
      ctx.fillText(item[0], item[1], centeringY);
      centeringY += 50;
    });
    ctx.font = "15pt calibri";
    ctx.fillText(selectedQuoteAuthor, wrappedText[len - 1][1], centeringY);
  };

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
    var link = document.createElement("a");
    link.download =
      selectedCategory +
      " Quote by " +
      selectedQuoteAuthor +
      "-(quote-verse.netlify.app).png";
    link.href = document.getElementById("quoteCanvas").toDataURL();
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
 // making event listener for language change
  document.getElementById('languageSwitcher').addEventListener('change', function (){
    setQuote(true);
  });
  // when generate button clicked
  generateQuoteBtn.addEventListener("click", function(){
    setQuote();
  });
  selectedCategoryTag.addEventListener("change", function(){
    setQuote(false,true);
  });

  // Function to replace icon class with a fade effect
  function replaceIconClass(item, newClass) {
    item.style.opacity = 0; // Set initial opacity to 0
    console.log(item);
    setTimeout(function () {
      item.className = `fa ${newClass} icon`;
      item.style.opacity = 1; // Set opacity to 1 after changing the class
    }, 250); // You can adjust the duration of the fade (in milliseconds) here
  }

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

  
  color_selection.forEach((item) => {
    item.addEventListener("click", () => {
      var getItemNumber = item.getAttribute("data-number");
      themeColor = color_array[getItemNumber - 1];
      container.style.background = themeColor;
      setCanvas();
    });
  });
});



