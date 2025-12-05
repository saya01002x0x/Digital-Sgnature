/**
 * FieldOverlay Component
 * Overlay for displaying and managing fields on PDF pages
 */

import React from 'react';
import { Button, Popconfirm, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
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
  fieldValues?: Record<string, string>; // For showing signature preview in signing view
  showDeleteButton?: boolean; // Control delete button visibility
}

export const FieldOverlay: React.FC<FieldOverlayProps> = ({
  fields,
  pageNumber,
  containerWidth,
  containerHeight,
  onFieldClick,
  onFieldDelete,
  selectedFieldId,
  fieldValues,
  showDeleteButton = true,
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
        const fieldValue = fieldValues?.[field.id];
        const hasSignature = fieldValue && fieldValue.length > 0;

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
              backgroundColor: hasSignature ? 'rgba(255, 255, 255, 0.95)' : `${color}20`,
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
              overflow: 'hidden',
              pointerEvents: 'auto',
            }}
            onClick={() => onFieldClick?.(field)}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              width: '100%',
              height: '100%',
              position: 'relative',
            }}>
              {hasSignature ? (
                // Show signature preview
                <img
                  src={fieldValue}
                  alt="Signature preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    padding: 4,
                  }}
                />
              ) : (
                // Show field label
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
              )}
              
              {/* Delete button - only show if enabled */}
              {showDeleteButton && onFieldDelete && (
                <Popconfirm
                  title={t('documents.deleteField', 'Delete this field?')}
                  onConfirm={() => {
                    onFieldDelete(field.id);
                  }}
                  okText={t('common.yes', 'Yes')}
                  cancelText={t('common.no', 'No')}
                >
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      minWidth: 'auto',
                      width: 24,
                      height: 24,
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #ff4d4f',
                      borderRadius: 4,
                      pointerEvents: 'auto',
                    }}
                  />
                </Popconfirm>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

