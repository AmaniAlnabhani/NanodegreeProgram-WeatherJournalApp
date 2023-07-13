/* Empty JS object to act as endpoint for all routes */
projectData = {};

/* Express to run server and routes */
const express = require('express');

/* Start up an instance of app */
const app = express();

/* Dependencies */
const bodyParser = require('body-parser')
/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

/* Initialize the main project folder*/
app.use(express.static('website'));

const port = 3000;


app.post('/projectData', (req, res) => {
  projectData = {
    date: req.body.date,
    temp: req.body.temp,
    content: req.body.content
  };
  console.log(projectData);
  res.status(200).json({
    success: true,
    message: "Data saved successfully",
    data: projectData
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
