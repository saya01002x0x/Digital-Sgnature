import type React from 'react';
import { Card, Space, Button, Input, ColorPicker, Typography, Divider, Row, Col } from 'antd';
import { useTheme } from '@/app/providers/ThemeProvider';
import type { Color } from 'antd/es/color-picker';

const { Title, Paragraph, Text } = Typography;

/**
 * Theme Demo component
 * Showcases dynamic theme customization capabilities
 * Following Ant Design customize-theme best practices
 * @see https://ant.design/docs/react/customize-theme
 */
export const ThemeDemo: React.FC = () => {
  const { themeMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();

  const handleColorChange = (color: Color) => {
    setPrimaryColor(color.toHexString());
  };

  return (
    <Card title="Theme Customization Demo" style={{ maxWidth: 800, margin: '24px auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Theme Mode Section */}
        <div>
          <Title level={5}>Theme Mode</Title>
          <Paragraph type="secondary">
            Current theme: <Text strong>{themeMode === 'dark' ? 'Dark' : 'Light'}</Text>
          </Paragraph>
          <Button onClick={toggleTheme}>
            Switch to {themeMode === 'dark' ? 'Light' : 'Dark'} Mode
          </Button>
        </div>

        <Divider />

        {/* Primary Color Section */}
        <div>
          <Title level={5}>Primary Color</Title>
          <Paragraph type="secondary">
            Customize your brand color dynamically
          </Paragraph>
          <Space>
            <ColorPicker 
              value={primaryColor} 
              onChange={handleColorChange}
              showText
            />
            <Text type="secondary">Current: {primaryColor}</Text>
          </Space>
        </div>

        <Divider />

        {/* Component Preview */}
        <div>
          <Title level={5}>Component Preview</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button type="primary" block>Primary Button</Button>
                <Button block>Default Button</Button>
                <Button type="dashed" block>Dashed Button</Button>
              </Space>
            </Col>
            <Col xs={24} sm={12}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input placeholder="Input field" />
                <Input.Search placeholder="Search field" />
                <Input.TextArea placeholder="Textarea" rows={2} />
              </Space>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Quick Presets */}
        <div>
          <Title level={5}>Quick Presets</Title>
          <Space wrap>
            <Button 
              size="small" 
              onClick={() => setPrimaryColor('#1890ff')}
              style={{ background: '#1890ff', color: 'white' }}
            >
              Ant Design Blue
            </Button>
            <Button 
              size="small"
              onClick={() => setPrimaryColor('#00b96b')}
              style={{ background: '#00b96b', color: 'white' }}
            >
              Green
            </Button>
            <Button 
              size="small"
              onClick={() => setPrimaryColor('#722ed1')}
              style={{ background: '#722ed1', color: 'white' }}
            >
              Purple
            </Button>
            <Button 
              size="small"
              onClick={() => setPrimaryColor('#eb2f96')}
              style={{ background: '#eb2f96', color: 'white' }}
            >
              Magenta
            </Button>
            <Button 
              size="small"
              onClick={() => setPrimaryColor('#fa8c16')}
              style={{ background: '#fa8c16', color: 'white' }}
            >
              Orange
            </Button>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

