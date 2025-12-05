/**
 * FieldToolbar Component
 * Toolbar with field types for adding to document
 */

import React from 'react';
import { Card, Button, Space, Typography, Tooltip } from 'antd';
import { EditOutlined, FontSizeOutlined, CalendarOutlined, AlignLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { FieldType } from '../types';

const { Text } = Typography;

type FieldToolbarProps = {
  onFieldTypeSelect: (type: FieldType) => void;
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
  onFieldTypeSelect,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const fieldTypes = [
    { type: FieldType.Signature, label: t('documents.signature', 'Signature') },
  ];

  return (
    <Card title={t('documents.addFields', 'Add Fields')} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Text type="secondary">
          {t('documents.clickToAdd', 'Click a field type, then click on the document to place it')}
        </Text>
        
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {fieldTypes.map(({ type, label }) => {
            const Icon = FIELD_ICONS[type];
            return (
              <Tooltip key={type} title={label} placement="right">
                <Button
                  block
                  icon={<Icon />}
                  onClick={() => onFieldTypeSelect(type)}
                  disabled={disabled}
                  style={{
                    borderColor: FIELD_COLORS[type],
                    color: FIELD_COLORS[type],
                  }}
                >
                  {label}
                </Button>
              </Tooltip>
            );
          })}
        </Space>
      </Space>
    </Card>
  );
};

