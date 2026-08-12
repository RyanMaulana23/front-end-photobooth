import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Photobooth from '../pages/Photobooth';
import About from '../pages/About';
import Gallery from '../pages/Gallery';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import AdminDashboard from '../pages/admin/Dashboard';

export default function AllRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="photobooth" element={<Photobooth />} />
          <Route path="photobooth/:sessionId" element={<Photobooth />} />
          <Route path="about" element={<About />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>

        <Route path="auth">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/login" element={<Login />} />
        <Route path="admin/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
