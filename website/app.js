document.addEventListener('DOMContentLoaded', () => {
  const generateButton = document.querySelector('#generate');
  generateButton.addEventListener('click', handleGenerateButton);
});

async function handleGenerateButton() {
  const zipcode = document.getElementById('zip').value;
  const contentFeeling = document.getElementById('feelings').value;
  const apikey='c96e9d8d3c7b7e4a1346577c0bddbdad';
  const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=c96e9d8d3c7b7e4a1346577c0bddbdad`;

  if (zipcode.length === 0 || contentFeeling.length === 0) {
    alert("Please fill in all empty inputs!");
    return;
  }

  try {
    const weather_Data = await fetchWeatherData(url);

    if (!weather_Data) {
      alert("Failed to fetch weather data. Please try again later.");
      return;
    }
    ///information come from API
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
    const entryHolder = document.querySelector('.entryHolder');
    entryHolder.style.display = 'block';
  } catch (error) {
    console.log(error);
    alert("error Please try again later.");
  }
}

//featch weather data from API
async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}
//function to get current date
function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
}

async function updateUI() {
  const datetime = document.getElementById('date');
  const temperature = document.getElementById('temp');
  const content = document.getElementById('content');

  try {
    const data = await getData('http://localhost:3000/projectData');

    datetime.innerText = data.date;
    temperature.innerText = `${data.temp}°C`;
    content.innerText = data.content;
  
  } catch (error) {
    console.log(error);
    alert("error  while updating the UI.");
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
