import type React from 'react';
import { Layout, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Content } = Layout;
const { Title } = Typography;

export const UsersPage: React.FC = () => {
  useTranslation();
  
  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Title level={2}>Quản lý người dùng</Title>
        <p>Nội dung trang người dùng sẽ được hiển thị ở đây.</p>
      </Content>
    </Layout>
  );
};
