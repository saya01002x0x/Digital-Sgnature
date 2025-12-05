/**
 * DeclineDialog Component
 * Modal dialog for declining to sign a document
 */

import React from 'react';
import { Modal, Form, Input, Typography, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import type { DeclineFormValues } from '../types';

const { TextArea } = Input;
const { Text } = Typography;

type DeclineDialogProps = {
  visible: boolean;
  loading: boolean;
  onSubmit: (values: DeclineFormValues) => void;
  onCancel: () => void;
};

export const DeclineDialog: React.FC<DeclineDialogProps> = ({
  visible,
  loading,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('invite-signing');
  const [form] = Form.useForm<DeclineFormValues>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={t('declineDialog.title')}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={t('declineDialog.confirm')}
      cancelText={t('declineDialog.cancel')}
      okButtonProps={{ danger: true, loading }}
      confirmLoading={loading}
    >
      <Alert
        message={t('declineDialog.warning')}
        description={t('declineDialog.warningDescription')}
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        name="decline-form"
      >
        <Form.Item
          name="reason"
          label={t('declineDialog.reasonLabel')}
          rules={[
            { required: true, message: t('declineDialog.reasonRequired') },
            { min: 10, message: t('declineDialog.reasonMinLength') },
            { max: 500, message: t('declineDialog.reasonMaxLength') },
          ]}
        >
          <TextArea
            rows={4}
            placeholder={t('declineDialog.reasonPlaceholder')}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('declineDialog.note')}
        </Text>
      </Form>
    </Modal>
  );
};

