import React from 'react';
import { Row, Col, Layout } from 'antd';
import { LoginForm } from '../components/LoginForm';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const { Content, Header } = Layout;

export const LoginPage: React.FC = () => {
  useTranslation();

  return (
    <Layout className="layout auth-layout">
      <Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </Header>
      <Content style={{ padding: '50px 0' }}>
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={22} sm={20} md={16} lg={10} xl={8}>
            <LoginForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
