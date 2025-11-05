/**
 * AuthLayout Component
 * Layout for authentication pages (Login, Register)
 * Left: Form Card | Right: Image
 * Using pure Ant Design components
 */

import type React from 'react';
import { Row, Col, Card, Image } from 'antd';

type AuthLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  return (
    <Row style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Left Column - Form */}
      <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Card 
          style={{ width: '100%', maxWidth: 450 }}
          title={title}
        >
          {description && (
            <p style={{ marginBottom: 24, color: 'rgba(0, 0, 0, 0.45)' }}>
              {description}
            </p>
          )}
          {children}
        </Card>
      </Col>

      {/* Right Column - Image */}
      <Col xs={0} md={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
        <Image
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80"
          alt="E-Signature Platform"
          preview={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Col>
    </Row>
  );
};

