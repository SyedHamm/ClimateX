import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import weather from '/weathergif.gif'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={weather} className="logo" alt="Vite logo" />
        </a>
      </div>
      <h1>ClimateX</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          
        </p>
      </div>
      <p className="read-the-docs">
        
      </p>
    </>
  )
}

export default App
