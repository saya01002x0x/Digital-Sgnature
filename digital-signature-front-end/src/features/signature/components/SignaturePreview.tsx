/**
 * SignaturePreview Component
 * Component for displaying signature images
 */

import React from 'react';
import { Card, Empty, Typography, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Signature } from '../types';

const { Text } = Typography;

type SignaturePreviewProps = {
  signature?: Signature | null;
  showMeta?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  signature,
  showMeta = false,
  size = 'medium',
  style,
}) => {
  const { t } = useTranslation();

  const sizeMap = {
    small: { height: 80, padding: 12 },
    medium: { height: 120, padding: 16 },
    large: { height: 160, padding: 20 },
  };

  const { height, padding } = sizeMap[size];

  if (!signature) {
    return (
      <Card style={style}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('signature.noSignature', 'No signature')}
        />
      </Card>
    );
  }

  return (
    <Card style={style}>
      {showMeta && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            {signature.name && <Text strong>{signature.name}</Text>}
            {signature.isDefault && (
              <Tag icon={<CheckCircleOutlined />} color="success">
                {t('signature.default', 'Default')}
              </Tag>
            )}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('signature.type', 'Type')}: {signature.type}
          </Text>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
          border: '1px solid #d9d9d9',
          borderRadius: 4,
          padding,
          minHeight: height,
        }}
      >
        <img
          src={signature.imageData}
          alt={signature.name || 'Signature'}
          style={{
            maxWidth: '100%',
            maxHeight: height,
            objectFit: 'contain',
          }}
        />
      </div>
    </Card>
  );
};

