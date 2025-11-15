/**
 * FieldOverlay Component
 * Overlay for displaying and managing fields on PDF pages
 */

import React from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import { DeleteOutlined, DragOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { Field } from '../types';
import { getFieldColor, getFieldLabel, percentToPixel } from '../utils/fieldHelpers';

const { Text } = Typography;

type FieldOverlayProps = {
  fields: Field[];
  pageNumber: number;
  containerWidth: number;
  containerHeight: number;
  onFieldClick?: (field: Field) => void;
  onFieldDelete?: (fieldId: string) => void;
  selectedFieldId?: string;
}

export const FieldOverlay: React.FC<FieldOverlayProps> = ({
  fields,
  pageNumber,
  containerWidth,
  containerHeight,
  onFieldClick,
  onFieldDelete,
  selectedFieldId,
}) => {
  const { t } = useTranslation();

  const pageFields = fields.filter(f => f.pageNumber === pageNumber);

  if (pageFields.length === 0) {
    return null;
  }

  return (
    <>
      {pageFields.map((field) => {
        const left = percentToPixel(field.positionX, containerWidth);
        const top = percentToPixel(field.positionY, containerHeight);
        const width = percentToPixel(field.width, containerWidth);
        const height = percentToPixel(field.height, containerHeight);
        const isSelected = field.id === selectedFieldId;
        const color = getFieldColor(field.type);

        return (
          <div
            key={field.id}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              border: `2px ${isSelected ? 'solid' : 'dashed'} ${color}`,
              backgroundColor: `${color}20`,
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onClick={() => onFieldClick?.(field)}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
            }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color,
                  textAlign: 'center',
                }}
              >
                {getFieldLabel(field.type)}
              </Text>
              {isSelected && (
                <Popconfirm
                  title={t('documents.deleteField', 'Delete this field?')}
                  onConfirm={() => onFieldDelete?.(field.id)}
                  okText={t('common.yes', 'Yes')}
                  cancelText={t('common.no', 'No')}
                >
                  <Button
                    type="primary"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t('common.delete', 'Delete')}
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

