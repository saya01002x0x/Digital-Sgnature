/**
 * FieldToolbar Component
 * Toolbar with draggable field types for adding to document
 */

import React from 'react';
import { Card, Typography, Tooltip, Space } from 'antd';
import { EditOutlined, FontSizeOutlined, CalendarOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FieldType } from '../types';

const { Text } = Typography;

type FieldToolbarProps = {
  onFieldDragStart: (type: FieldType) => void;
  onFieldDragEnd: () => void;
  disabled?: boolean;
}

const FIELD_ICONS = {
  [FieldType.Signature]: EditOutlined,
  [FieldType.Initials]: FontSizeOutlined,
  [FieldType.Date]: CalendarOutlined,
  [FieldType.Text]: AlignLeftOutlined,
};

const FIELD_COLORS = {
  [FieldType.Signature]: '#1890ff',
  [FieldType.Initials]: '#52c41a',
  [FieldType.Date]: '#fa8c16',
  [FieldType.Text]: '#722ed1',
};

export const FieldToolbar: React.FC<FieldToolbarProps> = ({
  onFieldDragStart,
  onFieldDragEnd,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const fieldTypes = [
    { type: FieldType.Signature, label: t('documents.signature', 'Chữ ký') },
  ];

  return (
    <Card title={t('documents.addFields', 'Thêm trường ký')} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('documents.dragToDocument', 'Kéo thả vào tài liệu để đặt trường ký')}
        </Text>

        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {fieldTypes.map(({ type, label }) => {
            const Icon = FIELD_ICONS[type];
            const color = FIELD_COLORS[type];

            return (
              <Tooltip key={type} title={t('documents.dragToPlace', 'Kéo vào tài liệu')} placement="right">
                <div
                  draggable={!disabled}
                  onDragStart={() => onFieldDragStart(type)}
                  onDragEnd={onFieldDragEnd}
                  style={{
                    width: '100%',
                    height: 150, // Match SignatureListPage preview size
                    border: `2px dashed ${color}`,
                    borderRadius: 8,
                    backgroundColor: `${color}10`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: disabled ? 'not-allowed' : 'grab',
                    opacity: disabled ? 0.5 : 1,
                    transition: 'all 0.2s',
                    userSelect: 'none',
                  }}
                  onMouseOver={(e) => {
                    if (!disabled) {
                      e.currentTarget.style.borderStyle = 'solid';
                      e.currentTarget.style.backgroundColor = `${color}20`;
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderStyle = 'dashed';
                    e.currentTarget.style.backgroundColor = `${color}10`;
                  }}
                >
                  <Icon style={{ fontSize: 32, color, marginBottom: 8 }} />
                  <Text style={{ color, fontWeight: 500 }}>{label}</Text>
                  <Text type="secondary" style={{ fontSize: 11, marginTop: 4 }}>
                    {t('documents.dragMe', 'Kéo tôi vào tài liệu')}
                  </Text>
                </div>
              </Tooltip>
            );
          })}
        </Space>
      </Space>
    </Card>
  );
};
