# 🌍 Digital World Clock

A responsive web application that displays current time in multiple time zones with beautiful UI and interactive features.

## ✨ Features

- **Multiple Time Zones**: Display time for multiple cities/regions simultaneously
- **Real-time Updates**: Clock updates every second with smooth animations
- **Search Functionality**: Search and add any timezone from around the world
- **Quick Add Buttons**: One-click buttons for popular time zones
- **GMT Offset**: Display GMT offset for each timezone
- **Date & Day Info**: Shows full date, day name, and week number
- **Local Storage**: Your selected timezones are saved automatically
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and visual effects

## 🚀 Quick Start

### 1. Open in Browser
Simply open `index.html` in your web browser. No installation needed!

```bash
# Option 1: Direct file
open clock/index.html

# Option 2: Using Python (Local Server)
cd clock
python -m http.server 8000
# Then visit http://localhost:8000
```

### 2. Add Time Zones

**Option A: Quick Add Buttons**
- Click any of the preset buttons (New York, London, Tokyo, etc.)
- Instantly adds the timezone to your clock

**Option B: Search**
- Type city or timezone name in the search box
- Click "Add Time Zone" or press Enter
- Examples: "New York", "Tokyo", "Sydney", "Dubai"

**Option C: Direct Selection**
- Scroll through and select from 10 popular presets

## 🎯 Available Features

### Display Information
- ⏰ **Time**: Digital format (HH:MM:SS)
- 📅 **Date**: Full date (MM/DD/YYYY)
- 🌍 **Timezone**: City/Region name
- 🕐 **GMT Offset**: Current UTC offset
- 📆 **Day**: Full day name (Monday, Tuesday, etc.)
- 📊 **Week**: Week number of the year

### Actions
- ➕ Add new time zone via search
- ❌ Remove timezone with × button
- 💾 Auto-save your selection
- 🔍 Search across 400+ timezones

## 📱 Responsive Design

- **Desktop**: 3-4 clocks per row
- **Tablet**: 2 clocks per row
- **Mobile**: 1 clock per row

## 💾 Data Persistence

Your selected timezones are automatically saved to browser's localStorage:
- Survives page refresh
- Persists across browser sessions
- No external storage needed

## 🌐 Popular Time Zones

Preset quick-add buttons include:
- 🗽 America/New_York (EST/EDT)
- 🇬🇧 Europe/London (GMT/BST)
- 🇯🇵 Asia/Tokyo (JST)
- 🇦🇪 Asia/Dubai (GST)
- 🇦🇺 Australia/Sydney (AEDT)
- 🇹🇭 Asia/Bangkok (ICT)
- 🇫🇷 Europe/Paris (CET/CEST)
- 🇸🇬 Asia/Singapore (SGT)
- 🇺🇸 America/Los_Angeles (PST/PDT)
- 🇭🇰 Asia/Hong_Kong (HKT)

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Grid layout, gradients, animations
- **Vanilla JavaScript**: No dependencies required
- **Intl API**: Native timezone handling

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

### File Structure
```
clock/
├── index.html      # Main HTML file
├── styles.css      # Styling
├── script.js       # JavaScript logic
└── README.md       # This file
```

## 🎨 Customization

### Change Default Timezones
Edit `script.js` line 8:
```javascript
const DEFAULT_TIMEZONES = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
```

### Modify Colors
Edit `styles.css` gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Update Refresh Rate
Edit `script.js` line 26:
```javascript
setInterval(updateAllClocks, 1000); // Change 1000 to desired milliseconds
```

## 🐛 Troubleshooting

### Timezone Not Found
- Make sure you're typing the timezone correctly
- Try searching by city name instead of timezone ID
- Use autocomplete suggestions if available

### Times Not Updating
- Check if JavaScript is enabled in your browser
- Refresh the page (F5)
- Check browser console for errors (F12)

### Data Not Saving
- Check if localStorage is enabled
- Try clearing browser cache
- Ensure you're not in private/incognito mode

## 📚 Search Tips

### Search by City
- "New York", "Tokyo", "London"
- Works with partial matches

### Search by Region
- "America", "Asia", "Europe"
- Returns all timezones in that region

### Search by Timezone ID
- "US/Eastern", "Europe/London"
- Full timezone names work too

## 🌟 Example Use Cases

1. **Global Teams**: Track working hours across offices
2. **International Meetings**: Find best meeting time
3. **Travel Planning**: Adjust to destination timezone
4. **Trading**: Monitor market opening times
5. **Learning**: Study different timezones

## 📝 Tips & Tricks

- **Quick Access**: Bookmark the page for fast access
- **Multiple Clocks**: Add as many as you need
- **Auto-Load**: Your timezones load automatically
- **No Refresh Needed**: Clocks update in real-time
- **Always Accurate**: Uses device system time

## 🔐 Privacy

- ✅ No server connection required
- ✅ No data collected or sent
- ✅ Works completely offline
- ✅ Data stored only in browser
- ✅ Delete data anytime

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Found a bug? Have suggestions? 
- Report issues
- Submit improvements
- Share feedback

---

**Enjoy tracking time across the world!** 🌍⏰
