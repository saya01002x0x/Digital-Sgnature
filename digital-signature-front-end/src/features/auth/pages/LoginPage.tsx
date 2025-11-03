import React from 'react';
import { Layout, Row, Col } from 'antd';
import { LoginForm } from '../components/LoginForm';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const { Content, Header } = Layout;

export const LoginPage: React.FC = () => {
  useTranslation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Header>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Col xs={22} sm={16} md={12} lg={10} xl={8}>
            <LoginForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
