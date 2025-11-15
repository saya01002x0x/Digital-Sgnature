import type { ReactNode } from 'react';
import type React from 'react';
import { Empty, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

type EmptyStateProps = {
  image?: ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Empty state placeholder component
 * Displays when there's no data to show
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
      <Empty
        image={image || <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
        imageStyle={{ height: 80 }}
        description={
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 500, color: '#262626', marginBottom: 8 }}>
              {title || t('common.noData', 'No data available')}
            </p>
            {description && (
              <p style={{ fontSize: 14, color: '#8c8c8c' }}>
                {description}
              </p>
            )}
          </div>
        }
      >
        {actionLabel && onAction && (
          <Button type="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Empty>
    </div>
  );
};

