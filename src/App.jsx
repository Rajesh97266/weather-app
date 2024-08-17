import "./App.css";
import { useEffect, useState, useCallback } from "react";
import SearchIcon from "./images/searchicon.svg";
import ClearIcon from "./images/wi-day-sunny.svg";
import CloudIcon from "./images/wi-cloud.svg";
import DrizzleIcon from "./images/wi-night-partly-cloudy.svg";
import RainICon from "./images/wi-rain.svg";
import SnowIcon from "./images/wi-snow.svg";
import WeatherImage from "./WeatherImage"; // Import WeatherImage

function App() {
  let api_key = "ef8d6889a1f644687c55d6a48c5accaa";
  const [text, setText] = useState("chennai");
  const [icon, setIcon] = useState(SnowIcon);
  const [temp, setTemp] = useState(30);
  const [city, setCity] = useState("chennai");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cityNotFound, setCityNotFound] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": ClearIcon,
    "01n": ClearIcon,
    "02d": CloudIcon,
    "02n": CloudIcon,
    "03d": DrizzleIcon,
    "03n": DrizzleIcon,
    "04d": DrizzleIcon,
    "04n": DrizzleIcon,
    "09d": RainICon,
    "09n": RainICon,
    "10d": RainICon,
    "10n": RainICon,
    "13d": SnowIcon,
    "13n": SnowIcon,
  };

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try {
      let res = await fetch(url);
      let data = await res.json();

      if (data.cod === "404") {
        console.error("City Not Found");
        setCityNotFound(true);
        setCity("");
        setCountry("");
        setLat(0);
        setLog(0);
        setHumidity(0);
        setWind(0);
        setTemp(0);
        setIcon(ClearIcon);
        setLoading(false);
        return;
      }

      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(Math.floor(data.main.temp));
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLog(data.coord.lon);
      const WeatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[WeatherIconCode] || ClearIcon);

      setCityNotFound(false);
    } catch (error) {
      console.log("An Error Occurred:", error.message);
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  }, [text]);

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Search City"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          <div>
            <img
              className="search-icon"
              src={SearchIcon}
              alt="search"
              style={{ height: "20px", width: "20px" }}
              onClick={() => search()}
            />
          </div>
        </div>
        {!loading && !cityNotFound && (
          <WeatherImage
            icon={icon}
            temp={temp}
            city={city}
            country={country}
            lat={lat}
            log={log}
            humidity={humidity}
            wind={wind}
          />
        )}
        {loading && <div className="loading-message">Loading ....</div>}
        {error && <div className="error-message">{error}</div>}
        {cityNotFound && <div className="city-not-found">City Not Found</div>}

        <p className="copyright">
          © Copyright Designed by <span>Rajesh</span>
        </p>
      </div>
    </>
  );
}

export default App;
