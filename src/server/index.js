require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls

// example API call
app.get('/apod', async (req, res) => {
    const date = new Date();
    const nowDate = new Date(date.toLocaleDateString()).toISOString().split("T")[0];
    console.log("DATE", nowDate);
    try {
        let image = await fetch(`${process.env["MARS_API_URL"]}/planetary/apod?date=${nowDate}&api_key=${process.env["MARS_API_KEY"]}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
});

//endpoint to get rover photos
app.post("/rovers/rover/:name", async(req, res) => {
    const { date } = req.body;
    try {
        let roverData = await fetch(`${process.env["MARS_API_URL"]}/mars-photos/api/v1/rovers/${req.params.name}/photos?earth_date=${date}&api_key=${process.env["MARS_API_KEY"]}`)
            .then(res => res.json()).catch(e => console.log(e));
        res.send({roverData})
    } catch (err) {
        console.log('error:', err);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))