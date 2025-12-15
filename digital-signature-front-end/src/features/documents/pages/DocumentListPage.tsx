/**
 * DocumentListPage Component
 * Page for listing and managing documents
 * Responsive design for mobile and desktop
 */

import React from 'react';
import { Typography, Space, Button, Card, Grid } from 'antd';
import { PlusOutlined, ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DocumentList } from '../components/DocumentList';
import { DocumentFilters } from '../components/DocumentFilters';
import { useDocuments } from '../hooks/useDocuments';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const DocumentListPage: React.FC = () => {
  const { t } = useTranslation('documents');
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
          padding: isMobile ? '12px 16px' : '16px 24px',
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
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: isMobile ? 12 : 0,
          }}
        >
          <div>
            <Title level={isMobile ? 4 : 3} style={{ margin: 0 }}>
              {t('listPage.title')}
            </Title>
            <Text type="secondary" style={{ fontSize: isMobile ? 12 : 14 }}>
              {t('listPage.subtitle', { count: total })}
            </Text>
          </div>

          <Space wrap size={isMobile ? 'small' : 'middle'} style={{ justifyContent: isMobile ? 'space-between' : 'flex-end' }}>
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
              disabled={!filters.status && !filters.search}
              size={isMobile ? 'middle' : 'middle'}
            >
              {!isMobile && t('listPage.clearFilters')}
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refetch()}
              size={isMobile ? 'middle' : 'middle'}
            >
              {!isMobile && t('listPage.refresh')}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/documents/editor/new')}
              size={isMobile ? 'middle' : 'large'}
            >
              {isMobile ? t('listPage.create', 'New') : t('listPage.createDocument')}
            </Button>
          </Space>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? 12 : 24, background: '#fafafa' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 'middle' : 'large'}>
            {/* Filters */}
            <DocumentFilters value={filters} onChange={handleFiltersChange} />

            {/* Document List */}
            <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
              <DocumentList
                documents={documents}
                loading={isLoading || isDeleting}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDelete={(id) => {
                  const doc = documents.find((d) => d.id === id);
                  if (doc) {
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

