import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import PivotMode from './pages/PivotMode';

function App() {
  const [pivotResults, setPivotResults] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route element={<AppLayout />}>
        <Route
          path="/pivot"
          element={<PivotMode savedResults={pivotResults} onResultsSaved={setPivotResults} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap pivotResults={pivotResults} />} />
        <Route path="/interview" element={<Interview />} />
      </Route>
    </Routes>
  );
}

export default App;
