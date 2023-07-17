document.addEventListener('DOMContentLoaded', () => {
  const findButton = document.querySelector('#go');
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
    const entryHolder = document.querySelector('.holderCard');
    entryHolder.style.display = 'block';
  } catch (error) {
    console.log(error);
    alert("An error occurred. Please try again later.");
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

const updateUI = async ()=>{
  const requset =await fetch('http://localhost:3000/projectData')
  try{
    const allData = await requset.json()
    console.log(allData);
    document.getElementById('datetime').innerHTML = allData[0].date;
    document.getElementById('temperature').innerHTML = allData[0].temp;
    document.getElementById('content').innerHTML = allData[0].content;


  }catch(error){
    console.log("error", error);
  }

}
/*async function updateUI() {

  try{
    const allData = await getData('http://localhost:3000/projectData');
    document.getElementById('datetime').innerText = allData.date;
    document.getElementById('temperature').innerText = allData.temp;
    document.getElementById('content').innerText = allData.content;

  }catch(error){
    console.log("error", error);
  }

}*/

function getCurrentDate() {
  const currentDate = new Date();
  return `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`;
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
