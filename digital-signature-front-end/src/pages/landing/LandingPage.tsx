/**
 * LandingPage - Main Landing Page Component
 * Tổng hợp tất cả sections: Header, Banner, Page1-4, Footer
 * Dựa trên template Ant Design 2.x landing page
 */

import React from 'react';
// @ts-ignore - enquire-js không có types
import { enquireScreen } from 'enquire-js';
import { LandingHeader } from './components/LandingHeader';
import { Banner } from './sections/Banner';
import { Page1 } from './sections/Page1';
import { Page2 } from './sections/Page2';
import { Page3 } from './sections/Page3';
import { Page4 } from './sections/Page4';
import { LandingFooter } from './components/LandingFooter';
import './styles/landing.css';

let isMobile = false;
enquireScreen((b: boolean) => {
  isMobile = b;
});

type LandingPageState = {
  isFirstScreen: boolean;
  isMobile: boolean;
}

class LandingPage extends React.PureComponent<{}, LandingPageState> {
  state: LandingPageState = {
    isFirstScreen: true,
    isMobile,
  };

  componentDidMount() {
    enquireScreen((b: boolean) => {
      this.setState({
        isMobile: !!b,
      });
    });

    // Set document title
    document.title = 'E-Signature - Nền tảng ký số điện tử hiện đại';
  }

  onEnterChange = (mode: string) => {
    this.setState({
      isFirstScreen: mode === 'enter',
    });
  }

  render() {
    return (
      <div className="landing-page">
        <LandingHeader 
          key="header" 
          isFirstScreen={this.state.isFirstScreen} 
          isMobile={this.state.isMobile} 
        />
        <Banner 
          key="banner" 
          onEnterChange={this.onEnterChange} 
        />
        <Page1 
          key="page1" 
          isMobile={this.state.isMobile} 
        />
        <Page2 key="page2" />
        <Page3 
          key="page3" 
          isMobile={this.state.isMobile} 
        />
        <Page4 key="page4" />
        <LandingFooter key="footer" />
      </div>
    );
  }
}

export default LandingPage;

