/**
 * HeroPage / LandingPage
 * Landing page for E-Signature platform
 * Using pure Ant Design components
 */

import type React from 'react';
import { Row, Col, Typography, Button, Space, Card } from 'antd';
import { FileTextOutlined, SafetyOutlined, ThunderboltOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/app/config/constants';

const { Title, Paragraph } = Typography;

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    {
      icon: <FileTextOutlined style={{ fontSize: 48 }} />,
      title: 'Ký số điện tử',
      description: 'Ký tài liệu nhanh chóng, an toàn và hiệu quả',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48 }} />,
      title: 'Bảo mật cao',
      description: 'Mã hóa end-to-end, đảm bảo tính bảo mật tuyệt đối',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 48 }} />,
      title: 'Xử lý nhanh',
      description: 'Hoàn thành quy trình ký trong vài giây',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 48 }} />,
      title: 'Mọi nơi, mọi lúc',
      description: 'Truy cập từ bất kỳ thiết bị nào, mọi lúc mọi nơi',
    },
  ];

  return (
    <div style={{ paddingTop: 48, paddingBottom: 48 }}>
      {/* Hero Section */}
      <Row justify="center" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Col xs={24} md={16} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={1}>
              Giải pháp ký số điện tử
            </Title>
            <Title level={2} type="secondary" style={{ fontWeight: 400 }}>
              Nhanh chóng, an toàn và dễ sử dụng
            </Title>
            <Paragraph type="secondary" style={{ fontSize: 18 }}>
              Nền tảng ký số hiện đại giúp bạn ký và quản lý tài liệu một cách chuyên nghiệp
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate(APP_ROUTES.REGISTER)}
              >
                {t('auth.register', 'Đăng ký ngay')}
              </Button>
              <Button 
                size="large"
                onClick={() => navigate(APP_ROUTES.LOGIN)}
              >
                {t('auth.login', 'Đăng nhập')}
              </Button>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Features Section */}
      <Row 
        gutter={[24, 24]} 
        justify="center" 
        style={{ padding: '48px 24px' }}
      >
        <Col xs={24} style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Tính năng nổi bật</Title>
          <Paragraph type="secondary">
            Những lý do khiến hàng nghìn người dùng tin tưởng lựa chọn chúng tôi
          </Paragraph>
        </Col>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {feature.icon}
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CTA Section */}
      <Row justify="center" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Col xs={24} md={16}>
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2}>Sẵn sàng bắt đầu?</Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Tham gia cùng hàng nghìn người dùng đang sử dụng giải pháp ký số của chúng tôi
              </Paragraph>
              <Button 
                type="primary" 
                size="large"
                onClick={() => navigate(APP_ROUTES.REGISTER)}
              >
                Đăng ký miễn phí
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

