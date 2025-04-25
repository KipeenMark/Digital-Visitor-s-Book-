import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import VisitorForm from './components/VisitorForm';
import VisitorsList from './components/VisitorsList';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container" style={{ paddingTop: '2rem' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/register" element={<VisitorForm />} />
            <Route path="/visitors" element={<VisitorsList />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
