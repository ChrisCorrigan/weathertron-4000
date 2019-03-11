// weathertron component
class Weathertron {
    constructor(id, city, country, units, insertLocation) {
        this.id = id;
        this.city = city;
        this.country = country;
        this.units = units;
        this.dataURL = "http://api.openweathermap.org/data/2.5/forecast?q=";
        this.dataWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=";
        this.weatherAPIKey = "bc69bb3df7145ba16fd41ae7f0a036fb";
        this.startURL = this.dataURL + this.city + "," + this.country + "&units=" + this.units + "&APPID=" + this.weatherAPIKey;
        this.startWeatherURL = this.dataWeatherURL + this.city + "," + this.country + "&units=" + this.units + "&APPID=" + this.weatherAPIKey;
        this.weatherDataPoints = [];
        this.forecastElems = [];
        this.insertLocation = insertLocation;
    }

    async fetchData (dataURL) {
        try {
            const response = await fetch(dataURL);
            const jsonData = await response.json();
            return jsonData;
        } catch(error) {
            console.log(error);
            // alert('Error loading data, see console for details');
        }
    }

    async fetchWeatherData (dataWeatherURL) {
        try {
            const responseWeather = await fetch(dataWeatherURL);
            const jsonWeatherData = await responseWeather.json();
            return jsonWeatherData;
        } catch(error) {
            console.log(error);
            // alert('Error loading data, see console for details');
        }
    }

    getDayOfWeek(dayNumber) {
        switch(dayNumber) {
            case 0: 
                return "Sunday"; 
                break;
            case 1: 
                return "Monday";
                break;
            case 2: 
                return "Tuesday";
                break;
             case 3: 
                return "Wednesday";
                break;
            case 4: 
                return "Thursday";
                break;
            case 5: 
                return "Friday";
                break;
            case 6: 
                return "Saturday";
                break;
        }
    }

    buildComponent(weatherData, weatherDayData) {
        console.log('weatherData: ', weatherData);
        console.log('weatherDayData: ', weatherDayData);

        this.weatherDataPoints = weatherData.list;

        // setup an array of 5 days including today. For each day, step through each temperature data point in the
        // data list (which exists for every 3 hours), and where day matches find the lowest & highest for low/high day temp.
        const forecastDays = [];
        forecastDays[0] = new Date(this.weatherDataPoints[0].dt_txt); 

        for (let i = 0; i < 5; i++) {
            if (i > 0) {
                forecastDays[i] = new Date( forecastDays[i-1].getFullYear(), forecastDays[i-1].getMonth(), forecastDays[i-1].getDate()+1 );
            }            
        }

        // day's weather data
        const weatherID = weatherDayData.weather[0].id;
        const weather = weatherDayData.weather[0].main;
        const weatherDescription = weatherDayData.weather[0].description;
        const weatherIcon = weatherDayData.weather[0].icon;


        // data for weather every 3 hours over entire 5 days
        let currentDate = new Date();
        let currentDay = 0;
        let dataPointDate;
        let newLow = 0;
        let newHigh = 0;
        let forecastElem;
        let newDate = true;
        for (const forecastDay of forecastDays) {
            currentDate = forecastDay.getDate();
            currentDay = this.getDayOfWeek(forecastDay.getDay());
            newDate = true;
            for (const dataPoint of this.weatherDataPoints) {
                dataPointDate = new Date(dataPoint.dt_txt);
                dataPointDate = dataPointDate.getDate();
                if (dataPointDate === currentDate) {
                    if (newDate){
                        newLow = dataPoint.main.temp;
                        newHigh = dataPoint.main.temp;
                        newDate = false;
                    }
                    if (dataPoint.main.temp < newLow) {
                        newLow = dataPoint.main.temp;
                    }
                    if (dataPoint.main.temp > newHigh) {
                        newHigh = dataPoint.main.temp;
                    }
                }
                
            }

            forecastElem = `
                <article class="weathertron__day weathertron__day_${currentDay}">
                    <div class="weathertron__date">${currentDay}</div>
                    <div class="weathertron__temp">
                        <span class="weathertron__temp-title">Low</span>
                        <span class="weathertron__temp-value">${newLow}</span>
                    </div>
                    <div class="weathertron__temp">
                        <span class="weathertron__temp-title">High</span>
                        <span class="weathertron__temp-value">${newHigh}</span>
                    </div>
                </article>
            `;
            this.forecastElems.push(forecastElem);
        }

        this.componentHTML = `
            <div id="weathertron_${this.id}" class="weathertron">
                <section class="weathertron__header">
                    <span class="weathertron__city">${this.city}</span>
                    <span class="weathertron__country">${this.country}</span>
                    <span class="weathertron__forecast">5 day forecast</span>
                </section>
                <section class="weathertron__body">
                    ${this.forecastElems.join('')}
                </section>
                <section class="weathertron__footer">
                    <div class="weathertron__conditions-title">Current conditions:</div>
                    <div class="weathertron__conditions-text">
                        <img src="http://openweathermap.org/img/w/${weatherIcon}.png">
                        <span>${weather} | ${weatherDescription}</span>
                    </div>
                </section>
            </div>
        `;

        // attach component to correct element and render
        const editElement = document.querySelector("#weathertron_" + this.id);
        editElement.insertAdjacentHTML(this.insertLocation, this.componentHTML); 
    }

    init() {
        // fetch data
        const getData = this.fetchData(this.startURL); // returns a promise
        const objContext = this;

        function getNextData(jsonData) {
            const getWeatherData = objContext.fetchWeatherData(objContext.startWeatherURL); // returns a promise
            getWeatherData.then (jsonWeatherData => objContext.buildComponent(jsonData, jsonWeatherData));
        }

        // once data arrives, continue on to building component
        // getData.then (jsonData => this.buildComponent(jsonData));
        getData.then (jsonData => getNextData(jsonData));

    }
}

// function to load any components found in HTML
processComponents = function() {

    // allow multiple ways to insert HTML
    const validateLocation = function(location = 'afterbegin') {
        if (!(location === 'beforebegin' || location === 'afterbegin' || location === 'beforeend' || location === 'afterend')) {
            location = 'afterbegin';
        }
        return location;
    }

    // function for instantiating new weathertron object
    const createNewWeathertron = (id, city, country, units, insertLocation) => {
        weathertronObj = new Weathertron(id, city, country, units, insertLocation);
        weathertronObj.init();
    }

    // find components on page and populate with HTML
    const weathertronElms = document.querySelectorAll('[data-component="weathertron"]');

    if (weathertronElms.length > 0) {
        let counter = 0;
        for (let weathertronElm of weathertronElms) {
            counter++;
            const dataCity = weathertronElm.dataset.startCity;
            const dataCountry = weathertronElm.dataset.startCountry;
            const dataUnits = weathertronElm.dataset.startUnits;
            let dataInsertLocation = validateLocation(weathertronElm.dataset.insertLocation);

            // attach ID to DOM element so it can be referenced 
            weathertronElm.setAttribute('id', 'weathertron_' + counter);

            // instantiate new weathertron object
            createNewWeathertron(counter, dataCity, dataCountry, dataUnits, dataInsertLocation);
        }
    }
        
    // other components would go here
    
};

// process all components .. find HTML tags by data attributes 
// and replace with component HTML & data
processComponents();
