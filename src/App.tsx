import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import WebVRPage from './pages/WebVRPage';
import AboutPage from './pages/AboutPage';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen bg-background-50 dark:bg-secondary-900 text-text-500 dark:text-background-50 transition-colors">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-background-50/50 dark:bg-secondary-900/50 backdrop-blur-sm border-b border-neutral-200 dark:border-secondary-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link to="/" className="text-primary-600 dark:text-primary-400 font-bold text-xl">BIOCAP</Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-8">
                <div className="flex items-baseline space-x-8">
                  <NavLink to="/">Home</NavLink>
                  <NavLink to="/about">About</NavLink>
                  <NavLink to="/maps">Maps</NavLink>
                  <NavLink to="/web-vr">Web VR</NavLink>
                </div>
                <ThemeToggle />
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center space-x-4 md:hidden">
                <ThemeToggle />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-text-500 dark:text-background-50 hover:text-primary-500 dark:hover:text-primary-400 focus:outline-none"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-background-50/90 dark:bg-secondary-900/90 backdrop-blur-sm">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <MobileNavLink to="/">Home</MobileNavLink>
                <MobileNavLink to="/maps">Maps</MobileNavLink>
                <MobileNavLink to="/about">About</MobileNavLink>
                <MobileNavLink to="/web-vr">Web VR</MobileNavLink>
              </div>
            </div>
          )}
        </nav>

        {/* Video Background - Only show on home page */}
        <VideoBackground />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/maps" element={<MapPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/web-vr" element={<WebVRPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function VideoBackground() {
  const location = useLocation();
  if (location.pathname !== '/') return null;

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 z-10" />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source
          src="/ocean.mp4"
          type="video/mp4"
        />
        {/* Fallback image in case video fails to load */}
        <img 
          src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80"
          alt="Ocean waves"
          className="w-full h-full object-cover"
        />
      </video>
    </div>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
          : 'text-text-500 dark:text-background-50 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        active
          ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
          : 'text-text-500 dark:text-background-50 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
      }`}
    >
      {children}
    </Link>
  );
}

function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
        <p className="text-text-400 dark:text-background-100">This section is under development.</p>
      </div>
    </div>
  );
}

export default App;