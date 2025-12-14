import React from 'react';
import { Row, Col, Card, Statistic, Spin, Alert } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useGetMetricsQuery } from '@/features/admin/services/admin.api';
import { formatNumber } from '@/shared/utils/formatters';

export const Overview: React.FC = () => {
  const { data, isLoading, error } = useGetMetricsQuery();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Không thể tải dữ liệu"
        description="Vui lòng thử lại sau"
        type="error"
        showIcon
      />
    );
  }

  return (
    <Card 
      title="Tổng quan hệ thống"
      style={{ marginTop: '24px', borderRadius: '8px' }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={data?.totalUsers ?? 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng hoạt động"
              value={data?.activeUsers ?? 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số tài liệu"
              value={data?.totalDocuments ?? 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
              formatter={(value) => formatNumber(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tài liệu đang chờ"
              value={data?.pendingDocuments ?? 0}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tài liệu đã hoàn thành"
              value={data?.completedDocuments ?? 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số chữ ký"
              value={data?.totalSignatures ?? 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
              formatter={(value) => formatNumber(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Người dùng không hoạt động"
              value={data?.inactiveUsers ?? 0}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );
};
