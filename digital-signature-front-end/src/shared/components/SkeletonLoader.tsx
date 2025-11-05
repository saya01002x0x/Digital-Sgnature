import React from 'react';
import { Skeleton, SkeletonProps } from 'antd';

interface SkeletonLoaderProps extends SkeletonProps {
  type?: 'default' | 'card' | 'list' | 'form' | 'table';
  rows?: number;
}

/**
 * Wrapper around Ant Design Skeleton with preset types
 * Provides consistent loading states across the application
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'default',
  rows = 3,
  active = true,
  ...props
}) => {
  switch (type) {
    case 'card':
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <Skeleton active={active} avatar paragraph={{ rows: 2 }} {...props} />
        </div>
      );

    case 'list':
      return (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton.Avatar active={active} size="large" />
              <div className="flex-1">
                <Skeleton active={active} paragraph={{ rows: 1 }} title={false} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'form':
      return (
        <div className="space-y-6">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index}>
              <Skeleton.Input active={active} block style={{ marginBottom: 8, height: 14, width: 100 }} />
              <Skeleton.Input active={active} block style={{ height: 40 }} />
            </div>
          ))}
        </div>
      );

    case 'table':
      return (
        <div className="space-y-2">
          <Skeleton active={active} paragraph={false} />
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} active={active} title={false} paragraph={{ rows: 1 }} />
          ))}
        </div>
      );

    default:
      return <Skeleton active={active} paragraph={{ rows }} {...props} />;
  }
};

