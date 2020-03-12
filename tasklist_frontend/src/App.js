import React from 'react'
import {BrowserRouter} from 'react-router-dom'
import Routes from './Routes/Routes'

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  )
}
