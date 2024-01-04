# CaseAce Backend

This is backend of CaseAce, a management system for Law Firm. We built this using NodeJS and ExpressJS.

# Get Started

1. Install NodeJS in your machine
2. Git pull or clone this repo
3. Run `npm i` to install packages
4. Get the `.env` and `config files`
5. Run `npm start` to start the server

## Notes when developing FE

### How to start develop FE

1. Get the `.env` file
2. Create a file `/env` in this project folder
3. Run `npm i` to install packages
4. Run `npm start` to start server

### Steps to develop a new feature

1. Checkout to main branch:`git checkout main`
2. Checkout to new branch according to naming convention: `git chekcout -b  <branchname: username/featureName`, for example: `git checkout -b weiqi/login`
3. Write some code
4. Check modified files: `git status`
5. Add neccessary files to push: `git add .` (to add all modified files) or `git add <files separated by space>` (to add selected files: `git add "login.css" "login.html" "code/invalid.html"`)
6. Commit the changes: `git commit -m <commit message>`. Commit message starts with a verb: `git commit -m "Add Login page and Css"`
7. Push to GitHub: `git push -u origin <branch name>`
8. Make a pull request in GitHub. (Note: only do this once each branch/feature)
