const isIncluded = (string = "", pattern = "") => {
  return string.toLowerCase().includes(pattern.toLowerCase());
};
const randomInteger = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
