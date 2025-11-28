import React from 'react';
import { Row, Col, Layout, Typography, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { LoginForm } from '../components/LoginForm';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/app/hooks';
import { selectUser, selectIsAuthenticated } from '../authSlice';
import '../styles/auth.css';

const { Content, Header } = Layout;
const { Text } = Typography;

export const LoginPage: React.FC = () => {
  useTranslation();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  return (
    <Layout className="layout auth-layout">
      <Header className="auth-header">
        <div className="auth-header-left">
          <Typography.Title level={3} className="auth-header-title">
            Chữ ký số
          </Typography.Title>
        </div>
        <div className="auth-header-right">
          {isAuthenticated && user ? (
            <Space className="auth-user-info">
              <Avatar icon={<UserOutlined />} />
              <div className="auth-user-details">
                <Text strong className="auth-user-name">
                  {user.name || user.email}
                </Text>
                <Text type="secondary" className="auth-user-email">
                  {user.email}
                </Text>
              </div>
            </Space>
          ) : null}
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>
      </Header>
      <Content style={{ padding: '50px 0', position: 'relative', zIndex: 1 }}>
        <Row justify="center" align="middle" style={{ minHeight: '80vh' }}>
          <Col xs={22} sm={20} md={16} lg={10} xl={8}>
            <LoginForm />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};
