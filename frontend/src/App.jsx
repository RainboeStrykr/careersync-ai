import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import PivotMode from './pages/PivotMode';

function App() {
  const [pivotResults, setPivotResults] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<AppLayout />}>
        <Route
          path="/pivot"
          element={<PivotMode savedResults={pivotResults} onResultsSaved={setPivotResults} />}
        />
        <Route path="/dashboard" element={<Dashboard pivotResults={pivotResults} />} />
        <Route
          path="/roadmap"
          element={<Roadmap pivotResults={pivotResults} onResultsSaved={setPivotResults} />}
        />
        <Route path="/interview" element={<Interview pivotResults={pivotResults} />} />
      </Route>
    </Routes>
  );
}

export default App;
