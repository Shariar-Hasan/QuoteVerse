// string match
const isIncluded = (string = "", pattern = "") => {
  return string.toLowerCase().includes(pattern.toLowerCase());
};

// for generating random integer
const randomInteger = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

// animation for the quote text
const animateQuoteText = () => {
  const quoteEl = document.querySelectorAll('#quoteTextTag');
  quoteEl.forEach(el => {
    // split the text content of the quote into individual words
    const words = el.textContent.split(' ');
    el.innerHTML = '';
    
    // wrap each word in a <span> element for animation
    words.forEach((el, index) => {
      words[index] = `<span class="animate-text"><i>${words[index]}</i></span>`;
    });
  
    // join the words and update the element's content with the animated HTML
    el.innerHTML = words.join(' ');
  
    // select all the child elements with class 'animate-text' and nested 'i' elements
    const children = document.querySelectorAll('.animate-text > i');
    // add animation delay to each word to create a staggered animation effect
    children.forEach((node, index) => {
      node.style.animationDelay = `${index * .05}s`;
    });
  });
};