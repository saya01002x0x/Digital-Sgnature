/**
 * HeroPage / LandingPage
 * Landing page for E-Signature platform
 * Using pure Ant Design components with Neon.com inspired layout
 */

import type React from 'react';
import { Row, Col, Typography, Button, Space, Card, Tag, Divider, Statistic } from 'antd';
import { 
  FileTextOutlined, 
  SafetyOutlined, 
  ThunderboltOutlined, 
  GlobalOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  CloudOutlined,
  ApiOutlined,
  LockOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { APP_ROUTES } from '@/app/config/constants';

const { Title, Paragraph, Text } = Typography;

export const HeroPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const trustedCompanies = [
    'Viettel', 'VNPT', 'FPT', 'VinGroup', 'Momo', 'Grab'
  ];

  const features = [
    {
      icon: <FileTextOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      title: 'Ký số điện tử',
      description: 'Ký tài liệu nhanh chóng, an toàn và hiệu quả với công nghệ mã hóa tiên tiến',
    },
    {
      icon: <SafetyOutlined style={{ fontSize: 48, color: '#52c41a' }} />,
      title: 'Bảo mật cao',
      description: 'Mã hóa end-to-end, đảm bảo tính bảo mật tuyệt đối cho mọi giao dịch',
    },
    {
      icon: <ThunderboltOutlined style={{ fontSize: 48, color: '#faad14' }} />,
      title: 'Xử lý nhanh',
      description: 'Hoàn thành quy trình ký trong vài giây, tiết kiệm thời gian tối đa',
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 48, color: '#722ed1' }} />,
      title: 'Mọi nơi, mọi lúc',
      description: 'Truy cập từ bất kỳ thiết bị nào, mọi lúc mọi nơi, mọi nền tảng',
    },
  ];

  const advancedFeatures = [
    {
      icon: <RocketOutlined />,
      title: 'Tạo chữ ký trong 300ms',
      description: 'Không cần chờ đợi. Không cần cấu hình phức tạp. Chỉ cần click và ký.',
      tag: 'Siêu nhanh'
    },
    {
      icon: <CloudOutlined />,
      title: 'Lưu trữ không giới hạn',
      description: 'Lưu trữ tài liệu an toàn trên cloud với khả năng mở rộng linh hoạt.',
      tag: 'Cloud Storage'
    },
    {
      icon: <ApiOutlined />,
      title: 'API & Tích hợp dễ dàng',
      description: 'Tích hợp vào hệ thống của bạn chỉ trong vài phút với API đơn giản.',
      tag: 'Developer Ready'
    },
  ];

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section with Gradient */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '120px 24px',
        position: 'relative'
      }}>
        <Row justify="center" style={{ textAlign: 'center' }}>
          <Col xs={24} md={20} lg={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Tag color="cyan" style={{ fontSize: 14, padding: '4px 16px', border: 'none' }}>
                🎉 Ra mắt tính năng ký số hàng loạt - Tiết kiệm 90% thời gian
              </Tag>
              <Title level={1} style={{ color: 'white', fontSize: 56, marginTop: 24, marginBottom: 16 }}>
                Ký số nhanh chóng<br/>với công nghệ hiện đại
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, marginBottom: 32 }}>
                Nền tảng ký số điện tử được tin dùng bởi hàng nghìn doanh nghiệp.<br/>
                Giúp bạn ký và quản lý tài liệu một cách chuyên nghiệp, bảo mật và nhanh chóng.
              </Paragraph>
              <Space size="large" wrap>
                <Button 
                  type="primary" 
                  size="large"
                  style={{ 
                    height: 48, 
                    fontSize: 16, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    fontWeight: 600
                  }}
                  onClick={() => navigate(APP_ROUTES.REGISTER)}
                >
                  Bắt đầu miễn phí
                </Button>
                <Button 
                  size="large"
                  style={{ 
                    height: 48, 
                    fontSize: 16, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    background: 'transparent',
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 600
                  }}
                  onClick={() => navigate(APP_ROUTES.LOGIN)}
                >
                  Đăng nhập
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Trusted By Section */}
      <div style={{ padding: '48px 24px', background: '#fafafa' }}>
        <Row justify="center">
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 2 }}>
              Được tin dùng bởi các doanh nghiệp hàng đầu
            </Text>
            <div style={{ marginTop: 32 }}>
              <Space size="large" wrap style={{ justifyContent: 'center' }}>
                {trustedCompanies.map((company, index) => (
                  <Tag key={index} style={{ 
                    fontSize: 16, 
                    padding: '8px 24px', 
                    border: 'none',
                    background: 'white',
                    color: '#666',
                    fontWeight: 600
                  }}>
                    {company}
                  </Tag>
                ))}
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Stats Section */}
      <div style={{ padding: '80px 24px' }}>
        <Row gutter={[48, 48]} justify="center">
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Statistic 
              title="Tài liệu đã ký" 
              value={1250000} 
              suffix="+"
              valueStyle={{ color: '#1890ff', fontSize: 42, fontWeight: 700 }}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Statistic 
              title="Người dùng" 
              value={50000} 
              suffix="+"
              valueStyle={{ color: '#52c41a', fontSize: 42, fontWeight: 700 }}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Statistic 
              title="Doanh nghiệp" 
              value={1200} 
              suffix="+"
              valueStyle={{ color: '#722ed1', fontSize: 42, fontWeight: 700 }}
            />
          </Col>
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Statistic 
              title="Thời gian ký TB" 
              value={2.3} 
              suffix="s"
              valueStyle={{ color: '#faad14', fontSize: 42, fontWeight: 700 }}
            />
          </Col>
        </Row>
      </div>

      {/* Instant Provisioning Section */}
      <div style={{ background: '#f0f2f5', padding: '80px 24px' }}>
        <Row justify="center" gutter={[48, 48]}>
          <Col xs={24} lg={10}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Tag color="green">⚡ Tức thì</Tag>
              <Title level={2} style={{ marginTop: 0 }}>
                Ký số tức thì.<br/>Không chờ đợi.
              </Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Chữ ký điện tử của bạn được tạo trong vòng chưa đầy 300ms. 
                Không cần cấu hình phức tạp, không cần chờ đợi.
              </Paragraph>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Tạo chữ ký ngay lập tức</Text>
                </Space>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Không cần cài đặt</Text>
                </Space>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>Tương thích mọi định dạng</Text>
                </Space>
              </Space>
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <Card style={{ background: '#1f1f1f', border: 'none' }}>
              <pre style={{ 
                color: '#52c41a', 
                margin: 0, 
                fontSize: 14,
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
{`import { DigitalSignature } from '@esign/sdk';

const signer = new DigitalSignature({
  apiKey: process.env.ESIGN_API_KEY
});

// Ký tài liệu chỉ trong 1 dòng code
const signed = await signer.sign({
  document: 'contract.pdf',
  certificate: 'my-cert.p12'
});

console.log('✓ Đã ký thành công:', signed.id);`}
              </pre>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Advanced Features Section */}
      <div style={{ padding: '80px 24px' }}>
        <Row justify="center" style={{ marginBottom: 64 }}>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Title level={2}>
              Tính năng tiên tiến.<br/>
              <Text type="secondary">Sẵn sàng ngay hôm nay.</Text>
            </Title>
          </Col>
        </Row>
        
        <Row gutter={[48, 48]} justify="center">
          {advancedFeatures.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card 
                bordered={false}
                style={{ 
                  height: '100%',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  borderRadius: 12
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    color: 'white'
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <Tag color="blue">{feature.tag}</Tag>
                    <Title level={4} style={{ marginTop: 12 }}>{feature.title}</Title>
                  </div>
                  <Paragraph type="secondary" style={{ fontSize: 15 }}>
                    {feature.description}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Features Grid Section */}
      <div style={{ background: '#f0f2f5', padding: '80px 24px' }}>
        <Row justify="center" style={{ marginBottom: 64 }}>
          <Col xs={24} style={{ textAlign: 'center' }}>
            <Title level={2}>Tính năng nổi bật</Title>
            <Paragraph type="secondary" style={{ fontSize: 16 }}>
              Nền tảng ký số hiện đại với đầy đủ tính năng cho doanh nghiệp
            </Paragraph>
          </Col>
        </Row>
        
        <Row gutter={[32, 32]} justify="center" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card 
                hoverable
                bordered={false}
                style={{ 
                  textAlign: 'center', 
                  height: '100%',
                  borderRadius: 12,
                  background: 'white'
                }}
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ marginBottom: 8 }}>
                    {feature.icon}
                  </div>
                  <Title level={4} style={{ marginBottom: 8 }}>{feature.title}</Title>
                  <Paragraph type="secondary">{feature.description}</Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Additional Features Section */}
      <div style={{ padding: '80px 24px' }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              border: 'none',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <LockOutlined style={{ fontSize: 80, marginBottom: 24 }} />
                <Title level={3} style={{ color: 'white' }}>
                  Bảo mật cấp ngân hàng
                </Title>
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large">
              <Title level={2}>
                Bảo mật tuyệt đối.<br/>
                <Text type="secondary">Cho mọi giao dịch.</Text>
              </Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Chúng tôi sử dụng mã hóa AES-256 và RSA-2048 để đảm bảo mọi tài liệu 
                của bạn được bảo vệ tuyệt đối. Tuân thủ ISO 27001 và SOC 2.
              </Paragraph>
              <Space direction="vertical">
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>Mã hóa end-to-end</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>Tuân thủ GDPR & ISO 27001</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>Audit log đầy đủ</Text></Space>
                <Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> <Text>2FA & SSO</Text></Space>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Performance Section */}
      <div style={{ background: '#f0f2f5', padding: '80px 24px' }}>
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <Space direction="vertical" size="large">
              <Title level={2}>
                Hàng nghìn tài liệu.<br/>
                <Text type="secondary">Zero overhead.</Text>
              </Title>
              <Paragraph type="secondary" style={{ fontSize: 16 }}>
                Xử lý hàng nghìn tài liệu mỗi ngày mà không cần lo lắng về hiệu năng. 
                API của chúng tôi được tối ưu để xử lý khối lượng lớn với độ trễ thấp.
              </Paragraph>
              <Space direction="vertical">
                <Space><ClockCircleOutlined style={{ color: '#1890ff' }} /> <Text strong>300ms</Text> <Text type="secondary">- Thời gian tạo chữ ký</Text></Space>
                <Space><ThunderboltOutlined style={{ color: '#faad14' }} /> <Text strong>99.9%</Text> <Text type="secondary">- Uptime SLA</Text></Space>
                <Space><ApiOutlined style={{ color: '#722ed1' }} /> <Text strong>1000+</Text> <Text type="secondary">- API calls/giây</Text></Space>
              </Space>
              <Button type="primary" size="large">
                Xem tài liệu API
              </Button>
            </Space>
          </Col>
          <Col xs={24} lg={12}>
            <Card style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <RocketOutlined style={{ fontSize: 80, marginBottom: 24 }} />
                <Title level={3} style={{ color: 'white' }}>
                  Hiệu năng vượt trội
                </Title>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Final CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '100px 24px',
        textAlign: 'center'
      }}>
        <Row justify="center">
          <Col xs={24} md={16}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={2} style={{ color: 'white', fontSize: 42 }}>
                Sẵn sàng bắt đầu?
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18 }}>
                Tham gia cùng hàng nghìn doanh nghiệp đang sử dụng giải pháp ký số của chúng tôi.<br/>
                Bắt đầu miễn phí, không cần thẻ tín dụng.
              </Paragraph>
              <Space size="large" wrap style={{ justifyContent: 'center' }}>
                <Button 
                  size="large"
                  style={{ 
                    height: 48, 
                    fontSize: 16, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    background: 'white',
                    color: '#667eea',
                    border: 'none',
                    fontWeight: 600
                  }}
                  onClick={() => navigate(APP_ROUTES.REGISTER)}
                >
                  Đăng ký miễn phí
                </Button>
                <Button 
                  size="large"
                  style={{ 
                    height: 48, 
                    fontSize: 16, 
                    paddingLeft: 32, 
                    paddingRight: 32,
                    background: 'transparent',
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 600
                  }}
                  onClick={() => navigate(APP_ROUTES.LOGIN)}
                >
                  Liên hệ Sales
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

