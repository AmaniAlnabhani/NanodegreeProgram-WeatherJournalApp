document.addEventListener('DOMContentLoaded', () => {
    //take generate button id
    const generateButton = document.querySelector('#generate');
    generateButton.addEventListener('click', generateButtonHandel);});
  
  async function generateButtonHandel() {
    // take zipcode and point value
    const zipCode = document.getElementById('zipcode').value;
    const contentpoint = document.getElementById('point').value;
    // create url
    const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode}&appid=100c669e1f70478e3704350b7dd901b2`;
  
    //check if user enter zip code or point (validation)
    if (zipCode.length === 0 || contentpoint.length === 0) {
      alert("please fill empty field");
      return;
    }
      // try and chatch
    try {
      const weather_Data = await fetchWeatherData(url);
      if (!weather_Data) {
        alert("failed to fetch weather data");
        return;
      }
  
      const { main, weather, name, sys, clouds } = weather_Data;
  
      if (!main || !weather || weather.length === 0 || !name || !sys || !sys.country) {
        alert("Weather data is incomplete. Please try again later.");
        return;
      }
  
      const { temp } = main;
      const { description } = weather[0];
      const date = getCurrentDate();
      const country = sys.country;
      const cloudCoverage = clouds && clouds.all !== undefined ? clouds.all : 'N/A';
      const data = {
        date,
        temp: convertToCelsius(temp),
        description,
        country,
        name,
        clouds: cloudCoverage,
        content: contentpoint,
      };
  
      await postData('http://localhost:3000/projectData', data);
      updateUI();
      
      // Display the entry-holder section
      const entryHolder = document.querySelector('.entry-holder');
      entryHolder.style.display = 'block';
    } catch (error) {
      console.log(error);
      alert("an error, Please try again");
    }
  }
  
  // featch wather data function
  async function fetchWeatherData(url) {
    try {
      const Response = await fetch(url);
      return await Response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
 //get current date
  function getCurrentDate() {
    let d = new Date();
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  }
  /// update UI function
  async function updateUI() {
    const datetime = document.getElementById('datetime');
    const temperature = document.getElementById('temperature');
    const clouds = document.getElementById('clouds');
    const content = document.getElementById('content');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
  
    try {
      const data = await getData('http://localhost:8000/projectData');
  
      datetime.innerText = data.date;
      temperature.innerText = `${data.temp}°C`;
      content.innerText = data.content;
     
    } catch (error) {
      console.log(error);
      alert("Error Please try again later.");
    }
  }
  
  function convertToCelsius(temp) {
    return Math.round(temp - 273.15);
  }
  
  async function postData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  
  async function getData(url) {
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }


