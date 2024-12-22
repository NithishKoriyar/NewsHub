import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PersonalizedFeed from './pages/PersonalizedFeed'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<PersonalizedFeed />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
