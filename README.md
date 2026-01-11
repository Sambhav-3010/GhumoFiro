# GhumoFiro 🌍✈️

**The Ultimate AI-Powered Travel Companion**

GhumoFiro is a comprehensive travel itinerary web application that revolutionizes how trips are planned. By merging manual travel planning with advanced AI generation (powered by Gemini) and real-time data fetching (via SerpAI/SerpAPI), GhumoFiro offers a seamless, personalized, and efficient travel planning experience.

Whether you want to meticulously craft every detail of your journey or let AI generate a perfect itinerary in seconds, GhumoFiro has you covered.

---

## 🚀 Key Features

### 🧠 AI-Powered Itinerary Generation
- **Smart Planning**: Utilizes Google's **Gemini 2.5** model to generate detailed, day-by-day itineraries based on simple user prompts.
- **Context Aware**: Understands destination, budget, duration, and travel style to create perfectly tailored plans.
- **Automated Structuring**: Returns data in a strict JSON schema, ensuring consistent UI rendering for flights, hotels, activities, and dining.

### 🔍 Real-Time Data Integration
- **Live Flight Prices**: Integrates **SerpAPI (Google Flights Engine)** to fetch real-time flight options, prices, and schedules.
- **Dynamic Suggestions**: "See Details" feature pulls current information for recommended places and activities.

### 🛠️ Hybrid Planning System
- **Manual Override**: Users can edit, add, or remove items from AI-generated plans.
- **Drag & Drop**: Intuitive UI for rearranging activities and days.
- **Collab Mode**: (Planned) Share itineraries with friends and plan together.

### 🤖 ML-Driven Recommendations
- **Collaborative Filtering**: Custom recommendation engine suggests destinations based on similar user profiles.
- **Behavioral Analysis**: Analyzes past trips and user preferences to surface hidden gems.

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Directory)
- **Styling**: TailwindCSS, Framer Motion (for smooth animations)
- **State Management**: React Context API
- **Maps**: Leaflet / Google Maps API

### Backend / API
- **Server**: Node.js & Express
- **AI Integration**: Google Generative AI SDK (`@google/generative-ai`)
- **Data Fetching**: Axios, SerpAPI
- **Database**: MongoDB (User data, saved trips), Firebase (Auth)

### Machine Learning
- **Language**: Python
- **Libraries**: Pandas, Scikit-learn
- **Service**: Flask-based microservice for computing recommendations.

---

## ⚙️ Architecture

GhumoFiro operates on a modular architecture:
1.  **Next.js Client**: Handles all user interactions, itinerary rendering, and state management.
2.  **Express Main Server**: Manages authentication, user profiles, and proxies requests to AI services.
3.  **ML Microservice**: A dedicated Python service that periodically processes user data to update recommendation models.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB URI
- Google Gemini API Key
- SerpAPI Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Sambhav-3010/GhumoFiro.git
    cd GhumoFiro
    ```

2.  **Setup Frontend**
    ```bash
    cd Frontend
    npm install
    npm run dev
    ```

3.  **Setup Backend**
    ```bash
    cd Backend
    npm install
    # Create .env file with explicit keys
    node index.js
    ```

4.  **Setup ML Service**
    ```bash
    cd ML_Backend
    pip install -r requirements.txt
    python app.py
    ```

---

## 🔮 Future Roadmap
- [ ] Real-time collaboration via WebSockets (Socket.io).
- [ ] Direct booking integration for flights and hotels.
- [ ] AR View for exploring destinations.

---

Made with ❤️ by [Sambhav Mani Tripathi](https://github.com/Sambhav-3010)
