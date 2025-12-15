/**
 * SignatureListPage Component
 * Page for listing and managing signatures
 */

import React from 'react';
import { Typography, Space, Button, Card, Row, Col, Empty, Modal, Input, Spin, Tag, Popconfirm, Grid } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSignature } from '../hooks/useSignature';
import { SignaturePreview } from '../components/SignaturePreview';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const SignatureListPage: React.FC = () => {
  const { t } = useTranslation(['signature', 'translation']);
  const navigate = useNavigate();
  const {
    signatures,
    isLoadingList,
    deleteSignature,
    updateSignature,
    setDefaultSignature,
    isDeleting,
    isUpdating,
  } = useSignature();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');

  const handleEdit = (id: string, currentName?: string) => {
    setEditingId(id);
    setEditName(currentName || '');
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    try {
      await updateSignature(editingId, { name: editName });
      setEditingId(null);
      setEditName('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSignature(id);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultSignature(id);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoadingList) {
    return (
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? 16 : 24, maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" size={isMobile ? 'middle' : 'large'} style={{ width: '100%' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 12 : 0,
        }}>
          <div>
          <Title level={isMobile ? 3 : 2}>
            {t('mySignatures')}
          </Title>

          <Text
            type="secondary"
            style={{ fontSize: isMobile ? 12 : 14 }}
          >
            {t('manageSignatures')}
          </Text>
            </Text>
          </div>
          <Button
            type="primary"
            size={isMobile ? 'middle' : 'large'}
            icon={<PlusOutlined />}
            onClick={() => navigate('/signatures/create')}
          >
            {t('createNew')}
          </Button>
        </div>

        {/* Signature List */}
        {signatures.length === 0 ? (
          <Card>
            <Empty
              description={t('noSignaturesYet')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate('/signatures/create')}
              >
                {t('createFirstSignature')}
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {signatures.map((signature) => (
              <Col xs={24} sm={12} lg={8} key={signature.id}>
                <Card
                  hoverable
                  actions={[
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(signature.id, signature.name)}
                    >
                      {t('common.edit', { ns: 'translation' })}
                    </Button>,
                    signature.isDefault ? (
                      <Tag key="default" color="success" icon={<CheckCircleOutlined />}>
                        {t('default')}
                      </Tag>
                    ) : (
                      <Button
                        key="setDefault"
                        type="text"
                        icon={<StarOutlined />}
                        onClick={() => handleSetDefault(signature.id)}
                        loading={isUpdating}
                      >
                        {t('setAsDefault')}
                      </Button>
                    ),
                    <Popconfirm
                      key="delete"
                      title={t('confirmDelete')}
                      description={t('deleteWarning')}
                      onConfirm={() => handleDelete(signature.id)}
                      okText={t('common.yes', { ns: 'translation' })}
                      cancelText={t('common.no', { ns: 'translation' })}
                    >
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        loading={isDeleting}
                      >
                        {t('common.delete', { ns: 'translation' })}
                      </Button>
                    </Popconfirm>,
                  ]}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {/* Name */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{signature.name || `${t('signature')} ${signature.id.slice(0, 8)}`}</Text>
                      {signature.isDefault && (
                        <Tag color="success" icon={<CheckCircleOutlined />}>
                          {t('default')}
                        </Tag>
                      )}
                    </div>

                    {/* Type */}
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {t('type')}: {signature.type}
                    </Text>

                    {/* Preview - Larger for A4 documents */}
                    <div
                      style={{
                        marginTop: 12,
                        padding: 16,
                        backgroundColor: '#fafafa',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 150,
                      }}
                    >
                      <img
                        src={signature.imageData}
                        alt={signature.name || 'Signature'}
                        style={{
                          maxWidth: '100%',
                          maxHeight: 150,
                          objectFit: 'contain',
                        }}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Space>

      {/* Edit Name Modal */}
      <Modal
        title={t('editName')}
        open={!!editingId}
        onOk={handleSaveEdit}
        onCancel={() => setEditingId(null)}
        okText={t('common.save', { ns: 'translation' })}
        cancelText={t('common.cancel', { ns: 'translation' })}
      >
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          placeholder={t('signatureName')}
          maxLength={50}
        />
      </Modal>
    </div>
  );
};

