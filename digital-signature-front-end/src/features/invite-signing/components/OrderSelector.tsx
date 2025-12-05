/**
 * OrderSelector Component
 * Radio selector for signing order (Sequential/Parallel)
 */

import React from 'react';
import { Radio, Space, Typography, Card } from 'antd';
import { OrderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { SigningOrder } from '../types';

const { Text, Paragraph } = Typography;

type OrderSelectorProps = {
  value?: SigningOrder;
  onChange?: (value: SigningOrder) => void;
};

export const OrderSelector: React.FC<OrderSelectorProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation('invite-signing');

  return (
    <Radio.Group
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={{ width: '100%' }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card
          hoverable
          style={{
            border: value === SigningOrder.SEQUENTIAL ? '2px solid #1890ff' : undefined,
          }}
        >
          <Radio value={SigningOrder.SEQUENTIAL}>
            <Space>
              <OrderedListOutlined style={{ fontSize: 20, color: '#1890ff' }} />
              <div>
                <Text strong>{t('orderSelector.sequential')}</Text>
                <Paragraph
                  type="secondary"
                  style={{ marginBottom: 0, fontSize: 12 }}
                >
                  {t('orderSelector.sequentialDescription')}
                </Paragraph>
              </div>
            </Space>
          </Radio>
        </Card>

        <Card
          hoverable
          style={{
            border: value === SigningOrder.PARALLEL ? '2px solid #1890ff' : undefined,
          }}
        >
          <Radio value={SigningOrder.PARALLEL}>
            <Space>
              <AppstoreOutlined style={{ fontSize: 20, color: '#52c41a' }} />
              <div>
                <Text strong>{t('orderSelector.parallel')}</Text>
                <Paragraph
                  type="secondary"
                  style={{ marginBottom: 0, fontSize: 12 }}
                >
                  {t('orderSelector.parallelDescription')}
                </Paragraph>
              </div>
            </Space>
          </Radio>
        </Card>
      </Space>
    </Radio.Group>
  );
};

