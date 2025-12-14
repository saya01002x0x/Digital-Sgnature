/**
 * FieldAssignment Component
 * Assign fields to signers with color-coding
 */

import React from 'react';
import { Card, Select, Space, Typography, Tag, Alert, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Field } from '@/features/documents/types';
import { getFieldLabel } from '@/features/documents/utils/fieldHelpers';

const { Text } = Typography;
const { Option } = Select;

type FieldAssignmentProps = {
  fields: Field[];
  signers: { email: string; name: string; order: number }[];
  assignedFields: Record<string, string>; // fieldId -> signer email
  onAssign: (fieldId: string, signerEmail: string) => void;
  onUnassign?: (fieldId: string) => void;
};

// Color palette for signers
const SIGNER_COLORS = [
  '#1890ff', // blue
  '#52c41a', // green
  '#faad14', // yellow
  '#f5222d', // red
  '#722ed1', // purple
  '#13c2c2', // cyan
  '#eb2f96', // magenta
  '#fa8c16', // orange
];

export const FieldAssignment: React.FC<FieldAssignmentProps> = ({
  fields,
  signers,
  assignedFields,
  onAssign,
  onUnassign,
}) => {
  const { t } = useTranslation('invite-signing');

  // Get color for signer by index
  const getSignerColor = (email: string) => {
    const index = signers.findIndex((s) => s.email === email);
    return SIGNER_COLORS[index % SIGNER_COLORS.length];
  };

  // Get signer by email
  const getSignerByEmail = (email: string) => {
    return signers.find((s) => s.email === email);
  };

  // Check if all fields are assigned
  const allFieldsAssigned = fields.every((field) => assignedFields[field.id]);

  // Count assigned fields per signer
  const getAssignedCount = (email: string) => {
    return Object.values(assignedFields).filter((e) => e === email).length;
  };

  if (fields.length === 0) {
    return (
      <Empty
        description={t('fieldAssignment.noFields')}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Signers Legend */}
      <Card size="small" title={t('fieldAssignment.signersLegend')}>
        <Space wrap>
          {signers.map((signer, index) => (
            <Tag
              key={signer.email}
              color={SIGNER_COLORS[index % SIGNER_COLORS.length]}
              style={{ marginBottom: 8 }}
            >
              {signer.order}. {signer.name} ({getAssignedCount(signer.email)}{' '}
              {t('fieldAssignment.fields')})
            </Tag>
          ))}
        </Space>
      </Card>

      {/* Warning if not all fields assigned */}
      {!allFieldsAssigned && (
        <Alert
          message={t('fieldAssignment.warning')}
          description={t('fieldAssignment.warningDescription')}
          type="warning"
          showIcon
        />
      )}

      {/* Fields List */}
      <Card title={t('fieldAssignment.fieldsTitle')}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {fields.map((field) => {
            const assignedEmail = assignedFields[field.id];
            const assignedSigner = assignedEmail
              ? getSignerByEmail(assignedEmail)
              : null;

            return (
              <Card
                key={field.id}
                size="small"
                style={{
                  borderLeft: assignedEmail
                    ? `4px solid ${getSignerColor(assignedEmail)}`
                    : undefined,
                }}
              >
                <Space
                  direction="vertical"
                  style={{ width: '100%' }}
                  size="small"
                >
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <div>
                      <Text strong>{getFieldLabel(field.type)}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {t('fieldAssignment.fieldType')}: {field.type} |{' '}
                        {t('fieldAssignment.page')} {field.pageNumber}
                      </Text>
                    </div>
                    {field.isRequired && (
                      <Tag color="red">{t('fieldAssignment.required')}</Tag>
                    )}
                  </Space>

                  <Select
                    style={{ width: '100%' }}
                    placeholder={t('fieldAssignment.selectSigner')}
                    value={assignedEmail || undefined}
                    onChange={(email) => {
                      if (email) {
                        onAssign(field.id, email);
                      } else if (onUnassign) {
                        // Clear assignment if onUnassign is provided
                        onUnassign(field.id);
                      }
                    }}
                    allowClear
                    size="large"
                  >
                    {signers.map((signer, index) => (
                      <Option key={signer.email} value={signer.email}>
                        <Space>
                          <div
                            style={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor:
                                SIGNER_COLORS[index % SIGNER_COLORS.length],
                            }}
                          />
                          {signer.order}. {signer.name}
                        </Space>
                      </Option>
                    ))}
                  </Select>

                  {assignedSigner && (
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, fontStyle: 'italic' }}
                    >
                      {t('fieldAssignment.assignedTo', { name: assignedSigner.name })}
                    </Text>
                  )}
                </Space>
              </Card>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
};

