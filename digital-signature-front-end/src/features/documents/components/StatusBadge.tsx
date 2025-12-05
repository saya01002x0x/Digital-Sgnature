/**
 * StatusBadge Component
 * Color-coded badge for document status
 */

import React from 'react';
import { Tag } from 'antd';
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DocumentStatus } from '../types';

type StatusBadgeProps = {
  status: DocumentStatus;
  size?: 'small' | 'default';
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'default',
}) => {
  const { t } = useTranslation('documents');

  const getStatusConfig = () => {
    switch (status) {
      case DocumentStatus.Draft:
        return {
          color: 'default',
          icon: <FileTextOutlined />,
          label: t('status.draft'),
        };
      case DocumentStatus.Signing:
        return {
          color: 'processing',
          icon: <ClockCircleOutlined />,
          label: t('status.signing'),
        };
      case DocumentStatus.Done:
        return {
          color: 'success',
          icon: <CheckCircleOutlined />,
          label: t('status.done'),
        };
      case DocumentStatus.Declined:
        return {
          color: 'error',
          icon: <CloseCircleOutlined />,
          label: t('status.declined'),
        };
      default:
        return {
          color: 'default',
          icon: <FileTextOutlined />,
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Tag
      color={config.color}
      icon={config.icon}
      style={{ fontSize: size === 'small' ? 12 : 14 }}
    >
      {config.label}
    </Tag>
  );
};

