from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import traceback
# Import the fixed weather forecast module
from weather_forecast_fixed import run_forecast

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/build')
CORS(app)  # Enable CORS for all routes

# Define API routes
@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    """Generate and return weather forecast data with enhanced ML features"""
    try:
        # Get parameters from the request
        days = request.args.get('days', default=90, type=int)
        start_date = request.args.get('start_date', default=None, type=str)
        data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.csv")
        
        if not os.path.exists(data_path):
            return jsonify({
                "success": False,
                "message": f"Data file not found: {data_path}"
            }), 404
        
        # Run the enhanced forecast with the start_date if provided
        forecast_results, success, message = run_forecast(data_path, days, start_date)
        
        if success and forecast_results is not None:
            return jsonify({
                "success": True,
                "message": message,
                "data": forecast_results
            })
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 500
    
    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {str(e)}\n{traceback_str}")
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

@app.route('/api/forecast/models', methods=['GET'])
def get_model_info():
    """Return information about the ML models used for forecasting"""
    try:
        data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.csv")
        
        if not os.path.exists(data_path):
            return jsonify({
                "success": False,
                "message": f"Data file not found: {data_path}"
            }), 404
        
        # Run forecast and extract model information
        forecast_results, success, message = run_forecast(data_path, days=7)  # Only need a short forecast for model info
        
        if success and forecast_results is not None:
            return jsonify({
                "success": True,
                "message": "Model information retrieved successfully",
                "data": forecast_results['models']
            })
        else:
            return jsonify({
                "success": False,
                "message": message
            }), 500
    
    except Exception as e:
        traceback_str = traceback.format_exc()
        print(f"Error: {str(e)}\n{traceback_str}")
        return jsonify({
            "success": False,
            "message": f"An error occurred: {str(e)}"
        }), 500

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
