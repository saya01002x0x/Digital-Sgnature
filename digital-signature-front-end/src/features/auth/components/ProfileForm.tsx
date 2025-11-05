/**
 * ProfileForm Component
 * Form for updating user profile information
 */

import React from 'react';
import { Form, Input, Button, Upload, Avatar, message } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { User, ProfileFormValues } from '../types/index';
import type { UploadProps } from 'antd';

type ProfileFormProps = {
  user: User;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(user.avatar);

  const handleSubmit = async (values: ProfileFormValues) => {
    try {
      await onSubmit({
        ...values,
        avatar: avatarUrl,
      });
      message.success(t('profile.updateSuccess', 'Profile updated successfully'));
    } catch (err) {
      message.error(t('profile.updateError', 'Failed to update profile'));
      console.error('Profile update error:', err);
    }
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    listType: 'picture',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error(t('profile.avatarTypeError', 'You can only upload image files!'));
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error(t('profile.avatarSizeError', 'Image must be smaller than 2MB!'));
        return false;
      }

      // Convert to base64 preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      return false; // Prevent auto upload
    },
    onRemove: () => {
      setAvatarUrl(undefined);
    },
  };

  return (
    <Form
      form={form}
      name="profile"
      initialValues={{
        name: user.name,
        email: user.email,
      }}
      onFinish={handleSubmit}
      layout="vertical"
      requiredMark={false}
    >
      <Form.Item label={t('profile.avatar', 'Avatar')}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar
            size={80}
            src={avatarUrl}
            icon={!avatarUrl && <UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          />
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>
              {t('profile.changeAvatar', 'Change Avatar')}
            </Button>
          </Upload>
        </div>
      </Form.Item>

      <Form.Item
        name="name"
        label={t('profile.name', 'Full Name')}
        rules={[
          { required: true, message: t('profile.nameRequired', 'Name is required') },
          { min: 2, message: t('profile.nameMin', 'Name must be at least 2 characters') },
        ]}
      >
        <Input
          prefix={<UserOutlined />}
          placeholder={t('profile.namePlaceholder', 'Enter your name')}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={t('profile.email', 'Email')}
      >
        <Input disabled prefix={<UserOutlined />} />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          size="large"
        >
          {t('profile.updateButton', 'Update Profile')}
        </Button>
      </Form.Item>
    </Form>
  );
};

