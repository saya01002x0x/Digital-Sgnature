/**
 * SignatureSelector Component
 * Component for selecting from saved signatures
 */

import React from 'react';
import { Select, Spin, Typography, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useListSignaturesQuery } from '../services/signature.api';
import type { Signature } from '../types';

const { Text } = Typography;

type SignatureSelectorProps = {
  value?: string;
  onChange?: (signatureId: string, signature?: Signature) => void;
  placeholder?: string;
  allowClear?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

export const SignatureSelector: React.FC<SignatureSelectorProps> = ({
  value,
  onChange,
  placeholder,
  allowClear = true,
  size = 'middle',
  style,
}) => {
  const { t } = useTranslation();
  const { data: signatures = [], isLoading } = useListSignaturesQuery();

  const handleChange = (signatureId: string | undefined) => {
    if (!signatureId) {
      onChange?.('', undefined);
      return;
    }

    const signature = signatures.find(s => s.id === signatureId);
    onChange?.(signatureId, signature);
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      placeholder={placeholder || t('signature.selectSignature', 'Select a signature')}
      allowClear={allowClear}
      size={size}
      style={{ width: '100%', ...style }}
      notFoundContent={isLoading ? <Spin size="small" /> : t('signature.noSignaturesFound', 'No signatures found')}
      loading={isLoading}
      options={signatures.map(signature => ({
        value: signature.id,
        label: (
          <Space>
            <span>{signature.name || `${t('signature.signature', 'Signature')} - ${signature.type}`}</span>
            {signature.isDefault && (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            )}
          </Space>
        ),
      }))}
      optionRender={(option) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div>{signatures.find(s => s.id === option.value)?.name || option.label}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {signatures.find(s => s.id === option.value)?.type}
            </Text>
          </div>
          {signatures.find(s => s.id === option.value)?.isDefault && (
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
          )}
        </div>
      )}
    />
  );
};

