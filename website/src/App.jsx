import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import EcosystemGrid from './components/EcosystemGrid';
import CategoryDetailModal from './components/CategoryDetailModal';
import ServicesShowcaseModal from './components/ServicesShowcaseModal';
import VisualGallerySection from './components/VisualGallerySection';
import PartnerSuccessStoriesSection from './components/PartnerSuccessStoriesSection';
import FloatingQuickNav from './components/FloatingQuickNav';
import AboutSection from './components/AboutSection';
import AboutPage from './components/AboutPage';
import MissionVisionPage from './components/MissionVisionPage';
import EcosystemPage from './components/EcosystemPage';
import VillageHubPage from './components/VillageHubPage';
import GrowthPartnerPage from './components/GrowthPartnerPage';
import FarmerNetworkPage from './components/FarmerNetworkPage';
import WomenEntrepreneurPage from './components/WomenEntrepreneurPage';
import DigitalPartnerPage from './components/DigitalPartnerPage';
import HomeRestroPage from './components/HomeRestroPage';
import FocoFranchisePage from './components/FocoFranchisePage';
import DreamRewardsPage from './components/DreamRewardsPage';
import CareersPage from './components/CareersPage';
import FaqPage from './components/FaqPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import ImpactCalculator from './components/ImpactCalculator';
import CareersSection from './components/CareersSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { categoriesData } from './data/categories';

const getInitialView = () => {
  if (typeof window === 'undefined') return 'home';
  const pathname = window.location.pathname.toLowerCase().replace(/^\/+|\/+$/g, '');
  const hash = window.location.hash.toLowerCase().replace(/^[#/]+/, '');
  const searchParams = new URLSearchParams(window.location.search);
  const paramView = searchParams.get('view') || searchParams.get('page') || searchParams.get('tab');

  // Ad campaign direct links for Privacy Policy
  if (
    pathname === 'privacy' ||
    pathname === 'privacy-policy' ||
    pathname === 'privacy.html' ||
    pathname === 'privacy-policy.html' ||
    pathname === 'legal/privacy' ||
    hash === 'privacy' ||
    hash === 'privacy-policy' ||
    paramView === 'privacy' ||
    paramView === 'privacy-policy'
  ) {
    return 'privacy';
  }

  const validViews = [
    'about',
    'mission',
    'ecosystem',
    'village-hub',
    'growth-partner',
    'farmer-network',
    'women-entrepreneur',
    'digital-partner',
    'home-restro',
    'foco-franchise',
    'dream-rewards',
    'careers',
    'faq',
    'contact',
    'privacy',
    'admin'
  ];

  if (paramView && validViews.includes(paramView)) return paramView;
  if (pathname && validViews.includes(pathname)) return pathname;
  if (hash && validViews.includes(hash)) return hash;

  return 'home';
};

const updateBrowserUrl = (viewName) => {
  if (typeof window === 'undefined') return;
  try {
    const targetUrl = viewName === 'home' ? '/' : `/${viewName}`;
    if (window.location.pathname !== targetUrl) {
      window.history.pushState({ view: viewName }, '', targetUrl);
    }
  } catch (e) {
    console.warn('URL update error:', e);
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState(getInitialView); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showServicesShowcase, setShowServicesShowcase] = useState(false);

  // Synchronize browser history and page titles
  useEffect(() => {
    const handleLocationChange = () => {
      const detectedView = getInitialView();
      setCurrentView(detectedView);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    if (currentView === 'privacy') {
      document.title = 'Privacy Policy | SFARMART24 - Agri-Tech & Community Commerce';
    } else if (currentView === 'about') {
      document.title = 'About Us | SFARMART24';
    } else if (currentView === 'careers') {
      document.title = 'Careers | SFARMART24';
    } else if (currentView === 'contact') {
      document.title = 'Contact Support | SFARMART24';
    } else {
      document.title = 'SFARMART24 | Agri-Tech & Community Commerce Platform';
    }
  }, [currentView]);

  const handleExploreClick = () => {
    if (currentView !== 'home') {
      setCurrentView('home');
      updateBrowserUrl('home');
      setTimeout(() => {
        const ecosystemEl = document.getElementById('ecosystem');
        if (ecosystemEl) ecosystemEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const ecosystemEl = document.getElementById('ecosystem');
      if (ecosystemEl) ecosystemEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenContact = () => {
    setCurrentView('contact');
    updateBrowserUrl('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    updateBrowserUrl('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (viewName, targetId) => {
    const pageViews = [
      'about',
      'mission',
      'ecosystem',
      'village-hub',
      'growth-partner',
      'farmer-network',
      'women-entrepreneur',
      'digital-partner',
      'home-restro',
      'foco-franchise',
      'dream-rewards',
      'careers',
      'faq',
      'contact',
      'privacy',
      'admin'
    ];

    if (pageViews.includes(viewName)) {
      setCurrentView(viewName);
      updateBrowserUrl(viewName);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      updateBrowserUrl('home');
      if (targetId) {
        setTimeout(() => {
          const el = document.getElementById(targetId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSelectCategory = (cat) => {
    const routeMap = {
      'village-hub': 'village-hub',
      'growth-partner': 'growth-partner',
      'farmer-network': 'farmer-network',
      'women-entrepreneur': 'women-entrepreneur',
      'digital-business-partner': 'digital-partner',
      'home-restro': 'home-restro',
      'foco-franchise': 'foco-franchise',
      'dream-rewards': 'dream-rewards'
    };

    const targetId = typeof cat === 'string' ? cat : cat.id;

    if (routeMap[targetId]) {
      setCurrentView(routeMap[targetId]);
      updateBrowserUrl(routeMap[targetId]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const found = categoriesData.find(c => c.id === targetId);
      if (found) {
        setSelectedCategory(found);
      }
    }
  };

  const handleOpenCategoryById = (categoryId) => {
    handleSelectCategory(categoryId);
  };

  return (
    <div className="farmart-app">
      {/* Header & Navigation */}
      {currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavClick={handleNavClick}
          onOpenContact={handleOpenContact}
          onOpenAdmin={handleOpenAdmin}
        />
      )}

      {/* Main Content Area */}
      <main>
        {currentView === 'admin' && (
          <AdminDashboardPage
            onNavigateHome={() => setCurrentView('home')}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onNavigateToHome={handleExploreClick}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'mission' && (
          <MissionVisionPage
            onNavigateToHome={handleExploreClick}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'ecosystem' && (
          <EcosystemPage
            categories={categoriesData}
            onSelectCategory={handleSelectCategory}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'village-hub' && (
          <VillageHubPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'growth-partner' && (
          <GrowthPartnerPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'farmer-network' && (
          <FarmerNetworkPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'women-entrepreneur' && (
          <WomenEntrepreneurPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'digital-partner' && (
          <DigitalPartnerPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'home-restro' && (
          <HomeRestroPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'foco-franchise' && (
          <FocoFranchisePage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'dream-rewards' && (
          <DreamRewardsPage
            onOpenContact={handleOpenContact}
            onBackToEcosystem={() => setCurrentView('ecosystem')}
          />
        )}

        {currentView === 'careers' && (
          <CareersPage
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'faq' && (
          <FaqPage
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage />
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicyPage
            onNavigateToHome={handleExploreClick}
            onOpenContact={handleOpenContact}
          />
        )}

        {currentView === 'home' && (
          <>
            {/* Full Width Hero */}
            <Hero
              onExploreClick={handleExploreClick}
              onOpenShowcase={() => setShowServicesShowcase(true)}
              onOpenDigitalPartner={() => {
                setCurrentView('digital-partner');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* High-Definition Visual Topic Gallery */}
            <VisualGallerySection
              onSelectCategory={handleSelectCategory}
            />

            {/* Real Employment & How People Work Stories */}
            <PartnerSuccessStoriesSection
              onSelectCategory={handleSelectCategory}
              onOpenContact={handleOpenContact}
            />

            {/* 8 Verticals Category Grid */}
            <EcosystemGrid
              categories={categoriesData}
              onSelectCategory={handleSelectCategory}
            />

            {/* Purpose & Values Overview */}
            <AboutSection />

            {/* Earnings & Community Impact Calculator */}
            <ImpactCalculator
              onOpenCategoryModal={handleOpenCategoryById}
            />

            {/* Careers Openings */}
            <CareersSection />

            {/* Contact & Inquiry Form */}
            <ContactSection />
          </>
        )}
      </main>

      {/* Sleek Floating Dock Navigation */}
      {currentView !== 'admin' && (
        <FloatingQuickNav
          currentView={currentView}
          onNavClick={handleNavClick}
          onOpenShowcase={() => setShowServicesShowcase(true)}
        />
      )}

      {/* Footer */}
      {currentView !== 'admin' && <Footer onNavClick={handleNavClick} />}

      {/* Interactive Services & Offerings Showcase Modal */}
      <ServicesShowcaseModal
        isOpen={showServicesShowcase}
        onClose={() => setShowServicesShowcase(false)}
        onSelectCategory={handleSelectCategory}
      />

      {/* Category Detail View Drawer */}
      {selectedCategory && (
        <CategoryDetailModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
        />
      )}
    </div>
  );
}
