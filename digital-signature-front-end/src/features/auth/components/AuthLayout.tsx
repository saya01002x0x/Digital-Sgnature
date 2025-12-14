/**
 * AuthLayout Component
 * Layout for authentication pages (Login, Register)
 * Styled to match Hero section with glassmorphism effect
 * Using pure Ant Design components + Framer Motion
 */

import type React from 'react';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Paragraph } = Typography;

type AuthLayoutProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, description }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F0F5FF 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '40px 24px',
      }}
    >
      {/* Background Shapes - same as Hero */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-5%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(24,144,255,0.1) 0%, rgba(255,255,255,0) 70%)',
        borderRadius: '50%',
        zIndex: 0,
      }} />

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          zIndex: 0,
          width: 120,
          height: 120,
          background: 'linear-gradient(135deg, #FFD666 0%, #FFA940 100%)',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          opacity: 0.4,
          filter: 'blur(40px)'
        }}
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          zIndex: 0,
          width: 150,
          height: 150,
          background: 'linear-gradient(135deg, #69C0FF 0%, #1890FF 100%)',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          opacity: 0.4,
          filter: 'blur(40px)'
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: 440,
          zIndex: 1,
        }}
      >
        {/* Glassmorphism Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.1)',
            padding: '40px 32px',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img
              src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              alt="logo"
              style={{ height: 48, marginBottom: 16 }}
            />
            {title && (
              <Title level={2} style={{
                marginBottom: 8,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1F1F1F 0%, #434343 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {title}
              </Title>
            )}
            {description && (
              <Paragraph style={{ color: '#666', marginBottom: 0, fontSize: 15 }}>
                {description}
              </Paragraph>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </motion.div>
    </div>
  );
};
