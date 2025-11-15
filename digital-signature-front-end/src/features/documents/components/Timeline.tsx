/**
 * Timeline Component
 * Display audit events for a document in newest-first order using Ant Design Timeline
 */

import React from 'react';
import { Timeline as AntTimeline, Tag, Typography, Space, Empty } from 'antd';
import {
  FileAddOutlined,
  EditOutlined,
  CheckCircleOutlined,
  SendOutlined,
  EyeOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { AuditEvent, EventType } from '../types';
import { formatTimestamp } from '@/shared/utils/formatters';

const { Text } = Typography;

type TimelineProps = {
  events: AuditEvent[];
  loading?: boolean;
}

/**
 * Get icon and color for each event type
 */
const getEventConfig = (eventType: EventType) => {
  const configs = {
    [EventType.Created]: {
      icon: <FileAddOutlined />,
      color: 'blue',
    },
    [EventType.Updated]: {
      icon: <EditOutlined />,
      color: 'default',
    },
    [EventType.FieldsPlaced]: {
      icon: <FileTextOutlined />,
      color: 'geekblue',
    },
    [EventType.InvitationsSent]: {
      icon: <SendOutlined />,
      color: 'cyan',
    },
    [EventType.Opened]: {
      icon: <EyeOutlined />,
      color: 'purple',
    },
    [EventType.Signed]: {
      icon: <CheckCircleOutlined />,
      color: 'green',
    },
    [EventType.Declined]: {
      icon: <CloseCircleOutlined />,
      color: 'red',
    },
    [EventType.Completed]: {
      icon: <CheckOutlined />,
      color: 'success',
    },
  };

  return configs[eventType] || { icon: <FileTextOutlined />, color: 'default' };
};

export const Timeline: React.FC<TimelineProps> = ({ events, loading }) => {
  const { t, i18n } = useTranslation('documents');

  // Events are already sorted newest-first from API
  // If not, sort them here
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (!loading && events.length === 0) {
    return (
      <Empty
        description={t('timeline.noEvents')}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  const timelineItems = sortedEvents.map((event) => {
    const { icon, color } = getEventConfig(event.eventType);

    return {
      key: event.id,
      dot: icon,
      color,
      children: (
        <Space direction="vertical" size={0}>
          <Space>
            <Tag color={color}>{t(`timeline.eventType.${event.eventType}`)}</Tag>
            {event.actorEmail && (
              <Text type="secondary">{event.actorEmail}</Text>
            )}
          </Space>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {formatTimestamp(event.timestamp, i18n.language as 'vi' | 'en')}
          </Text>
          {event.metadata && (
            <div style={{ marginTop: 4 }}>
              {event.metadata.signerName && (
                <Text>{t('timeline.signerName')}: {String(event.metadata.signerName)}</Text>
              )}
              {event.metadata.reason && (
                <Text>{t('timeline.reason')}: {String(event.metadata.reason)}</Text>
              )}
              {event.metadata.fieldCount && (
                <Text>{t('timeline.fieldCount')}: {String(event.metadata.fieldCount)}</Text>
              )}
            </div>
          )}
        </Space>
      ),
    };
  });

  return (
    <AntTimeline
      mode="left"
      items={timelineItems}
      pending={loading ? t('timeline.loading') : undefined}
    />
  );
};

