import React from 'react';
import { Layout, Row, Col } from 'antd';
import { RegisterForm } from '../components/RegisterForm';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';

const { Content, Header } = Layout;

export const RegisterPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Header>
      <Content>
        <Row style={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Left side - Empty placeholder for future image/content */}
          <Col xs={0} sm={0} md={12} lg={12} xl={12}>
            <div style={{ 
              height: '100%', 
              backgroundColor: '#f0f2f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Future: Add illustration or image here */}
            </div>
          </Col>
          
          {/* Right side - Registration form */}
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: 'calc(100vh - 64px)',
              padding: '40px 20px'
            }}>
              <RegisterForm />
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
