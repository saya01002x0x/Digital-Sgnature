/**
 * SignerList Component
 * Display list of signers with their status and order
 */

import React from 'react';
import { List, Tag, Typography, Space, Avatar, Card } from 'antd';
import {
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Signer } from '../types';
import { SignerStatus } from '../types';

const { Text } = Typography;

type SignerListProps = {
  signers: Signer[];
  showStatus?: boolean;
  showOrder?: boolean;
};

export const SignerList: React.FC<SignerListProps> = ({
  signers,
  showStatus = true,
  showOrder = true,
}) => {
  const { t } = useTranslation('invite-signing');

  const getStatusTag = (status: SignerStatus) => {
    switch (status) {
      case SignerStatus.SIGNED:
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            {t('signerList.signed')}
          </Tag>
        );
      case SignerStatus.DECLINED:
        return (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            {t('signerList.declined')}
          </Tag>
        );
      case SignerStatus.PENDING:
      default:
        return (
          <Tag color="default" icon={<ClockCircleOutlined />}>
            {t('signerList.pending')}
          </Tag>
        );
    }
  };

  const getStatusColor = (status: SignerStatus) => {
    switch (status) {
      case SignerStatus.SIGNED:
        return '#52c41a';
      case SignerStatus.DECLINED:
        return '#ff4d4f';
      case SignerStatus.PENDING:
      default:
        return '#d9d9d9';
    }
  };

  return (
    <List
      dataSource={signers}
      renderItem={(signer) => (
        <Card
          style={{
            marginBottom: 12,
            borderLeft: `4px solid ${getStatusColor(signer.status)}`,
          }}
          size="small"
        >
          <List.Item
            key={signer.id}
            style={{ border: 'none', padding: 0 }}
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: getStatusColor(signer.status),
                  }}
                >
                  {showOrder && signer.order}
                </Avatar>
              }
              title={
                <Space>
                  <Text strong>{signer.name}</Text>
                  {showStatus && getStatusTag(signer.status)}
                </Space>
              }
              description={
                <Space direction="vertical" size="small">
                  <Space>
                    <MailOutlined />
                    <Text type="secondary">{signer.email}</Text>
                  </Space>
                  {showOrder && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t('signerList.order', { order: signer.order })}
                    </Text>
                  )}
                  {signer.signedAt && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t('signerList.signedAt', {
                        date: new Date(signer.signedAt).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {signer.declinedAt && (
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t('signerList.declinedAt', {
                        date: new Date(signer.declinedAt).toLocaleString(),
                      })}
                    </Text>
                  )}
                  {signer.declineReason && (
                    <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>
                      {t('signerList.reason')}: {signer.declineReason}
                    </Text>
                  )}
                </Space>
              }
            />
          </List.Item>
        </Card>
      )}
    />
  );
};

