// API call
let latitude = document.querySelector("#long").textContent
let longitude = document.querySelector("#lat").textContent

let weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

let queryUrl = "https://api.openweathermap.org/data/2.5/onecall?";
let lat = "lat="+latitude+"&";/* "lat=30.027319&" */
let lon = "lon="+longitude+"&";/* "lon=78.225816&" */
let apiOptions = "units=metric&exclude=minutely,alerts&";
let apiKey = "appid="+weather_key;
let file = queryUrl + lat + lon + apiOptions + apiKey;

fetch(file)
.then((response) => response.json())
.then((data) => {
// Weather main data
let main = data.current.weather[0].main;
let description = data.current.weather[0].description;
let temp = Math.round(data.current.temp);
let pressure = data.current.pressure;
let humidity = data.current.humidity;

document.getElementById("wrapper-description").innerHTML = description;
document.getElementById("wrapper-temp").innerHTML = temp + "°C";
document.getElementById("wrapper-pressure").innerHTML = pressure;
document.getElementById("wrapper-humidity").innerHTML = humidity + "°C";

let day1 = data.daily[2].dt
let day2 = data.daily[3].dt
let day3 = data.daily[4].dt
let day4 = data.daily[5].dt
let day5 = data.daily[6].dt

let c1 = new Date(day1*1000).getDay()
let c2 = new Date(day2*1000).getDay()
let c3 = new Date(day3*1000).getDay()
let c4 = new Date(day4*1000).getDay()
let c5 = new Date(day5*1000).getDay()
 console.log(c1)

document.getElementById("date1").innerHTML = "<strong>"+weekdays[c1]+"</strong>"
document.getElementById("date2").innerHTML = "<strong>"+weekdays[c2]+"</strong>"
document.getElementById("date3").innerHTML = "<strong>"+weekdays[c3]+"</strong>"
document.getElementById("date4").innerHTML = "<strong>"+weekdays[c4]+"</strong>"
document.getElementById("date5").innerHTML = "<strong>"+weekdays[c5]+"</strong>"

// Weather hourly data
let hourNow = data.hourly[0].temp;
let hour1 = data.hourly[1].temp;
let hour2 = data.hourly[2].temp;
let hour3 = data.hourly[3].temp;
let hour4 = data.hourly[4].temp;
let hour5 = data.hourly[5].temp;

document.getElementById("wrapper-hour-now").innerHTML = hourNow + "°";
document.getElementById("wrapper-hour1").innerHTML = hour1 + "°";
document.getElementById("wrapper-hour2").innerHTML = hour2 + "°";
document.getElementById("wrapper-hour3").innerHTML = hour3 + "°";
document.getElementById("wrapper-hour4").innerHTML = hour4 + "°";
document.getElementById("wrapper-hour5").innerHTML = hour5 + "°";

// Time
let timeNow = new Date().getHours();
let time1 = timeNow + 1;
let time2 = time1 + 1;
let time3 = time2 + 1;
let time4 = time3 + 1;
let time5 = time4 + 1;

document.getElementById("wrapper-time1").innerHTML = time1;
document.getElementById("wrapper-time2").innerHTML = time2;
document.getElementById("wrapper-time3").innerHTML = time3;
document.getElementById("wrapper-time4").innerHTML = time4;
document.getElementById("wrapper-time5").innerHTML = time5;

// Weather daily data
let tomorrowTemp = Math.round(data.daily[1].temp.day);
let dATTemp1 = Math.round(data.daily[2].temp.day);
let dATTemp2 = Math.round(data.daily[3].temp.day);
let dATTemp3 = Math.round(data.daily[4].temp.day);
let dATTemp4 = Math.round(data.daily[5].temp.day);
let dATTemp5 = Math.round(data.daily[6].temp.day);


document.getElementById("wrapper-forecast-temp-today").innerHTML =
temp + "°";
document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML =
tomorrowTemp + "°";
document.getElementById("wrapper-forecast-temp-dAT1").innerHTML =
dATTemp1 + "°";
document.getElementById("wrapper-forecast-temp-dAT2").innerHTML =
dATTemp2 + "°";
document.getElementById("wrapper-forecast-temp-dAT3").innerHTML =
dATTemp3 + "°";
document.getElementById("wrapper-forecast-temp-dAT4").innerHTML =
dATTemp4 + "°";
document.getElementById("wrapper-forecast-temp-dAT5").innerHTML =
dATTemp5 + "°";

// Icons
let iconBaseUrl = "http://openweathermap.org/img/wn/";
let iconFormat = ".png";

// Today
let iconCodeToday = data.current.weather[0].icon;
let iconFullyUrlToday = iconBaseUrl + iconCodeToday + iconFormat;
document.getElementById("wrapper-icon-today").src = iconFullyUrlToday;

// Tomorrow
let iconCodeTomorrow = data.daily[0].weather[0].icon;
let iconFullyUrlTomorrow = iconBaseUrl + iconCodeTomorrow + iconFormat;
document.getElementById("wrapper-icon-tomorrow").src = iconFullyUrlTomorrow;

// Day after tomorrow
let iconCodeDAT1 = data.daily[1].weather[0].icon;
let iconFullyUrlDAT1 = iconBaseUrl + iconCodeDAT1 + iconFormat;
document.getElementById("wrapper-icon-dAT1").src = iconFullyUrlDAT1;
//4
let iconCodeDAT2 = data.daily[2].weather[0].icon;
let iconFullyUrlDAT2 = iconBaseUrl + iconCodeDAT2 + iconFormat;
document.getElementById("wrapper-icon-dAT2").src = iconFullyUrlDAT2;
//5
let iconCodeDAT3 = data.daily[3].weather[0].icon;
let iconFullyUrlDAT3 = iconBaseUrl + iconCodeDAT3 + iconFormat;
document.getElementById("wrapper-icon-dAT3").src = iconFullyUrlDAT3;
//6
let iconCodeDAT4 = data.daily[4].weather[0].icon;
let iconFullyUrlDAT4 = iconBaseUrl + iconCodeDAT4 + iconFormat;
document.getElementById("wrapper-icon-dAT4").src = iconFullyUrlDAT4;

let iconCodeDAT5 = data.daily[4].weather[0].icon;
let iconFullyUrlDAT5 = iconBaseUrl + iconCodeDAT5 + iconFormat;
document.getElementById("wrapper-icon-dAT5").src = iconFullyUrlDAT5;

// Icons hourly

// Hour now
let iconHourNow = data.hourly[0].weather[0].icon;
let iconFullyUrlHourNow = iconBaseUrl + iconHourNow + iconFormat;
document.getElementById("wrapper-icon-hour-now").src = iconFullyUrlHourNow;

// Hour1
let iconHour1 = data.hourly[1].weather[0].icon;
let iconFullyUrlHour1 = iconBaseUrl + iconHour1 + iconFormat;
document.getElementById("wrapper-icon-hour1").src = iconFullyUrlHour1;

// Hour2
let iconHour2 = data.hourly[2].weather[0].icon;
let iconFullyUrlHour2 = iconBaseUrl + iconHour2 + iconFormat;
document.getElementById("wrapper-icon-hour2").src = iconFullyUrlHour1;

// Hour3
let iconHour3 = data.hourly[3].weather[0].icon;
let iconFullyUrlHour3 = iconBaseUrl + iconHour3 + iconFormat;
document.getElementById("wrapper-icon-hour3").src = iconFullyUrlHour3;

// Hour4
let iconHour4 = data.hourly[4].weather[0].icon;
let iconFullyUrlHour4 = iconBaseUrl + iconHour4 + iconFormat;
document.getElementById("wrapper-icon-hour4").src = iconFullyUrlHour4;

// Hour5
let iconHour5 = data.hourly[5].weather[0].icon;
let iconFullyUrlHour5 = iconBaseUrl + iconHour5 + iconFormat;
document.getElementById("wrapper-icon-hour5").src = iconFullyUrlHour5;

// Backgrounds
});
/* 
  <script>
  fetch("https://api.openweathermap.org/data/2.5/forecast?q=dehradun&appid=067ab73d7382d31ee4e3dd49ab19da6f&units=metric")
  .then(res=> res.json())
  .then(data=>{
   
      data.list[1].main.temp
      const myDiv = document.querySelector("#temp");
      myDiv.innerHTML = "";
      let html =  data.list[1].main.temp
      myDiv.innerHTML +=html
  })
</script> */