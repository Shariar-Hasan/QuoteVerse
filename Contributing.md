# Contribution Guideline

Contributions are welcome and encouraged! If you want to add Quote to the QuoteVerse or Add any features or fix any bug.

### Make sure to follow the instruction below:

- **Star the repository (`mandatory`),**
- **Fork this repository.**
  - Click on the fork button on the repository
- **Clone the repostory:**

  Go to your forked repositry, Click on the code button and copy your repositroy's `(.git)` link.

  clone the repository like this.


   ```sh
   git clone https://github.com/<your-username>/QuoteVerse.git
   cd QuoteVerse
   ```

- **Add your changes:**

  Add a Quote for website, fix bug or add new feature. You can see [here](#what-can-you-do) to get acknowledged about what can you do.

- **Check the changed files**

  ```sh
  git status
  ```

- **If all good, then Commit Your Changes**

  ```sh
  git add .
  git commit -m "<EXPLAIN-YOUR_CHANGES>"
  ```

- **Push to Your Forked Repository**

  ```sh
  git push
  ```

- **Create a Pull Request**

  Go to your forked repository on GitHub, and you should see a "Compare & pull request" button. Click on it to create a pull request (PR).

  Create a pull request with a clear description of your changes.

  For pull request add `feat:` in prefix of your PR title for adding features or adding quote and add `fix:` in prefix of your PR title for fixing any bugs. for example:

  ```
  fix: <your-bug-fixing-title>
  ```

  Your contribution will be reviewed, and upon approval, it will be merged into the main repository.

  Wait for the maintainer to review your PR.

## What can you do

There can be many things you can do.

- You can add new quote. For this, you have to maintain [Quote Rules](#rules-for-adding-quotes) and follow the criteria

- You can add any feature in this project. [follow this to know](#rules-for-adding-features).

- You can fix bug in this project. [follow this to know](#rules-for-fixing-bugs).

## Rules for adding Quotes

- The Quotes must be added in Quote.js file.
- You must maintain sequence.
- Make sure to follow the below example.
   ```javascript
   {
      quote: "your-quote-text",
      category: "quote-category",
      author: "author-of-the-quote",
      addedBy: "your-guthub-username"
   }
   ```
- No need to add quote in JSON format.
- In case you want to add a quote which is already in our list, then you can not add it.
- You must add minimum of 5 Quotes to get your PR considered for merge
- Be carefull about long quote. Quote length must not exceed 30 words.
- You must add valid Quote. you can not add a made up quote, we will manually review your added quotes. You can copy paste any quote from the internet, in your own concern.
- While adding Quotes in pull request, add `feat:` in prefix of your PR title. 
   
   For example:
   ```sh
   feat: adding quotes of inspirational category
   ```

## Rules for adding features

- In this case you have to create an issue first decribing you feature
- You have to get assigned for the issue and then you can work on it.
- A suggestion template will be provided to you while creating the issue.
- For creating an issue for feature, you have to put `[FEATURE]: ` in prefix of your title of the issue. for example:

  ```
  [FEATURE]: <your-issue-title>
  ```

- If you are not assigned, you are not eligible for making a PR. Which means, your PR will not get merged.

## Rules for fixing bugs

- In this case you have to create an issue first decribing you which bug you want to fix
- you have to give a screenshot about the bug.
- You have to get assigned for the issue and then you can work on it.
- A suggestion template will be provided to you while creating the issue.
- For creating an issue for feature, you have to put `[BUG]: ` in prefix of your title of the issue. for example:

  ```
  [BUG]: <your-issue-title>
  ```

- If you are not assigned, you are not eligible for making a PR. Which means, your PR will not get merged.

### 🔴 Notice:

Please make sure that you have read the whole contribution guide to contribute.
