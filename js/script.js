//----GLOBAL VARIABLES----//
var form = $('#my-form');
var submitButton = $('#submit-button');
var searchStatus = $('#search-status');
var userInput = $('#input-field');
var searchHistory = $('#search-history');
var currentWeatherEl = $('#current-weather');
var futureWeatherEl = $('#future-weather');

//----FUNCTIONS----//

init();

function init() {

    var keys = Object.keys(localStorage);

    if(keys.length>0){
        keys.forEach(function(key){
            var oldHistory = $("<a>"+ key + "</a>").addClass("btn btn-secondary my-1 w-100");
            searchHistory.append(oldHistory);
        })
    }
}

form.on('submit', function(event){

    event.preventDefault();
    var formInput = userInput.val();
    getCoordinates(formInput);

});

searchHistory.on('click',function(event){
    
    event.preventDefault();
    var buttonText = $(event.target).text();
    getObjectFromLocalStorage(buttonText);

})

function getCoordinates(formInput){

    var requestUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+formInput+'&limit=2&appid=0f93a1e1cb2dce'+'22d83081cb1a965d8a';

    console.log(requestUrl);

    fetch(requestUrl)
        .then(function (response) {
            if(response.status !== 200){
                searchStatus.text('Sorry, we could not find any data');
            }
            return response.json();
        })
        .then(function (data) {
            
            if(!data){
                statusUpdate.text('Sorry, we could not find any data');
            } else {
                var lat = data[0].lat;
                var long= data[0].lon;
                var latLong = 'lat='+lat+'&lon='+long;
                console.log(latLong);
                getWeather(latLong);
        }
        });
}

function getWeather(latLong){
    
    var requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?'+latLong+'&units=imperial&appid=0f93a1e1cb2dce22d'+'83081cb1a965d8a';
    console.log(requestUrl);

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {    
            storeData(data);
        });
}

function storeData(data){
    console.log('Weather API \n----------');
    console.log(data);

        var currentCity= data.city.name;

        var previousSearches = $("<a>"+ currentCity + "</a>").addClass("btn btn-secondary my-1 w-100");
        searchHistory.append(previousSearches);

        var currentCityObj = {
            day0: {
                date: data.list[0].dt_txt,
                main: data.list[0].weather[0].main,
                temp: data.list[0].main.temp,
                wind: data.list[0].wind.speed,
                humidity: data.list[0].main.humidity},

            day1: {
                date: data.list[8].dt_txt,
                main: data.list[8].weather[0].main,
                temp: data.list[8].main.temp,
                wind: data.list[8].wind.speed,
                humidity: data.list[8].main.humidity},

            day2: {
                date: data.list[16].dt_txt,
                main: data.list[16].weather[0].main,
                temp: data.list[16].main.temp,
                wind: data.list[16].wind.speed,
                humidity: data.list[16].main.humidity},

            day3: {
                date: data.list[24].dt_txt,
                main: data.list[24].weather[0].main,
                temp: data.list[24].main.temp,
                wind: data.list[24].wind.speed,
                humidity: data.list[24].main.humidity},

            day4: {
                date: data.list[32].dt_txt,
                main: data.list[32].weather[0].main,
                temp: data.list[32].main.temp,
                wind: data.list[32].wind.speed,
                humidity: data.list[32].main.humidity},

            day5: {
                date: data.list[39].dt_txt,
                main: data.list[39].weather[0].main,
                temp: data.list[39].main.temp,
                wind: data.list[39].wind.speed,
                humidity: data.list[39].main.humidity},
        };

        console.log(currentCityObj);
        localStorage.setItem(currentCity,JSON.stringify(currentCityObj));
        getObjectFromLocalStorage(currentCity);
    
}

function getObjectFromLocalStorage(currentCity){
    
    currentWeatherEl.empty();
    futureWeatherEl.empty();

    if(localStorage.getItem(currentCity)){
        var currentCityObj = JSON.parse(localStorage.getItem(currentCity));
        console.log(currentCityObj);
    
    } else {
        console.log("There is nothing!");
        statusUpdate.text('Sorry, we could not find any data');
    }
    
    console.log(currentCityObj.day0);
    console.log(currentCityObj.day0.date);

    //----this is creating the top weather element----//
    var currentCityContent = $("<h2>"+ currentCity + "</h2>");
    var currentCityDate = $("<h2>"+ currentCityObj.day0.date + "</h2>");
    var currentMainContent = $("<p>"+ currentCityObj.day0.main + "</p>");
    var currentTempContent = $("<p>Temp: "+ currentCityObj.day0.temp +"F</p>");
    var currentWindContent = $("<p>Wind: "+ currentCityObj.day0.wind +"MPH</p>");
    var currentHumidityContent = $("<p>Humidity: "+ currentCityObj.day0.humidity +"%</p>");

    var mainCardEl = $('<div></div>').addClass('card');
    var cardHeaderEl = $('<div></div>').addClass('card-header');
    var cardBodyEl = $('<div></div>').addClass('card-body');

    currentWeatherEl.append(mainCardEl);
    mainCardEl.append(cardHeaderEl, cardBodyEl);
    cardHeaderEl.append(currentCityContent, currentCityDate);
    cardBodyEl.append(currentMainContent, currentTempContent, currentWindContent, currentHumidityContent);

    //----this is creating the bottom 5-day forecast----//

    for(var day in currentCityObj) {

        var futurecardEl = $('<div></div>').addClass('card text-white bg-dark mb-3 mx-1').css('max-width', '18rem');
        var futurecardHeaderEl = $('<div></div>').addClass('card-header');
        var futurecardBodyEl = $('<div></div>').addClass('card-body');

        var futureDateContent = $("<h5>"+ currentCityObj[day].date +"</h5>").addClass('card-title');
        var futureMainContent = $("<p>"+ currentCityObj[day].main + "</p>").addClass('card-text');
        var futureTempContent = $("<p>Temp: "+ currentCityObj[day].temp +"F</p>").addClass('card-text');
        var futureWindContent = $("<p>Wind: "+ currentCityObj[day].wind +"MPH</p>").addClass('card-text');
        var futureHumidityContent = $("<p>Humidity: "+ currentCityObj[day].humidity +"%</p>").addClass('card-text');
        
        futurecardBodyEl.append(futureMainContent, futureTempContent, futureWindContent, futureHumidityContent);
        futurecardHeaderEl.append(futureDateContent);
        futurecardEl.append(futurecardHeaderEl, futurecardBodyEl);
        futureWeatherEl.append(futurecardEl);

     }

    userInput.val('');
    console.log("end");

}



