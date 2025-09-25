import React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from 'antd';
import './App.css';

export const App: React.FC = () => {
  return (
    <Layout className="app-container">
      <Outlet />
    </Layout>
  );
};