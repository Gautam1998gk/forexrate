const express =require("express")
const cors =require("cors")
const scrapeForexRates = require("./helpers/dbFunctions")
const { scheduleJob } = require("node-schedule")
const { sequelize } = require("./models/forex")
const app = express()
const PORT = 4500

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//scraping task at 6 AM every day
scheduleJob('0 * * * *', async () => {
  await scrapeForexRates();
  console.log('Forex rate data saved successfully.');
});

app.use("/api",require("./controllers/forexController"))

app.get('/', (req, res) => {
    res.send('hello world')
  })



sequelize.sync()
    .then(() => {
      console.log('Database synced successfully');
    })
    .catch((err) => {
      console.error('Error syncing database:', err);
    });
  

app.listen(PORT,()=>{
   console.log(`server running on ${PORT} port`);
   
})