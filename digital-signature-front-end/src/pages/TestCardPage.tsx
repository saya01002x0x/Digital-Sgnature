/**
 * TestCardPage
 * Demo page for testing Card with Form
 */

import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, DatePicker, Checkbox, Row, Col, Space, Typography, message, Modal } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;
const { TextArea } = Input;

export const TestCardPage: React.FC = () => {
  const { t } = useTranslation('auth');
  const [form] = Form.useForm();
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    message.success('Form submitted successfully!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setTermsModalVisible(true);
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <Title level={2}>Test Card với Form</Title>
              <Text type="secondary">Demo Ant Design Form trong Card</Text>
            </div>

            {/* Main Card */}
            <Card
              title="User Registration Form"
              bordered={false}
              style={{
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <Form
                form={form}
                name="test-form"
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                initialValues={{
                  remember: true,
                  gender: 'male',
                }}
              >
                {/* Name */}
                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[
                    { required: true, message: 'Please input your name!' },
                    { min: 2, message: 'Name must be at least 2 characters' },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter your full name"
                    size="large"
                  />
                </Form.Item>

                {/* Email */}
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="your@email.com"
                    size="large"
                  />
                </Form.Item>

                {/* Phone */}
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[
                    { required: true, message: 'Please input your phone!' },
                    { pattern: /^[0-9]{10}$/, message: 'Phone must be 10 digits' },
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="0123456789"
                    size="large"
                  />
                </Form.Item>

                {/* Row with 2 columns */}
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Gender"
                      name="gender"
                      rules={[{ required: true, message: 'Please select gender!' }]}
                    >
                      <Select size="large" placeholder="Select gender">
                        <Select.Option value="male">Male</Select.Option>
                        <Select.Option value="female">Female</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Date of Birth"
                      name="dob"
                      rules={[{ required: true, message: 'Please select date!' }]}
                    >
                      <DatePicker
                        size="large"
                        style={{ width: '100%' }}
                        placeholder="Select date"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Password */}
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: 'Please input password!' },
                    { min: 6, message: 'Password must be at least 6 characters' },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter password"
                    size="large"
                  />
                </Form.Item>

                {/* Confirm Password */}
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Confirm password"
                    size="large"
                  />
                </Form.Item>

                {/* Address */}
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: false }]}
                >
                  <TextArea
                    rows={3}
                    placeholder="Enter your address"
                  />
                </Form.Item>

                {/* Checkbox */}
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error(t('termsRequired'))),
                    },
                  ]}
                >
                  <Checkbox>
                    {t('agreeToTerms')}{' '}
                    <a href="#" onClick={handleTermsClick}>
                      {t('termsAndConditions')}
                    </a>
                  </Checkbox>
                </Form.Item>

                {/* Buttons */}
                <Form.Item>
                  <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={() => form.resetFields()}>
                      Reset
                    </Button>
                    <Button type="primary" htmlType="submit" size="large">
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>

            {/* Additional Card */}
            <Card
              title="Form Data Preview"
              bordered={false}
              style={{
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
              }}
            >
              <Text type="secondary">
                Submit the form to see the data in console. Check browser DevTools → Console tab.
              </Text>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Terms and Conditions Modal */}
      <Modal
        title={t('termsModal.title')}
        open={termsModalVisible}
        onCancel={() => setTermsModalVisible(false)}
        footer={[
          <Button key="accept" type="primary" onClick={() => {
            form.setFieldsValue({ remember: true });
            setTermsModalVisible(false);
          }}>
            {t('termsModal.acceptButton')}
          </Button>
        ]}
        width={700}
      >
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '16px',
            background: '#fafafa',
            borderRadius: '8px',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.8',
            fontSize: '14px'
          }}
        >
          {t('termsModal.content')}
        </div>
      </Modal>
    </div>
  );
};
