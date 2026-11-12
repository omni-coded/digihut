import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sheets from './components/Sheets';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import SetupNotice from './components/SetupNotice';
import Home from './pages/Home';
import BottomBar from './components/BottomBar';
import useTextSize from './hooks/useTextSize';

// Rarely visited pages load only when opened, keeping the home page light.
const Legal = lazy(() => import('./pages/Legal'));
const Admin = lazy(() => import('./pages/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const MyShop = lazy(() => import('./pages/MyShop'));

// Hash routes ("#/privacy") work on any static host without server rewrites.
// Plain hashes ("#services") stay on the home page and scroll to that section.
function readRoute() {
  const hash = window.location.hash;
  return hash.startsWith('#/') ? hash.slice(1).replace(/\/+$/, '') || '/' : '/';
}

function useHashRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

const PAGES = {
  '/': () => <Home />,
  '/privacy': () => <Legal kind="privacy" />,
  '/terms': () => <Legal kind="terms" />,
  '/admin': () => <Admin />,
  '/my-shop': () => <MyShop />,
};

export default function App() {
  const route = useHashRoute();
  const onHome = route === '/';
  useTextSize(); // applies the visitor's saved text size

  useEffect(() => {
    if (onHome) {
      const id = window.location.hash.slice(1);
      if (id) {
        window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [route, onHome]);

  const Page = PAGES[route] || (() => <NotFound />);

  return (
    <>
      <Navbar onHome={onHome} />
      <main id="main" tabIndex={-1} className="outline-none">
        <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
          <Page />
        </Suspense>
      </main>
      <Footer />
      <Sheets />
      <BottomBar onHome={onHome} />
      <FloatingWhatsApp />
      <SetupNotice />
    </>
  );
}
