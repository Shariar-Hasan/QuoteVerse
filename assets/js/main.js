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
    console.log({
      quotes,
      selectedCategory,
      rnd: randomInteger(2, 5),
    });
  };
  // set all funtionalities
  setCategories();
  setQuote();

  // when generate button clicked
  generateQuoteBtn.addEventListener("click", setQuote);
  selectedCategoryTag.addEventListener("change", setQuote);
});
