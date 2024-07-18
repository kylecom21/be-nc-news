# be-nc-news

- Link to my hosted version - https://be-nc-news-dm0u.onrender.com

- The intention of this project is to mimic the building of a real world backend service (such as Reddit) which should provide information to the front end architecture.

- The minimum versions of Node.js and Postgres needed to run this project are:
    - Node.js: 14.x or higher
    - Postgres:8.2.x or higher

## Setup Instructions

- Once you have the repo url you should navigate where you want to clone the project usind the cd command 

   ``` cd path_to_your_directory ```

Then clone the repo 

    git clone repo_url

Once you are in the repo you need to install dependencies

    npm install

Next you need to connect to the two databases locally a developer will need to create 2 .env files one of them ".env.test" and the other ".env.development".
Within each file you will need to add PGDATABASE= and the correct databse se nc_news_test for test and nc_news for development.

After you need to seed the setup the database and seed it 

    npm run setup-dbs

Then

    npm run seed

To run the test suite you need to enter in the terminal this

    npm run test server
