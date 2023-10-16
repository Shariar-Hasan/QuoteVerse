### Add Quote:

Contributions are welcome and encouraged! If you want to add Quote to the QuoteVerse, first of all ⭐`Star the repository` then follow these steps:

1. Fork the repository and clone it to your local machine.

   ```sh
   git clone https://github.com/<your-username>/QuoteVerse.git
   cd QuoteVerse
   ```

2. Open `Quote.js` and add a new Object in the array, for example :

   ```javascript
   {
      quote: "your-quote-text",
      category: "quote-category",
      author: "author-of-the-quote",
      addedBy: "your-guthub-username"
   }
   ```

3. Now save the file and make a commit.

   ```sh
   git commit -m "Added new quote"
   ```

4. Push your changes to your forked repository.

   ```sh
   git push origin main
   ```

5. Open a pull request on the original repository.

6. Wait until your PR get merged.

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

  Add a Quote for website, fix bug or add new feature. You can see [here](#what-can-you-do) to get acknoledged about what can you do.

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

- Each logos must be in their corresponding folder
- In case you want to add a logo which is already in our list, then you have to provide a better resolution for the logo and also give a short description why your logo is better (You can give a one line comparison).
- In case you want to add a logo which is not in our list, then you have to add all the size in the folder structure mentions [in here](./README.md#logos). And you have to update the readme file, according to your logo change.
- In case you want to add any new size, you have to do it for all the other logos available in this project. Then you have to crete logo for each, make folder for each, update the readme file as you added new logo.
- For pull request add `feat:` in prefix of your PR title for adding logo. for example:
  ```
  feat: adding logo of <your-logo-brand-name> of <size | sizes> square pixels
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
