# Melodissey's Front-end

A daily blind test game inspired by [Themely](https://themely.se/days) where players guess the movie or series from a soundtrack.<br> The game provides hints progressively and allows players to compare their scores on a leaderboard.<br>
🔗 The backend repository is available here: [Meldoissey's back-end](https://github.com/Pirant0409/MelodisseyBack)  
<p align="center">
  <img src="./readMeAssets/challenge.png?raw=true" alt="Main page">
</p>



## 🚀 Features  
- 🎶 **Daily Blind Test Challenges** – A new soundtrack to guess each day  
- 🧩 **Progressive Hints** – The more attempts, the more clues  
- 🏆 **Leaderboard** – Compare your performance with other players (Comming soon)
- 📊 **Local History** – Track past attempts and results  
- 👥 **Private Rooms** – Play with friends in custom rooms
- 🔧 **Admin Panel** – Add or edit game content easily (require back-end authentication)

## 🛠 Tech Stack  
- **Framework:** Angular 19.1.4  
- **Styling:** Tailwind CSS
- **Audio Playback**: [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) ensuring proper playback without storing audio files.

## ⚙️ Installation & Setup  

```bash
# Clone the repository
git clone https://github.com/Pirant0409/Melodissey-front.git

# Navigate to the project folder
cd Melodissey-front

# Install dependencies
npm install

# Start the development server
ng serve
```

The app will be available at http://localhost:4200

### Production (Docker)

A Dockerfile is provided to build and serve the project in production using Nginx.
```bash
🛠 Build & Run
# Build the Docker image
docker build -t melodissey-front .

# Run the container (serving on port 80 by default)
docker run -d -p 80:80 melodissey-front
 ```
