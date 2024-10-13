Prerequisites
Make sure you have the following installed:

Node.js (version 16 or above)

MySQL (or any SQL database supported by Sequelize)

In My Sql Run-- CREATE DATABASE forex;

Open your terminal and run:
git clone https://github.com/Gautam1998gk/forexrate.git

cd <repository_folder>

npm install

Folder-- models/forex.js:
const sequelize = new Sequelize('forex',  "your_mysql_username", "your_mysql_password", {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
});

Change your DB credentials in sequalize. npm run dev


file--- Server.js:
scheduleJob('* 6 * * *', async () => {
  await scrapeForexRates();
  console.log('Forex rate data saved successfully.');
});

first star(*) define the which minute to scrape the data and second Star(*) define the hour

it srapes every 6am in morning

For testing keep the minute to next minute of your time.


In forexController.js You can find the funtions for adding pair, average,end rate.

PostMan Run the below Commands:

Adding New currency Pair:
Method : POST
URL : http://localhost:4500/api/add-pair
body: {"currencyPair":"USD/INR"}   ///add how many currency pairs that you want

Note: Run the server. It scrapes the rate related to available currencypair table and which time.

Getting Avg currency Pair:
Method : POST
URL : http://localhost:4500/api/average-rate
body: { "currencyPair":"USD/EUR", "startDate":"2024-10-11", "endDate":"2024-10-12" }

Note: Keep the currency pair that is available in DB. For startDate and endDate keep the yesterday date for testing it will only available yesterday date scraped data.

Getting closing currency Pair:
Method : POST
URL : http://localhost:4500/api/closing-rate
body: {"currencyPair":"GBP/USD", "date":"2024-10-11"}