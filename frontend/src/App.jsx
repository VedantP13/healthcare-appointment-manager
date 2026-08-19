import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Healthcare Appointment Manager</h1>} />
        <Route path="/patient/*" element={<h2>Patient Portal</h2>} />
        <Route path="/doctor/*" element={<h2>Doctor Portal</h2>} />
        <Route path="/admin/*" element={<h2>Admin Portal</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;