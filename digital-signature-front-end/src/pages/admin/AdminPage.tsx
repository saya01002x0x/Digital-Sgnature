import React, { useState } from 'react';
import { Tabs, Card } from 'antd';
import { BarChartOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import { Overview } from './components/Overview';
import { UsersPanel } from './components/UsersPanel';
import { SystemLogs } from './components/SystemLogs';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          Tổng quan
        </span>
      ),
      children: <Overview />,
    },
    {
      key: 'users',
      label: (
        <span>
          <TeamOutlined />
          Quản lý người dùng
        </span>
      ),
      children: <UsersPanel />,
    },
    {
      key: 'logs',
      label: (
        <span>
          <FileTextOutlined />
          Nhật ký hoạt động
        </span>
      ),
      children: <SystemLogs />,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: 'calc(100vh - 80px)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          style={{
            backgroundColor: '#fff',
            padding: '0 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        />
      </div>
    </div>
  );
};

export default AdminPage;
