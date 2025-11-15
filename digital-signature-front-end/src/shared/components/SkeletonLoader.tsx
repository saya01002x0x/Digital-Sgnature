import type React from 'react';
import type { SkeletonProps } from 'antd';
import { Skeleton } from 'antd';

type SkeletonLoaderProps = {
  type?: 'default' | 'card' | 'list' | 'form' | 'table';
  rows?: number;
} & SkeletonProps

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
        <div style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
          <Skeleton active={active} avatar paragraph={{ rows: 2 }} {...props} />
        </div>
      );

    case 'list':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Skeleton.Avatar active={active} size="large" />
              <div style={{ flex: 1 }}>
                <Skeleton active={active} paragraph={{ rows: 1 }} title={false} />
              </div>
            </div>
          ))}
        </div>
      );

    case 'form':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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

