import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  Switch,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
  Avatar,
  Typography,
  Row,
  Col,
  Spin,
  Alert,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  EditOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  useListUsersAdminQuery,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
  useGetUserAdminQuery,
} from '@/features/admin/services/admin.api';
import type { UserAdmin, UserFilters } from '@/features/admin/types';
import { formatTimestamp } from '@/shared/utils/formatters';

const { Text } = Typography;

export const UsersPanel: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({
    search: undefined,
    role: 'ALL',
    isActive: 'ALL',
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, error, refetch } = useListUsersAdminQuery({
    page,
    size: pageSize,
    filters,
  });

  const [updateUserStatus, { isLoading: isUpdatingStatus }] =
    useUpdateUserStatusMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value || undefined }));
    setPage(1);
  };

  const handleRoleFilter = (role: 'ADMIN' | 'USER' | 'ALL') => {
    setFilters((prev) => ({ ...prev, role }));
    setPage(1);
  };

  const handleStatusFilter = (isActive: boolean | 'ALL') => {
    setFilters((prev) => ({ ...prev, isActive }));
    setPage(1);
  };

  const handleToggleStatus = async (user: UserAdmin) => {
    try {
      await updateUserStatus({
        userId: user.id,
        isActive: !user.isActive,
      }).unwrap();
      message.success(
        `Đã ${user.isActive ? 'vô hiệu hóa' : 'kích hoạt'} người dùng thành công`
      );
    } catch (error: any) {
      message.error(
        error?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái'
      );
    }
  };

  const handleEdit = (user: UserAdmin) => {
    setSelectedUser(user);
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
      address: user.address,
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const values = await form.validateFields();
      await updateUser({
        userId: selectedUser.id,
        ...values,
      }).unwrap();
      message.success('Cập nhật thông tin người dùng thành công');
      setEditModalVisible(false);
      setSelectedUser(null);
      form.resetFields();
    } catch (error: any) {
      if (error?.data?.errors) {
        // Validation errors
        message.error('Vui lòng kiểm tra lại thông tin');
      } else {
        message.error(error?.data?.message || 'Có lỗi xảy ra khi cập nhật');
      }
    }
  };

  const columns: ColumnsType<UserAdmin> = [
    {
      title: 'Người dùng',
      key: 'user',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar
            src={record.avatar}
            icon={<UserOutlined />}
            size="small"
          />
          <div>
            <div>{record.fullName}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              @{record.username}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone) => phone || '-',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
          {role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record)}
          loading={isUpdatingStatus}
          checkedChildren="Hoạt động"
          unCheckedChildren="Vô hiệu"
        />
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date) => formatTimestamp(date, 'vi'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Chỉnh sửa
        </Button>
      ),
    },
  ];

  if (error) {
    return (
      <Card title="Quản lý người dùng">
        <Alert
          message="Không thể tải dữ liệu"
          description="Vui lòng thử lại sau"
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Thử lại
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <>
      <Card
        title="Quản lý người dùng"
        style={{ marginTop: '24px', borderRadius: '8px' }}
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Làm mới
          </Button>
        }
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {/* Filters */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Input
                placeholder="Tìm kiếm theo tên, email, username..."
                prefix={<SearchOutlined />}
                allowClear
                onPressEnter={(e) => handleSearch(e.currentTarget.value)}
                onChange={(e) => {
                  if (!e.target.value) handleSearch('');
                }}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo vai trò"
                value={filters.role}
                onChange={handleRoleFilter}
              >
                <Select.Option value="ALL">Tất cả vai trò</Select.Option>
                <Select.Option value="ADMIN">Quản trị viên</Select.Option>
                <Select.Option value="USER">Người dùng</Select.Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: '100%' }}
                placeholder="Lọc theo trạng thái"
                value={filters.isActive}
                onChange={handleStatusFilter}
              >
                <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                <Select.Option value={true}>Hoạt động</Select.Option>
                <Select.Option value={false}>Vô hiệu</Select.Option>
              </Select>
            </Col>
          </Row>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={data?.data || []}
            rowKey="id"
            loading={isLoading}
            pagination={{
              current: page,
              pageSize,
              total: data?.meta?.totalItems || 0,
              showSizeChanger: true,
              showTotal: (total) => `Tổng cộng ${total} người dùng`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                setPageSize(newPageSize);
              },
            }}
            scroll={{ x: 1000 }}
          />
        </Space>
      </Card>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin người dùng"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
          form.resetFields();
        }}
        confirmLoading={isUpdating}
        okText="Lưu"
        cancelText="Hủy"
      >
        {selectedUser && (
          <Form form={form} layout="vertical">
            <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea rows={3} />
            </Form.Item>
            <div>
              <Text type="secondary">Email: {selectedUser.email}</Text>
              <br />
              <Text type="secondary">Vai trò: {selectedUser.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</Text>
            </div>
          </Form>
        )}
      </Modal>
    </>
  );
};
