import { Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />

      <main className="flex-1 flex flex-col justify-start">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
