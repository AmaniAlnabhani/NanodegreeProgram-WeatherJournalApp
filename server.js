// Setup empty JS object to act as endpoint for all routes
projectData = {};
// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();
/* Dependencies */
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
const bodyParser = require('body-parser')
// Cors for cross origin allowance
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
app.use(express.static('website'));

const port = 3000;

// Route
app.get('/projectData', (req, res)=>{
  res.status(200).send(projectData);
});

// POST route
app.post('/projectData', (req,res)=>
{
  projectData = {
   date : req.body.date,
   temp : req.body.temp,
   content : req.body.content
  };



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


