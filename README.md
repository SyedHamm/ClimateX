# ClimateX: Advanced Weather Forecast Application

![ClimateX Logo](https://img.shields.io/badge/ClimateX-Weather%20Forecast-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

**ClimateX** is a sophisticated web application for weather forecasting that leverages machine learning algorithms to predict temperature patterns for up to 90 days. The application processes historical NOAA weather data from the Dallas area to generate accurate forecasts with confidence intervals, seasonal analysis, and comprehensive visualizations.

![Application Screenshot](https://via.placeholder.com/800x400?text=ClimateX+Weather+Forecast+App)

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [System Architecture](#system-architecture)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Machine Learning Models](#machine-learning-models)
- [Data Sources](#data-sources)

## Features

- **90-Day Temperature Forecast**: Predict maximum and minimum temperatures with high accuracy
- **Custom Date Selection**: Choose any starting date for the forecast period
- **Multiple ML Model Comparison**: Analyze performance across different machine learning algorithms
- **Confidence Intervals**: Visualize prediction uncertainty with confidence intervals
- **Feature Importance Analysis**: Understand key factors affecting temperature predictions
- **Seasonal Temperature Patterns**: Explore forecasted temperatures by season
- **Weather Condition Distribution**: View predicted distribution of weather conditions
- **Historical Data Comparison**: Compare forecasts with historical temperature patterns
- **Extreme Days Identification**: Highlight the hottest and coldest days in the forecast period
- **Interactive Data Visualization**: Explore data through interactive charts and tables
- **Responsive UI Design**: Fully responsive interface that works on desktop and mobile devices

## Technologies Used

### Backend

- **Python 3.9+**: Core programming language for data processing and API
- **Flask 2.0+**: Web framework for the REST API
- **Flask-CORS**: Extension for handling Cross-Origin Resource Sharing (CORS)
- **Pandas 1.3+**: Data manipulation and analysis library
- **NumPy 1.20+**: Scientific computing and numerical operations
- **Scikit-learn 1.0+**: Machine learning library for:
  - Random Forest Regression
  - Gradient Boosting Regression
  - Linear Regression
- **Matplotlib 3.4+**: Data visualization for plots and charts

### Frontend

- **React 17+**: JavaScript library for building the user interface
- **Material-UI (MUI) 5+**: React UI framework for modern design components
- **Chart.js 3+**: JavaScript charting library for data visualization
- **Axios**: Promise-based HTTP client for API requests
- **date-fns**: JavaScript date utility library

### Development Tools

- **Node.js 14+**: JavaScript runtime environment
- **npm**: Package manager for JavaScript
- **Create React App**: Toolchain for React application development

## System Architecture

ClimateX follows a client-server architecture:

1. **Frontend (Client)**:
   - React single-page application
   - Material-UI components for UI elements
   - Chart.js for interactive visualizations
   - Communicates with the backend via REST API

2. **Backend (Server)**:
   - Flask RESTful API
   - Data processing with Pandas and NumPy
   - Machine learning models using Scikit-learn

3. **Data Flow**:
   - Historical weather data is processed by ML models
   - Forecasts are generated with multiple algorithms
   - Results are sent to the frontend for visualization

## Installation & Setup

### Prerequisites

- Python 3.7 or newer
- Node.js 14 or newer

### Quick Setup

Simply clone the repository and run the appropriate startup script for your operating system:

1. **Clone the repository**:
```bash
git clone https://github.com/SyedHamm/ClimateX.git
cd ClimateX
```

2. **Run the application**:

#### Windows Users
```bash
run_app.bat
```

#### Mac/Linux Users
```bash
chmod +x run_app.sh  # Make the script executable (first time only)
./run_app.sh
```

These scripts will automatically:
- Check for Python and Node.js installations
- Install all required dependencies for both backend and frontend
- Start the Flask backend server
- Launch the React frontend
- Open the application in your default browser

No additional setup steps are required!

## Project Structure

```
WeatherForecastWebApp/
├── backend/                  # Flask backend
│   ├── app.py                # Main Flask application
│   ├── weather_forecast.py   # ML models and data processing
│   ├── requirements.txt      # Python dependencies
│   └── data.csv              # Historical weather data
│
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   ├── src/                  # Source code
│   │   ├── components/       # React components
│   │   │   ├── WeatherChart.js             # Temperature chart
│   │   │   ├── ForecastTable.js            # Data table
│   │   │   ├── ModelComparisonChart.js     # ML model comparison
│   │   │   ├── FeatureImportanceChart.js   # Feature analysis
│   │   │   ├── WeatherConditionChart.js    # Weather conditions
│   │   │   ├── SeasonalSummaryChart.js     # Seasonal patterns
│   │   │   ├── HistoricalComparisonChart.js # Historical comparison
│   │   │   ├── ExtremeDaysCard.js          # Extreme days
│   │   │   └── ForecastMetricsCard.js      # Model metrics
│   │   ├── App.js            # Main React component
│   │   └── index.js          # Entry point
│   └── package.json          # Node.js dependencies
│
└── run_app.bat               # Launcher script for Windows
```

## Machine Learning Models

ClimateX utilizes multiple machine learning models to generate temperature forecasts:

1. **Random Forest Regressor**:
   - Ensemble method using multiple decision trees
   - Good at handling non-linear relationships
   - Provides feature importance analysis

2. **Gradient Boosting Regressor**:
   - Sequential ensemble method that builds trees to correct previous errors
   - Often provides higher accuracy for temperature prediction

3. **Linear Regression**:
   - Simple baseline model
   - Used for comparison with more complex algorithms

The application compares model performance using metrics such as:
- Root Mean Squared Error (RMSE)
- Mean Absolute Error (MAE)
- R² Score (Coefficient of Determination)

## Data Sources

The application uses historical weather data from the National Oceanic and Atmospheric Administration (NOAA) for the Dallas area. The dataset includes:

- Daily maximum temperatures (tmax)
- Daily minimum temperatures (tmin)
- Additional weather metrics (precipitation, humidity, etc.)
- Date information

This historical data is processed and used to train the machine learning models, which then generate predictions for future temperature patterns.

---

© 2025 ClimateX Weather Forecast App
