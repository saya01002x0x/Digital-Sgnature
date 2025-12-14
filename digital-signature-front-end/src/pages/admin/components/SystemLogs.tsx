import React, { useState } from 'react';
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  Spin,
  Alert,
  Typography,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import {
  useListAuditLogsQuery,
} from '@/features/admin/services/admin.api';
import type { AuditLog, AuditLogFilters } from '@/features/admin/types';
import { formatTimestamp } from '@/shared/utils/formatters';

const { RangePicker } = DatePicker;
const { Text } = Typography;

export const SystemLogs: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<AuditLogFilters>({
    search: undefined,
    action: undefined,
    targetType: undefined,
    performedBy: undefined,
    success: 'ALL',
    startDate: undefined,
    endDate: undefined,
  });

  const { data, isLoading, error, refetch } = useListAuditLogsQuery({
    page,
    size: pageSize,
    filters: {
      ...filters,
      startDate: filters.startDate
        ? dayjs(filters.startDate).startOf('day').toISOString()
        : undefined,
      endDate: filters.endDate
        ? dayjs(filters.endDate).endOf('day').toISOString()
        : undefined,
    },
  });

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value || undefined }));
    setPage(1);
  };

  const handleActionFilter = (action: string | undefined) => {
    setFilters((prev) => ({ ...prev, action }));
    setPage(1);
  };

  const handleTargetTypeFilter = (targetType: string | undefined) => {
    setFilters((prev) => ({ ...prev, targetType }));
    setPage(1);
  };

  const handleSuccessFilter = (success: boolean | 'ALL') => {
    setFilters((prev) => ({ ...prev, success }));
    setPage(1);
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0]!.toISOString(),
        endDate: dates[1]!.toISOString(),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: undefined,
        endDate: undefined,
      }));
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: undefined,
      action: undefined,
      targetType: undefined,
      performedBy: undefined,
      success: 'ALL',
      startDate: undefined,
      endDate: undefined,
    });
    setPage(1);
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: 'Thời gian',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => formatTimestamp(timestamp, 'vi'),
      sorter: true,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (action) => (
        <Tag color="blue" style={{ textTransform: 'capitalize' }}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Loại đối tượng',
      dataIndex: 'targetType',
      key: 'targetType',
      width: 120,
      render: (targetType) => (
        <Tag color="purple">{targetType || '-'}</Tag>
      ),
    },
    {
      title: 'Đối tượng',
      dataIndex: 'target',
      key: 'target',
      width: 200,
      render: (target) => (
        <Text ellipsis style={{ maxWidth: 200 }}>
          {target || '-'}
        </Text>
      ),
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'performedByName',
      key: 'performedBy',
      width: 150,
      render: (name, record) => name || record.performedBy || '-',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (description) => (
        <Text ellipsis style={{ maxWidth: 300 }}>
          {description || '-'}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'success',
      key: 'success',
      width: 100,
      render: (success) => (
        <Tag
          icon={success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          color={success ? 'success' : 'error'}
        >
          {success ? 'Thành công' : 'Thất bại'}
        </Tag>
      ),
    },
    {
      title: 'Lỗi',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      width: 200,
      render: (errorMessage, record) =>
        !record.success && errorMessage ? (
          <Text type="danger" ellipsis style={{ maxWidth: 200 }}>
            {errorMessage}
          </Text>
        ) : (
          '-'
        ),
    },
  ];

  if (error) {
    return (
      <Card title="Nhật ký hoạt động hệ thống">
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
    <Card
      title="Nhật ký hoạt động hệ thống"
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
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              allowClear
              onPressEnter={(e) => handleSearch(e.currentTarget.value)}
              onChange={(e) => {
                if (!e.target.value) handleSearch('');
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Hành động"
              allowClear
              value={filters.action}
              onChange={handleActionFilter}
            >
              <Select.Option value="CREATE">Tạo mới</Select.Option>
              <Select.Option value="UPDATE">Cập nhật</Select.Option>
              <Select.Option value="DELETE">Xóa</Select.Option>
              <Select.Option value="LOGIN">Đăng nhập</Select.Option>
              <Select.Option value="LOGOUT">Đăng xuất</Select.Option>
              <Select.Option value="VIEW">Xem</Select.Option>
              <Select.Option value="DOWNLOAD">Tải xuống</Select.Option>
              <Select.Option value="SIGN">Ký</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Loại đối tượng"
              allowClear
              value={filters.targetType}
              onChange={handleTargetTypeFilter}
            >
              <Select.Option value="USER">Người dùng</Select.Option>
              <Select.Option value="DOCUMENT">Tài liệu</Select.Option>
              <Select.Option value="SIGNATURE">Chữ ký</Select.Option>
              <Select.Option value="FIELD">Trường</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Trạng thái"
              value={filters.success}
              onChange={handleSuccessFilter}
            >
              <Select.Option value="ALL">Tất cả</Select.Option>
              <Select.Option value={true}>Thành công</Select.Option>
              <Select.Option value={false}>Thất bại</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={handleDateRangeChange}
              value={
                filters.startDate && filters.endDate
                  ? [dayjs(filters.startDate), dayjs(filters.endDate)]
                  : null
              }
            />
          </Col>
        </Row>

        <Button type="link" onClick={handleClearFilters}>
          Xóa bộ lọc
        </Button>

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
            showTotal: (total) => `Tổng cộng ${total} bản ghi`,
            onChange: (newPage, newPageSize) => {
              setPage(newPage);
              setPageSize(newPageSize);
            },
          }}
          scroll={{ x: 1400 }}
        />
      </Space>
    </Card>
  );
};
