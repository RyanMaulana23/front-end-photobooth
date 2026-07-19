
import Sidebar from './componeents/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Hero from './components/Hero.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <Hero />
        <Footer />
      </div>
    </div>
  )
}