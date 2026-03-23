import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Interview from './pages/Interview';
import PivotMode from './pages/PivotMode';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/pivot" element={<PivotMode />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/interview" element={<Interview />} />
      </Route>
    </Routes>
  );
}

export default App;
