const input = document.getElementById("input");
const button = document.getElementById("btn");

input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    button.click();
  }
});

button.addEventListener("click", async function () {
  const location = input.value;
  if (location != "") {
    const data = await fetchWeather(location);
    if (data == null) {
    }
    else {
      updateDOM(data);
    }
  }
  input.value = "";

})

async function fetchWeather(location) {
  const url = `https://api.weatherapi.com/v1/current.json?key=c7236d36debb4636a18170654262201&q=${location}&aqi=no`;
  const response = await fetch(url);

  if (response.status === 400) {
    return null;
  } else {
    const jsonData = await response.json();
    console.log(jsonData);
    return jsonData;
  }
}
function updateDOM(data) {
  //filter the data
  const temp = data.current.temp_c;
  const location = data.location.name;
  const timeData = data.location.localtime;
  const [date, time] = timeData.split(" ");
  const iconLink = data.current.condition.icon;
  console.log(temp, location, timeData, date, time, iconLink);


  //update it 
  let timee = document.getElementsByClassName("time1");
  if (timee.length > 0) timee[0].textContent = time;

  let loc = document.getElementById("loc");
  if (loc) loc.textContent = location;

  let datee = document.getElementsByClassName("date");
  if (datee.length > 0) datee[0].innerHTML = date;

  let deg = document.getElementById("deg");
  if (deg) deg.innerHTML = temp + "°C";

  let image = document.querySelector(".weather-icon");
  if (image) image.src = iconLink;

  let condition = document.getElementById("conn");
  if (condition) condition.textContent = data.current.condition.text;

  // Update background based on condition
  const text = data.current.condition.text;
  weatherSystem.setWeather(text);

  // Update Smart Tip
  updateWeatherTip(text, data.current.temp_c);

  // Trigger UI Animation Reset
  resetAnimations();
}

function updateWeatherTip(conditionText, temp) {
  const tipElement = document.getElementById('weather-tip');
  const text = conditionText.toLowerCase();
  let tip = "";

  if (text.includes('rain') || text.includes('drizzle')) tip = "Don't forget your umbrella today!";
  else if (text.includes('storm') || text.includes('thunder')) tip = "Stay indoors, it's stormy out there!";
  else if (text.includes('snow') || text.includes('blizzard')) tip = "Bundle up! It's freezing outside.";
  else if (text.includes('mist') || text.includes('fog')) tip = "Drive carefully, visibility is low.";
  else if (text.includes('sunny') || text.includes('clear')) {
    if (temp > 30) tip = "Stay hydrated and wear sunscreen!";
    else if (temp < 10) tip = "It's a crisp clear cold day. Wear a coat!";
    else tip = "Perfect weather for a walk.";
  }
  else if (text.includes('cloud')) tip = "Good weather for photography.";
  else tip = "Enjoy your day!";

  tipElement.textContent = tip;
}

function resetAnimations() {
  const elements = document.querySelectorAll('.weather h1, .weather h2, .details, #conn, #weather-tip');
  elements.forEach(el => {
    el.style.animation = 'none';
    el.offsetHeight; /* trigger reflow */
    el.style.animation = null;
  });
}

// CANVAS WEATHER SYSTEM
class WeatherSystem {
  constructor() {
    this.canvas = document.getElementById('weather-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.type = 'clear';
    this.mouse = { x: -100, y: -100 };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  setWeather(conditionText) {
    const text = conditionText.toLowerCase();
    this.particles = []; // Clear old particles

    if (text.includes('rain') || text.includes('shower') || text.includes('drizzle') || text.includes('storm')) {
      this.type = 'rain';
      const count = text.includes('heavy') || text.includes('storm') ? 600 : 300;
      this.createParticles(count, 'rain');
    } else if (text.includes('snow') || text.includes('blizzard') || text.includes('ice')) {
      this.type = 'snow';
      this.createParticles(200, 'snow');
    } else if (text.includes('cloud') || text.includes('overcast') || text.includes('mist') || text.includes('fog')) {
      this.type = 'cloud';
      this.createParticles(50, 'cloud');
    } else {
      this.type = 'clear';
      this.createParticles(60, 'clear'); // Fireflies/Dust
    }

    // Update background gradient based on type
    this.updateBackgroundGradient(this.type, text);
  }

  createParticles(count, type) {
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(type));
    }
  }

  createParticle(type) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (type === 'rain') {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: Math.random() * 15 + 10,
        length: Math.random() * 20 + 10,
        width: Math.random() * 1 + 0.5
      };
    } else if (type === 'snow') {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        size: Math.random() * 3 + 1
      };
    } else if (type === 'cloud') {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 200 + 100,
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.3 + 0.1
      };
    } else { // Clear/Dust
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        // Fireflies wiggle
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 - 0.25,
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2
      };
    }
  }

  updateBackgroundGradient(type, text) {
    const canvas = document.getElementById('weather-canvas');
    if (type === 'rain') canvas.style.background = 'linear-gradient(135deg, #000000, #0f2027)';
    else if (type === 'snow') canvas.style.background = 'linear-gradient(135deg, #0f2027, #203a43)';
    else if (type === 'cloud') canvas.style.background = 'linear-gradient(135deg, #232526, #414345)';
    else if (type === 'clear') {
      canvas.style.background = 'linear-gradient(135deg, #141e30, #243b55)';
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      // MOUSE INTERACTION (Repel)
      const dx = p.x - this.mouse.x;
      const dy = p.y - this.mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      let moveX = 0;
      let moveY = 0;

      if (distance < 150) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (150 - distance) / 150;
        const directionX = forceDirectionX * force * 5; // Strength
        const directionY = forceDirectionY * force * 5;
        moveX = directionX;
        moveY = directionY;
      }

      if (this.type === 'rain') {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = p.width;
        // Apply repulsion
        p.x += moveX;
        p.y += moveY;

        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x, p.y + p.length);
        this.ctx.stroke();

        p.y += p.speedY;
        if (p.y > this.canvas.height) { p.y = -p.length; p.x = Math.random() * this.canvas.width; }
      }
      else if (this.type === 'snow') {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        p.x += moveX * 2; // Snow repels simpler
        p.y += moveY * 2;

        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > this.canvas.height) p.y = -5;
        if (p.x > this.canvas.width) p.x = 0;
        if (p.x < 0) p.x = this.canvas.width;
      }
      else if (this.type === 'cloud') {
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        p.x += p.speedX;
        if (p.x > this.canvas.width + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = this.canvas.width + p.size;
      }
      else { // Clear (Fireflies)
        this.ctx.beginPath();
        this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;

        // Add subtle "run away" behavior
        p.x += moveX;
        p.y += moveY;

        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Wiggle
        p.x += Math.sin(p.angle) * 0.3;
        p.y += Math.cos(p.angle) * 0.3;
        p.angle += 0.05;

        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < 0) p.y = this.canvas.height;
        if (p.y > this.canvas.height) p.y = 0;
        if (p.x < 0) p.x = this.canvas.width;
        if (p.x > this.canvas.width) p.x = 0;
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Initialize Weather System
const weatherSystem = new WeatherSystem();

// Automatic Geolocation
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // WeatherAPI supports "lat,lon" format directly
        checkWeather(`${lat},${lon}`);
      },
      (error) => {
        console.warn("Geolocation denied or error:", error);
        // Fallback default
        checkWeather("New Delhi");
      }
    );
  } else {
    console.warn("Geolocation not supported by this browser.");
    checkWeather("New Delhi");
  }
}

// Start App
getUserLocation();
