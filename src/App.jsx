import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 flex flex-col justify-start">
        <Outlet />
      </main>
      {location.pathname === '/' && <Footer />}
    </div>
  );
}
