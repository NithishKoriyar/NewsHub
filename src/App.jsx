import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PersonalizedNews from './pages/PersonalizedNews'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<PersonalizedNews />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
