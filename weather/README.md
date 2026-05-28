# 🌦️ Weather Dashboard

A comprehensive weather dashboard that fetches real-time weather data from OpenWeatherMap public API and displays it with beautiful visualizations.

## ✨ Features

### Current Weather Display
- 🌡️ Real-time temperature, feels-like temperature
- 💧 Humidity percentage
- 💨 Wind speed and direction
- 🌡️ Atmospheric pressure
- 👁️ Visibility range
- ☁️ Cloud coverage
- 🏔️ Detailed weather conditions

### Weather Forecasting
- 📅 5-Day forecast with high/low temperatures
- ⏰ 24-hour detailed hourly forecast
- 🎨 Weather condition icons and descriptions
- 💧 Precipitation probability
- 💨 Wind patterns

### Air Quality Information
- 🏆 AQI (Air Quality Index) level
- 🔬 PM2.5 and PM10 measurements
- 🚗 Nitrogen Dioxide (NO₂) levels
- 🌳 Ozone (O₃) levels
- 📊 Color-coded air quality categories

### Search & Location
- 🔍 City search with autocomplete suggestions
- 📍 Get weather for current location
- ⭐ Quick-access buttons for popular cities
- 💾 Auto-save last searched city

### User Interface
- 🌙 Dark/Light theme toggle
- 📱 Fully responsive design
- ✨ Smooth animations and transitions
- 🎨 Beautiful gradient backgrounds
- ⚡ Real-time updates

## 🚀 Quick Start

### 1. Open in Browser
Simply open `index.html` in your web browser:

```bash
# Direct file
open weather/index.html

# Or using Python local server
cd weather
python -m http.server 8000
# Visit http://localhost:8000
```

### 2. Search for a City
- Type city name in search box
- Select from autocomplete suggestions
- Or click quick-access buttons

### 3. Use Current Location
- Click the location icon (📍)
- Allow browser to access your location
- Weather for your location loads automatically

## 📊 Data Displayed

### Current Weather Section
```
┌─────────────────────────────────┐
│ London, GB                      │
│ Partly Cloudy                   │
├─────────────────────────────────┤
│ 15°C  ☁️                        │
│ Feels like 14°C                 │
├─────────────────────────────────┤
│ 💧 Humidity: 72%                │
│ 💨 Wind: 12.5 km/h              │
│ 🌡️ Pressure: 1013 mb            │
│ 👁️ Visibility: 10 km            │
└─────────────────────────────────┘
```

### 5-Day Forecast
- Date and weather condition
- High/Low temperatures
- Humidity and wind speed
- Condition description

### Hourly Forecast (24 hours)
- Time of forecast
- Temperature at that hour
- Humidity level
- Weather icon

### Detailed Information Cards
- Temperature metrics
- Wind data
- Pressure and visibility
- Cloud coverage

### Air Quality Index
- Overall AQI rating (1-5)
- PM2.5 particulate matter
- PM10 particulate matter
- Nitrogen Dioxide (NO₂)
- Ozone (O₃) levels

## 🏙️ Popular Cities (Quick Add)

One-click buttons for:
- 🇬🇧 London
- 🗽 New York
- 🇯🇵 Tokyo
- 🇦🇪 Dubai
- 🇦🇺 Sydney
- 🇫🇷 Paris

## 🔧 Technical Details

### APIs Used
- **OpenWeatherMap API** (Free tier)
  - Current Weather API
  - 5-Day Forecast API
  - Air Pollution API
  - Geocoding API

### Technologies
- **HTML5**: Semantic structure
- **CSS3**: Grid, Flexbox, Gradients, Animations
- **JavaScript**: Vanilla (No dependencies)
- **Font Awesome**: Icons

### Browser Support
- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

### File Structure
```
weather/
├── index.html       # Main HTML file
├── styles.css       # Styling and layout
├── script.js        # JavaScript logic
└── README.md        # This file
```

## 🔐 API Key Information

The application uses a free OpenWeatherMap API key. For production use:

1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Replace the `API_KEY` in `script.js` with your own key
4. Free tier includes:
   - Current weather
   - 5-day forecast
   - Air quality data
   - Unlimited API calls (with rate limits)

## 💾 Local Storage

The application saves:
- 💾 **Last searched city** - Loads automatically on next visit
- 🌙 **Theme preference** - Dark/Light mode

## 🎨 Customization

### Change Default City
Edit `script.js` line 171:
```javascript
const lastCity = localStorage.getItem('lastCity') || 'London';
```

### Modify Theme Colors
Edit `styles.css` root variables:
```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* ... more colors ... */
}
```

### Add More Quick Cities
Edit `index.html` quick-cities section:
```html
<button class="quick-btn" data-city="Paris">🇫🇷 Paris</button>
```

## 🐛 Troubleshooting

### City Not Found
- Check spelling
- Try partial city name
- Use city + country (e.g., "London, UK")

### Weather Data Not Loading
- Check internet connection
- Verify API key is valid
- Check browser console for errors (F12)
- API might have rate limit (free tier: 60 calls/min)

### Location Not Working
- Enable geolocation in browser settings
- Check if site uses HTTPS (required for geolocation)
- Allow browser permission when prompted

### Dark Mode Not Persisting
- Check if localStorage is enabled
- Clear browser cache and reload

## 📱 Responsive Breakpoints

- **Desktop**: 1400px+ (full layout)
- **Tablet**: 768px-1399px (optimized layout)
- **Mobile**: <768px (single column)
- **Small Mobile**: <480px (compact layout)

## 🌟 Example Use Cases

1. **Travel Planning**: Check weather for destination
2. **Event Planning**: Plan outdoor events based on forecast
3. **Health & Wellness**: Monitor air quality
4. **Daily Routine**: Quick weather check before leaving
5. **Aviation**: Monitor weather conditions globally

## 📚 API Response Examples

### Current Weather
```json
{
  "main": {
    "temp": 15,
    "feels_like": 14,
    "humidity": 72,
    "pressure": 1013
  },
  "wind": {
    "speed": 3.47,
    "deg": 230
  },
  "weather": [
    {
      "main": "Clouds",
      "description": "partly cloudy"
    }
  ]
}
```

## ⏱️ Update Frequency

- **Current Weather**: Click search or use location
- **Forecast Data**: Updated when searching
- **Air Quality**: Updated when searching
- **Real-time Display**: Updates on demand

## 🔐 Privacy

- ✅ No personal data collection
- ✅ Location data used only for weather
- ✅ Works offline after initial load
- ✅ No tracking or analytics

## 📄 License

MIT License - Free to use and modify

## 👋 Support

- 📖 OpenWeatherMap Docs: https://openweathermap.org/api
- 🐛 Browser Console: F12 for debugging
- 🌐 Check API Status: https://status.openweathermap.org

---

**Enjoy checking the weather worldwide!** 🌍🌦️
