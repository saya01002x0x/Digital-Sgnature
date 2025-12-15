/**
 * DocumentList Component
 * Table display for documents with pagination
 */

import React from 'react';
import { Table, Button, Space, Typography, Empty, Popconfirm } from 'antd';
import type { TablePaginationConfig } from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  SendOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Document } from '../types';
import { DocumentStatus } from '../types';
import { StatusBadge } from './StatusBadge';

const { Text } = Typography;

type DocumentListProps = {
  documents: Document[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange?: (page: number, pageSize: number) => void;
  onDelete?: (id: string) => void;
};

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading = false,
  pagination,
  onPageChange,
  onDelete,
}) => {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();

  const columns = [
    {
      title: t('list.title'),
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
      render: (title: string, record: Document) => (
        <Space direction="vertical" size="small">
          <Text strong>{title}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('list.pages', { count: record.pageCount })}
          </Text>
        </Space>
      ),
    },
    {
      title: t('list.owner'),
      dataIndex: 'ownerName',
      key: 'owner',
      width: 150,
      render: (_: string, record: Document) => (
        <Text>
          {record.isOwner ? t('list.ownerMe') : (record.ownerName || 'N/A')}
        </Text>
      ),
    },
    {
      title: t('list.status'),
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status: DocumentStatus) => <StatusBadge status={status} />,
    },
    {
      title: t('list.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: t('list.updatedAt'),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: t('list.actions'),
      key: 'actions',
      width: 250,
      render: (_: any, record: Document) => (
        <Space>
          {/* View Details */}
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/documents/${record.id}`)}
            size="small"
          >
            {t('list.view')}
          </Button>

          {/* Edit (only for DRAFT) */}
          {record.status === DocumentStatus.Draft && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/documents/editor/${record.id}`)}
              size="small"
            >
              {t('list.edit')}
            </Button>
          )}

          {/* Invite Signers (only for DRAFT) */}
          {record.status === DocumentStatus.Draft && (
            <Button
              type="link"
              icon={<SendOutlined />}
              onClick={() => navigate(`/documents/${record.id}/invite`)}
              size="small"
            >
              {t('list.invite')}
            </Button>
          )}




          {/* Delete (only for DRAFT or DECLINED) */}
          {(record.status === DocumentStatus.Draft ||
            record.status === DocumentStatus.Declined) && (
              <Popconfirm
                title={t('list.deleteConfirm')}
                description={t('list.deleteDescription', { title: record.title })}
                onConfirm={() => onDelete?.(record.id)}
                okText={t('list.deleteYes')}
                cancelText={t('list.deleteNo')}
                okButtonProps={{ danger: true }}
              >
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  size="small"
                >
                  {t('list.delete')}
                </Button>
              </Popconfirm>
            )}
        </Space>
      ),
    },
  ];

  const paginationConfig: TablePaginationConfig | false = {
    pageSize: 10,
    hideOnSinglePage: true,
    showSizeChanger: false,
    showTotal: (total) => t('list.totalDocuments', { count: total }),
    style: {
      marginTop: 16,
      marginBottom: 0,
    },
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        dataSource={documents}
        columns={columns}
        loading={loading}
        pagination={paginationConfig}
        rowKey="id"
        scroll={{ x: 900 }}
        locale={{
          emptyText: (
            <Empty
              description={t('list.noDocuments')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </div>
  );
};

