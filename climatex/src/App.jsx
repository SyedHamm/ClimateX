import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('temperature')
  const [location, setLocation] = useState('Global')
  const [searchInput, setSearchInput] = useState('')
  const [timeRange, setTimeRange] = useState('100years')
  const [climateData, setClimateData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Mock historical climate data - in a real app, this would come from a CSV or API
  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setClimateData({
        temperature: {
          yearly: [
            { year: 1920, value: 13.87, anomaly: -0.60 },
            { year: 1930, value: 13.96, anomaly: -0.51 },
            { year: 1940, value: 14.04, anomaly: -0.43 },
            { year: 1950, value: 13.98, anomaly: -0.49 },
            { year: 1960, value: 14.05, anomaly: -0.42 },
            { year: 1970, value: 14.08, anomaly: -0.39 },
            { year: 1980, value: 14.18, anomaly: -0.29 },
            { year: 1990, value: 14.31, anomaly: -0.16 },
            { year: 2000, value: 14.40, anomaly: -0.07 },
            { year: 2010, value: 14.57, anomaly: 0.10 },
            { year: 2020, value: 14.77, anomaly: 0.30 },
            { year: 2024, value: 14.90, anomaly: 0.43 },
          ],
          decades: [
            { decade: "1920s", value: 13.90, anomaly: -0.57 },
            { decade: "1930s", value: 13.98, anomaly: -0.49 },
            { decade: "1940s", value: 14.01, anomaly: -0.46 },
            { decade: "1950s", value: 14.00, anomaly: -0.47 },
            { decade: "1960s", value: 14.05, anomaly: -0.42 },
            { decade: "1970s", value: 14.12, anomaly: -0.35 },
            { decade: "1980s", value: 14.23, anomaly: -0.24 },
            { decade: "1990s", value: 14.34, anomaly: -0.13 },
            { decade: "2000s", value: 14.48, anomaly: 0.01 },
            { decade: "2010s", value: 14.64, anomaly: 0.17 },
            { decade: "2020s", value: 14.84, anomaly: 0.37 },
          ],
          extremes: {
            hottest: { year: 2023, value: 14.98, anomaly: 0.51 },
            coldest: { year: 1911, value: 13.75, anomaly: -0.72 },
            records: [
              { year: 2023, type: "hottest", value: 14.98 },
              { year: 2020, type: "hottest", value: 14.85 },
              { year: 2016, type: "hottest", value: 14.82 },
              { year: 2019, type: "hottest", value: 14.79 },
              { year: 2017, type: "hottest", value: 14.76 }
            ]
          }
        },
        precipitation: {
          yearly: [
            { year: 1920, value: 1045, anomaly: -25 },
            { year: 1930, value: 1040, anomaly: -30 },
            { year: 1940, value: 1050, anomaly: -20 },
            { year: 1950, value: 1060, anomaly: -10 },
            { year: 1960, value: 1065, anomaly: -5 },
            { year: 1970, value: 1070, anomaly: 0 },
            { year: 1980, value: 1075, anomaly: 5 },
            { year: 1990, value: 1080, anomaly: 10 },
            { year: 2000, value: 1085, anomaly: 15 },
            { year: 2010, value: 1090, anomaly: 20 },
            { year: 2020, value: 1100, anomaly: 30 },
            { year: 2024, value: 1105, anomaly: 35 },
          ],
          decades: [
            { decade: "1920s", value: 1042, anomaly: -28 },
            { decade: "1930s", value: 1047, anomaly: -23 },
            { decade: "1940s", value: 1055, anomaly: -15 },
            { decade: "1950s", value: 1062, anomaly: -8 },
            { decade: "1960s", value: 1068, anomaly: -2 },
            { decade: "1970s", value: 1072, anomaly: 2 },
            { decade: "1980s", value: 1077, anomaly: 7 },
            { decade: "1990s", value: 1082, anomaly: 12 },
            { decade: "2000s", value: 1088, anomaly: 18 },
            { decade: "2010s", value: 1095, anomaly: 25 },
            { decade: "2020s", value: 1103, anomaly: 33 },
          ],
          patterns: [
            { region: "Equatorial", trend: "Increasing intensity", change: "+12%" },
            { region: "Mid-latitudes", trend: "Shifting seasonality", change: "+8%" },
            { region: "Polar", trend: "More precipitation as rain vs snow", change: "+15%" }
          ]
        },
        seaLevel: {
          yearly: [
            { year: 1920, value: 0 },
            { year: 1930, value: 5 },
            { year: 1940, value: 10 },
            { year: 1950, value: 15 },
            { year: 1960, value: 20 },
            { year: 1970, value: 30 },
            { year: 1980, value: 40 },
            { year: 1990, value: 55 },
            { year: 2000, value: 70 },
            { year: 2010, value: 90 },
            { year: 2020, value: 115 },
            { year: 2024, value: 128 },
          ],
          rate: [
            { period: "1900-1950", value: 1.4 },
            { period: "1950-1980", value: 1.8 },
            { period: "1980-2000", value: 2.5 },
            { period: "2000-2020", value: 3.6 },
            { period: "2020-2024", value: 4.2 },
          ],
          projections: [
            { scenario: "Low emissions", year: 2050, value: 200 },
            { scenario: "Medium emissions", year: 2050, value: 250 },
            { scenario: "High emissions", year: 2050, value: 320 },
            { scenario: "Low emissions", year: 2100, value: 400 },
            { scenario: "Medium emissions", year: 2100, value: 550 },
            { scenario: "High emissions", year: 2100, value: 780 },
          ]
        },
        extremeEvents: {
          frequency: [
            { decade: "1920s", heatWaves: 12, floods: 22, droughts: 15, storms: 31 },
            { decade: "1930s", heatWaves: 15, floods: 24, droughts: 18, storms: 34 },
            { decade: "1940s", heatWaves: 14, floods: 25, droughts: 16, storms: 35 },
            { decade: "1950s", heatWaves: 13, floods: 27, droughts: 17, storms: 36 },
            { decade: "1960s", heatWaves: 15, floods: 28, droughts: 16, storms: 37 },
            { decade: "1970s", heatWaves: 16, floods: 30, droughts: 18, storms: 38 },
            { decade: "1980s", heatWaves: 20, floods: 33, droughts: 19, storms: 39 },
            { decade: "1990s", heatWaves: 25, floods: 36, droughts: 22, storms: 41 },
            { decade: "2000s", heatWaves: 32, floods: 40, droughts: 25, storms: 45 },
            { decade: "2010s", heatWaves: 42, floods: 45, droughts: 28, storms: 49 },
            { decade: "2020s", heatWaves: 56, floods: 52, droughts: 32, storms: 55 },
          ],
          notable: [
            { year: 2021, event: "Pacific Northwest Heat Dome", impact: "Record temperatures 49.6°C" },
            { year: 2019, event: "Australian Bushfires", impact: "18.6M hectares burned" },
            { year: 2017, event: "Hurricane Maria", impact: "Category 5, $91.6B damage" },
            { year: 2012, event: "Superstorm Sandy", impact: "$68.7B damage" },
            { year: 2005, event: "Hurricane Katrina", impact: "$125B damage, 1,833 deaths" }
          ]
        }
      })
      setLoading(false)
    }, 1000)
  }, [location, timeRange])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setLoading(true)
      setLocation(searchInput)
      setSearchInput('')
    }
  }

  const handleTimeRange = (range) => {
    setLoading(true)
    setTimeRange(range)
  }

  // Temperature trends visualization
  const renderTemperatureTrends = () => {
    const tempData = climateData?.temperature
    const chartData = tempData?.yearly || []

    // Calculate max anomaly for scaling
    const maxAnomaly = Math.max(...chartData.map(d => Math.abs(d.anomaly)))
    
    return (
      <div className="climate-section">
        <div className="section-header">
          <h2>Temperature Trends</h2>
          <p>Global average temperature anomalies relative to 1951-1980 baseline</p>
        </div>
        
        <div className="chart-container">
          <div className="chart-wrapper">
            <div className="chart temperature-chart">
              <div className="baseline"></div>
              {chartData.map((data, index) => {
                const barHeight = (Math.abs(data.anomaly) / maxAnomaly) * 150
                const isPositive = data.anomaly >= 0
                
                return (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className={`chart-bar ${isPositive ? 'positive' : 'negative'}`}
                      style={{
                        height: barHeight + 'px',
                        bottom: isPositive ? '50%' : `calc(50% - ${barHeight}px)`,
                      }}
                      title={`${data.year}: ${data.anomaly.toFixed(2)}°C anomaly`}
                    ></div>
                    <span className="bar-label">{data.year}</span>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color positive"></span>
              <span>Warmer than baseline</span>
            </div>
            <div className="legend-item">
              <span className="legend-color negative"></span>
              <span>Cooler than baseline</span>
            </div>
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Key Insights</h3>
          <ul>
            <li>Global temperature has increased by approximately {(tempData?.yearly[tempData?.yearly.length-1].value - tempData?.yearly[0].value).toFixed(2)}°C since 1920</li>
            <li>The {tempData?.decades[tempData?.decades.length-1].decade} is the warmest decade on record</li>
            <li>The rate of warming has accelerated in recent decades</li>
            <li>{tempData?.extremes.hottest.year} was the hottest year on record at {tempData?.extremes.hottest.value.toFixed(2)}°C ({tempData?.extremes.hottest.anomaly.toFixed(2)}°C above baseline)</li>
          </ul>
        </div>
        
        <div className="data-table">
          <h3>Temperature Records</h3>
          <table>
            <thead>
              <tr>
                <th>Year</th>
                <th>Global Mean Temperature</th>
                <th>Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {tempData?.extremes.records.map((record, index) => (
                <tr key={index}>
                  <td>{record.year}</td>
                  <td>{record.value.toFixed(2)}°C</td>
                  <td className="anomaly positive">+{(record.value - 14.47).toFixed(2)}°C</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Precipitation trends visualization
  const renderPrecipitationTrends = () => {
    const precipData = climateData?.precipitation
    const chartData = precipData?.yearly || []

    return (
      <div className="climate-section">
        <div className="section-header">
          <h2>Precipitation Patterns</h2>
          <p>Global average precipitation in millimeters with anomalies from 1961-1990 baseline</p>
        </div>
        
        <div className="chart-container">
          <div className="chart-wrapper">
            <div className="chart precipitation-chart">
              {chartData.map((data, index) => {
                const height = (data.value / 1150) * 200
                
                return (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar precip-bar"
                      style={{
                        height: height + 'px',
                      }}
                      title={`${data.year}: ${data.value}mm (${data.anomaly > 0 ? '+' : ''}${data.anomaly}mm)`}
                    ></div>
                    <span className="bar-label">{data.year}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Regional Patterns</h3>
          <div className="pattern-grid">
            {precipData?.patterns.map((pattern, index) => (
              <div key={index} className="pattern-card">
                <h4>{pattern.region}</h4>
                <p>{pattern.trend}</p>
                <span className="change-value">{pattern.change}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Key Insights</h3>
          <ul>
            <li>Global precipitation has increased by approximately {chartData[chartData.length-1].value - chartData[0].value}mm since 1920</li>
            <li>Precipitation patterns are changing more rapidly than historical averages</li>
            <li>More precipitation is falling in extreme events rather than moderate rainfall</li>
            <li>Dry regions are generally becoming drier, while wet regions are becoming wetter</li>
          </ul>
        </div>
      </div>
    )
  }

  // Sea level rise visualization
  const renderSeaLevelTrends = () => {
    const seaLevelData = climateData?.seaLevel
    const chartData = seaLevelData?.yearly || []
    const rateData = seaLevelData?.rate || []

    return (
      <div className="climate-section">
        <div className="section-header">
          <h2>Sea Level Rise</h2>
          <p>Global mean sea level rise in millimeters relative to 1920 baseline</p>
        </div>
        
        <div className="chart-container">
          <div className="chart-wrapper">
            <div className="chart sealevel-chart">
              <div className="trend-line">
                {chartData.map((data, index) => {
                  const left = (index / (chartData.length - 1)) * 100
                  const bottom = (data.value / 130) * 100
                  
                  return (
                    <div 
                      key={index} 
                      className="trend-point"
                      style={{
                        left: `${left}%`,
                        bottom: `${bottom}%`
                      }}
                      title={`${data.year}: ${data.value}mm`}
                    ></div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Rate of Change</h3>
          <div className="rate-table">
            <table>
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Rate (mm/year)</th>
                </tr>
              </thead>
              <tbody>
                {rateData.map((period, index) => (
                  <tr key={index} className={index === rateData.length - 1 ? 'highlighted' : ''}>
                    <td>{period.period}</td>
                    <td>{period.value.toFixed(1)} mm/year</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Future Projections</h3>
          <div className="projections-chart">
            {seaLevelData?.projections.map((proj, index) => {
              const height = (proj.value / 800) * 100
              const color = proj.scenario === "Low emissions" ? "#3b82f6" : 
                            proj.scenario === "Medium emissions" ? "#f97316" : "#ef4444"
              
              return (
                <div key={index} className="projection-bar">
                  <div 
                    className="bar-fill" 
                    style={{
                      height: `${height}%`,
                      backgroundColor: color
                    }}
                  ></div>
                  <div className="projection-label">
                    <span>{proj.scenario}</span>
                    <span>{proj.year}</span>
                  </div>
                  <span className="projection-value">{proj.value}mm</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Extreme weather events visualization
  const renderExtremeEvents = () => {
    const extremeData = climateData?.extremeEvents
    const chartData = extremeData?.frequency || []

    return (
      <div className="climate-section">
        <div className="section-header">
          <h2>Extreme Weather Events</h2>
          <p>Frequency of significant climate events by decade</p>
        </div>
        
        <div className="chart-container">
          <div className="chart-wrapper">
            <div className="chart multi-line-chart">
              <div className="chart-lines">
                {['heatWaves', 'floods', 'droughts', 'storms'].map((eventType, typeIndex) => {
                  const color = typeIndex === 0 ? '#ef4444' : 
                                typeIndex === 1 ? '#3b82f6' : 
                                typeIndex === 2 ? '#eab308' : '#8b5cf6'
                  
                  return (
                    <div key={typeIndex} className="event-line">
                      {chartData.map((data, index) => {
                        const left = (index / (chartData.length - 1)) * 100
                        const bottom = (data[eventType] / 60) * 100
                        
                        return (
                          <div 
                            key={index} 
                            className="event-point"
                            style={{
                              left: `${left}%`,
                              bottom: `${bottom}%`,
                              backgroundColor: color
                            }}
                            title={`${data.decade}: ${data[eventType]} events`}
                          ></div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              
              <div className="chart-base-labels">
                {chartData.map((data, index) => (
                  <span key={index} style={{left: `${(index / (chartData.length - 1)) * 100}%`}}>
                    {data.decade}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#ef4444'}}></span>
              <span>Heat Waves</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#3b82f6'}}></span>
              <span>Floods</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#eab308'}}></span>
              <span>Droughts</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{backgroundColor: '#8b5cf6'}}></span>
              <span>Severe Storms</span>
            </div>
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Notable Events</h3>
          <div className="events-list">
            {extremeData?.notable.map((event, index) => (
              <div key={index} className="event-card">
                <div className="event-year">{event.year}</div>
                <div className="event-details">
                  <h4>{event.event}</h4>
                  <p>{event.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="climate-insights">
          <h3>Key Insights</h3>
          <ul>
            <li>Heat waves have increased by {chartData[chartData.length-1].heatWaves - chartData[0].heatWaves} events comparing the 1920s to the 2020s</li>
            <li>Floods have increased by {chartData[chartData.length-1].floods - chartData[0].floods} events</li>
            <li>The frequency of all extreme weather events has accelerated in the last three decades</li>
            <li>Heat waves show the most dramatic increase in frequency</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="climate-app">
      <header>
        <h1>ClimateX</h1>
        <div className="header-controls">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search region or country" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          
          <div className="time-range">
            <select value={timeRange} onChange={(e) => handleTimeRange(e.target.value)}>
              <option value="30years">Last 30 Years</option>
              <option value="50years">Last 50 Years</option>
              <option value="100years">Last 100 Years</option>
              <option value="historical">Historical Record</option>
            </select>
          </div>
        </div>
      </header>

      <nav className="tabs">
        <button 
          className={activeTab === 'temperature' ? 'active' : ''} 
          onClick={() => setActiveTab('temperature')}
        >
          Temperature
        </button>
        <button 
          className={activeTab === 'precipitation' ? 'active' : ''} 
          onClick={() => setActiveTab('precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={activeTab === 'seaLevel' ? 'active' : ''} 
          onClick={() => setActiveTab('seaLevel')}
        >
          Sea Level Rise
        </button>
        <button 
          className={activeTab === 'extremeEvents' ? 'active' : ''} 
          onClick={() => setActiveTab('extremeEvents')}
        >
          Extreme Events
        </button>
      </nav>

      <main>
        {loading ? (
          <div className="loading">Loading climate data...</div>
        ) : (
          <div className="content">
            {activeTab === 'temperature' && renderTemperatureTrends()}
            {activeTab === 'precipitation' && renderPrecipitationTrends()}
            {activeTab === 'seaLevel' && renderSeaLevelTrends()}
            {activeTab === 'extremeEvents' && renderExtremeEvents()}
          </div>
        )}
      </main>

      <footer>
        <p>ClimateX - Historical Climate Data Analysis Tool</p>
        <p><small>Data sourced from historical climate records. Last updated: March 2025</small></p>
      </footer>
    </div>
  )
}

export default App