import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
  fullscreen?: boolean;
  className?: string;
}

/**
 * Reusable loading spinner component
 * Wraps Ant Design Spin with custom styling and i18n support
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'default',
  tip,
  fullscreen = false,
  className = '',
}) => {
  const { t } = useTranslation();

  const loadingIcon = <LoadingOutlined style={{ fontSize: size === 'large' ? 48 : size === 'small' ? 16 : 24 }} spin />;

  if (fullscreen) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50 ${className}`}
        role="status"
        aria-label={t('common.loading', 'Loading...')}
      >
        <Spin indicator={loadingIcon} size={size} tip={tip || t('common.loading', 'Loading...')} />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center p-8 ${className}`}
      role="status"
      aria-label={t('common.loading', 'Loading...')}
    >
      <Spin indicator={loadingIcon} size={size} tip={tip} />
    </div>
  );
};

