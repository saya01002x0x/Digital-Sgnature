/**
 * DocumentListPage Component
 * Page for listing and managing documents
 */

import React from 'react';
import { Typography, Space, Button, Card, Popconfirm } from 'antd';
import { PlusOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DocumentList } from '../components/DocumentList';
import { DocumentFilters } from '../components/DocumentFilters';
import { useDocuments } from '../hooks/useDocuments';

const { Title, Text } = Typography;

export const DocumentListPage: React.FC = () => {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();

  const {
    documents,
    total,
    isLoading,
    filters,
    handleFiltersChange,
    handleClearFilters,
    pagination,
    handlePageChange,
    handleDelete,
    isDeleting,
    refetch,
  } = useDocuments();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          padding: '16px 24px',
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              {t('listPage.title')}
            </Title>
            <Text type="secondary">
              {t('listPage.subtitle', { count: total })}
            </Text>
          </div>

          <Space>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              disabled={!filters.status && !filters.search}
            >
              {t('listPage.clearFilters')}
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              {t('listPage.refresh')}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/documents/editor/new')}
              size="large"
            >
              {t('listPage.createDocument')}
            </Button>
          </Space>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 24, background: '#fafafa' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {/* Filters */}
            <DocumentFilters value={filters} onChange={handleFiltersChange} />

            {/* Document List */}
            <Card>
              <DocumentList
                documents={documents}
                loading={isLoading || isDeleting}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={(id) => {
                  // Show confirmation dialog
                  const doc = documents.find((d) => d.id === id);
                  if (doc) {
                    // Use Ant Design Popconfirm (already handled in DocumentList)
                    handleDelete(id);
                  }
                }}
              />
            </Card>
          </Space>
        </div>
      </div>
    </div>
  );
};

