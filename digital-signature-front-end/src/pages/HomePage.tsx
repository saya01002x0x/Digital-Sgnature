import React from 'react';
import { Typography, Card, Space, message, Row, Col, Statistic, Progress, List, Tag } from 'antd';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLogoutMutation } from '@/features/auth/api';
import { logout, selectUser } from '@/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/app/config/constants';
import { STORAGE_KEYS } from '@/app/config/constants';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const { Title, Text } = Typography;

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [logoutApi, { isLoading }] = useLogoutMutation();

  const summaryStats = [
    { label: 'Tài liệu đã ký', value: 42, suffix: 'files' },
    { label: 'Chờ ký', value: 5, suffix: 'files' },
    { label: 'Liên hệ được mời', value: 12, suffix: 'users' },
  ];

  const recentDocuments = [
    { name: 'Hợp đồng dịch vụ ABC', status: 'signed', updatedAt: 'Hôm qua' },
    { name: 'Biên bản nghiệm thu', status: 'pending', updatedAt: '2 giờ trước' },
    { name: 'Đề nghị thanh toán', status: 'draft', updatedAt: '5 ngày trước' },
  ];

  const securityTips = [
    'Luôn xác minh nội dung trước khi ký tài liệu.',
    'Không chia sẻ mã OTP hoặc token cho bất kỳ ai.',
    'Bật thông báo để theo dõi thay đổi bất thường.',
  ];

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
      
      dispatch(logout());
      message.success('Đăng xuất thành công!');
      navigate(APP_ROUTES.LOGIN);
    } catch (error: any) {
      console.error('Logout error:', error);
      dispatch(logout());
      message.warning('Đã đăng xuất');
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <DashboardLayout user={user} onLogout={handleLogout} logoutLoading={isLoading}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card>
            <Title level={2}>Chào mừng đến với hệ thống Chữ ký số</Title>
            <Text>
              Bạn có thể quản lý tài liệu, ký số và theo dõi trạng thái công việc ngay tại đây.
            </Text>
          </Card>

          <Row gutter={[16, 16]}>
            {summaryStats.map((stat) => (
              <Col xs={24} sm={12} lg={8} key={stat.label}>
                <Card>
                  <Statistic title={stat.label} value={stat.value} suffix={stat.suffix} />
                </Card>
              </Col>
            ))}
            <Col xs={24} lg={8}>
              <Card>
                <Title level={5}>Dung lượng đã sử dụng</Title>
                <Progress percent={68} status="active" />
                <Text>34 / 50 MB</Text>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="Thông tin tài khoản">
                <Space direction="vertical">
                  <Text><strong>Tên đăng nhập:</strong> {user?.username || '—'}</Text>
                  <Text><strong>Email:</strong> {user?.email || '—'}</Text>
                  <Text><strong>Họ và tên:</strong> {user?.fullName || '—'}</Text>
                  <Text><strong>Vai trò:</strong> {user?.role?.toUpperCase() === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</Text>
                  {user?.phone && <Text><strong>Số điện thoại:</strong> {user.phone}</Text>}
                  {user?.address && <Text><strong>Địa chỉ:</strong> {user.address}</Text>}
                </Space>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Tài liệu gần đây">
                <List
                  dataSource={recentDocuments}
                  renderItem={(doc) => (
                    <List.Item>
                      <Space direction="vertical">
                        <Text strong>{doc.name}</Text>
                        <Space>
                          <Tag color={doc.status === 'signed' ? 'green' : doc.status === 'pending' ? 'orange' : 'blue'}>
                            {doc.status === 'signed' ? 'Đã ký' : doc.status === 'pending' ? 'Chờ ký' : 'Nháp'}
                          </Tag>
                          <Text type="secondary">{doc.updatedAt}</Text>
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Gợi ý bảo mật">
            <List
              dataSource={securityTips}
              renderItem={(tip) => (
                <List.Item>
                  <Text>{tip}</Text>
                </List.Item>
              )}
            />
          </Card>
      </Space>
    </DashboardLayout>
  );
};

