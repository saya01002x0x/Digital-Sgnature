import React, { ReactNode } from 'react';
import { Empty, Button } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
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
    <div className={`flex items-center justify-center min-h-[300px] ${className}`}>
      <Empty
        image={image || <FileTextOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
        imageStyle={{ height: 80 }}
        description={
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              {title || t('common.noData', 'No data available')}
            </p>
            {description && (
              <p className="text-sm text-gray-500">
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

