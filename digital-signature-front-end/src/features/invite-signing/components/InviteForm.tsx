/**
 * InviteForm Component
 * Form to add signers and configure signing order
 */

import React from 'react';
import { Form, Input, Button, Space, Typography, Card, message } from 'antd';
import { PlusOutlined, DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { InviteFormValues } from '../types';
import { SigningOrder } from '../types';
import { OrderSelector } from './OrderSelector';

const { Text } = Typography;

type InviteFormProps = {
  onSubmit: (values: InviteFormValues) => void;
  loading?: boolean;
  initialValues?: Partial<InviteFormValues>;
};

export const InviteForm: React.FC<InviteFormProps> = ({
  onSubmit,
  loading = false,
  initialValues,
}) => {
  const { t } = useTranslation('invite-signing');
  const { user } = useAuth();
  const [form] = Form.useForm<InviteFormValues>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Add order numbers based on array index
      const signersWithOrder = values.signers.map((signer, index) => ({
        ...signer,
        order: index + 1,
      }));

      onSubmit({
        ...values,
        signers: signersWithOrder,
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // Add current user as signer
  const handleAddMyself = () => {
    if (!user) {
      message.error(t('inviteForm.userNotFound', 'User not found'));
      return;
    }

    const signers = form.getFieldValue('signers') || [];
    const isAlreadyAdded = signers.some(
      (s: any) => s?.email === user.email
    );

    if (isAlreadyAdded) {
      message.warning(t('inviteForm.emailDuplicate'));
      return;
    }

    // Add user to signers list
    const newSigners = [...signers, { email: user.email, name: user.name }];
    form.setFieldsValue({ signers: newSigners });
    message.success(t('inviteForm.addedMyself', 'Added yourself to signers'));
  };

  // Validate unique emails
  const validateUniqueEmail = (_: any, value: string, index: number) => {
    const signers = form.getFieldValue('signers') || [];
    const duplicateIndex = signers.findIndex(
      (s: any, i: number) => i !== index && s?.email === value
    );

    if (duplicateIndex !== -1) {
      return Promise.reject(new Error(t('inviteForm.emailDuplicate')));
    }
    return Promise.resolve();
  };

  return (
    <Card>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          signingOrder: SigningOrder.SEQUENTIAL,
          signers: [{ email: '', name: '' }],
          ...initialValues,
        }}
        onFinish={handleSubmit}
      >
        {/* Signing Order Selector */}
        <Form.Item
          name="signingOrder"
          label={t('inviteForm.signingOrderLabel')}
          rules={[{ required: true }]}
        >
          <OrderSelector />
        </Form.Item>

        {/* Signers List */}
        <Form.Item label={t('inviteForm.signersLabel')}>
          <Form.List name="signers">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    size="small"
                    style={{ marginBottom: 16 }}
                    title={
                      <Space>
                        <Text strong>
                          {t('inviteForm.signerNumber', { number: index + 1 })}
                        </Text>
                      </Space>
                    }
                    extra={
                      fields.length > 1 ? (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                        >
                          {t('inviteForm.remove')}
                        </Button>
                      ) : null
                    }
                  >
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'name']}
                        rules={[
                          { required: true, message: t('inviteForm.nameRequired') },
                          { min: 2, message: t('inviteForm.nameMinLength') },
                          { max: 100, message: t('inviteForm.nameMaxLength') },
                        ]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input
                          placeholder={t('inviteForm.namePlaceholder')}
                          size="large"
                        />
                      </Form.Item>

                      <Form.Item
                        {...field}
                        name={[field.name, 'email']}
                        rules={[
                          { required: true, message: t('inviteForm.emailRequired') },
                          { type: 'email', message: t('inviteForm.emailInvalid') },
                          {
                            validator: (_, value) =>
                              validateUniqueEmail(_, value, field.name),
                          },
                        ]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input
                          placeholder={t('inviteForm.emailPlaceholder')}
                          size="large"
                          type="email"
                        />
                      </Form.Item>
                    </Space>
                  </Card>
                ))}

                <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    size="large"
                  >
                    {t('inviteForm.addSigner')}
                  </Button>
                  <Button
                    type="default"
                    onClick={handleAddMyself}
                    block
                    icon={<UserAddOutlined />}
                    size="large"
                  >
                    {t('inviteForm.addMyself')}
                  </Button>
                </Space>
              </>
            )}
          </Form.List>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            block
          >
            {t('inviteForm.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

