/**
 * DocumentFilters Component
 * Filters for document list (status, search, sort)
 */

import React from 'react';
import { Input, Select, Space, Card } from 'antd';
import { SearchOutlined, FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { DocumentStatus } from '../types';

const { Option } = Select;

export type DocumentFiltersValue = {
  status?: DocumentStatus;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
};

type DocumentFiltersProps = {
  value?: DocumentFiltersValue;
  onChange?: (value: DocumentFiltersValue) => void;
};

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  value = {},
  onChange,
}) => {
  const { t } = useTranslation('documents');

  const handleStatusChange = (status: DocumentStatus | undefined) => {
    onChange?.({ ...value, status });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.({ ...value, search: e.target.value });
  };

  const handleSortChange = (sortValue: string) => {
    const [sortBy, sortOrder] = sortValue.split('-') as [
      'createdAt' | 'updatedAt',
      'asc' | 'desc'
    ];
    onChange?.({ ...value, sortBy, sortOrder });
  };

  const currentSort = value.sortBy && value.sortOrder 
    ? `${value.sortBy}-${value.sortOrder}`
    : 'createdAt-desc';

  return (
    <Card size="small">
      <Space
        style={{ width: '100%', justifyContent: 'space-between' }}
        wrap
      >
        {/* Search */}
        <Input
          placeholder={t('filters.searchPlaceholder')}
          prefix={<SearchOutlined />}
          value={value.search}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />

        {/* Status Filter */}
        <Select
          placeholder={t('filters.statusPlaceholder')}
          value={value.status}
          onChange={handleStatusChange}
          style={{ width: 200 }}
          allowClear
          suffixIcon={<FilterOutlined />}
        >
          <Option value={DocumentStatus.Draft}>
            {t('status.draft')}
          </Option>
          <Option value={DocumentStatus.Signing}>
            {t('status.signing')}
          </Option>
          <Option value={DocumentStatus.Done}>
            {t('status.done')}
          </Option>
          <Option value={DocumentStatus.Declined}>
            {t('status.declined')}
          </Option>
        </Select>

        {/* Sort */}
        <Select
          value={currentSort}
          onChange={handleSortChange}
          style={{ width: 200 }}
          suffixIcon={<SortAscendingOutlined />}
        >
          <Option value="createdAt-desc">
            {t('filters.sortCreatedDesc')}
          </Option>
          <Option value="createdAt-asc">
            {t('filters.sortCreatedAsc')}
          </Option>
          <Option value="updatedAt-desc">
            {t('filters.sortUpdatedDesc')}
          </Option>
          <Option value="updatedAt-asc">
            {t('filters.sortUpdatedAsc')}
          </Option>
        </Select>
      </Space>
    </Card>
  );
};

