/**
 * LandingPage - Main Landing Page Component
 * Redesigned with modern UI and animations
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { HowItWorks } from './sections/HowItWorks';
import { CTA } from './sections/CTA';
import { LandingFooter } from './components/LandingFooter';
import './styles/landing.css';

const LandingPage: React.FC = () => {
  const { t } = useTranslation('landing');

  useEffect(() => {
    // Set document title
    document.title = t('pageTitle');

    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, [t]);

  return (
    <div className="landing-page" style={{ overflowX: 'hidden' }}>
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
