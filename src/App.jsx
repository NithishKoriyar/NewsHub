import { BrowserRouter, Route, Routes } from 'react-router-dom';
import  { Suspense, lazy } from 'react';
import Loader from './components/common/Loader';

// Lazy loading components
const HomePage = lazy(() => import('./pages/HomePage'));
const PersonalizedFeed = lazy(() => import('./pages/PersonalizedFeed'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader/>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<PersonalizedFeed />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
