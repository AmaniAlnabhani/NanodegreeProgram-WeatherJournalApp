document.addEventListener('DOMContentLoaded', () => {
  const findButton = document.querySelector('#find');
  findButton.addEventListener('click', handleFindButton);
});

async function handleFindButton() {
  const zipcode = document.getElementById('zip').value;
  const contentpoint = document.getElementById('feeling').value;
  const url = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=c96e9d8d3c7b7e4a1346577c0bddbdad`;

  if (zipcode.length === 0 || contentpoint.length === 0) {
    alert("Please fill in all empty inputs!");
    return;
  }

  try {
    const weatherData = await fetchWeatherData(url);

    if (!weatherData) {
      alert("Failed to fetch weather data. Please try again later.");
      return;
    }

    const { main, weather, name, sys, clouds } = weatherData;

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
    const entryHolder = document.querySelector('.holder');
    entryHolder.style.display = 'block';
  } catch (error) {
    console.log(error);
    alert(" Please try again later.");
  }
}


async function fetchWeatherData(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
}

async function updateUI() {
  const date = document.getElementById('date');
  const temp = document.getElementById('tempe');
  const clouds = document.getElementById('clouds');
  const content = document.getElementById('content');
  const city = document.getElementById('city');
  const country = document.getElementById('country');

  try {
    const data = await getData('http://localhost:3000/projectData');

    date.innerText = data.date;
    temp.innerText = `${data.temp}°C`;

    content.innerText = data.content;
  
  } catch (error) {
    console.log(error);
    alert(" updating the UI. Please try again later.");
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