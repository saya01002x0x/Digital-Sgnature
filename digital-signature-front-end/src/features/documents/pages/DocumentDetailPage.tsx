/**
 * Document Detail Page
 * Display document information, signers status, and timeline/audit trail
 */
import { STORAGE_KEYS } from '@/app/config/constants';
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Descriptions,
  Tag,
  Alert,
  Spin,
  Divider,
  Table,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  SendOutlined,
  DownloadOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGetDocumentQuery, useGetDocumentTimelineQuery } from '../services/documents.api';
import { useSelfSignDocumentMutation } from '@/features/invite-signing/services/invite-signing.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DocumentPreview } from '../components/DocumentPreview';
import { StatusBadge } from '../components/StatusBadge';
import { DocumentStatus } from '../types';
import { formatTimestamp } from '@/shared/utils/formatters';
import type { Signer, SignerStatus } from '@/features/invite-signing/types';

const { Title, Text } = Typography;

export const DocumentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('documents');
  const { user } = useAuth();

  // Fetch document with fields and signers
  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useGetDocumentQuery(id!, { skip: !id || id === 'new' });

  // Fetch timeline with polling for real-time updates
  // Fetch timeline with polling for real-time updates
  const {
    data: timelineData,
    isLoading: isLoadingTimeline,
    error: timelineError,
  } = useGetDocumentTimelineQuery(id!, {
    skip: true, // <--- TẠM THỜI TẮT CALL API NÀY
    // skip: !id || id === 'new', 
    pollingInterval: 0, // Tắt polling
  });

  // Self sign mutation
  const [selfSign, { isLoading: isSelfSigning }] = useSelfSignDocumentMutation();

  if (!id) {
    return (
      <Alert
        message={t('detail.error')}
        description={t('detail.documentNotFound')}
        type="error"
        showIcon
      />
    );
  }

  if (isLoadingDocument || isLoadingTimeline) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" tip={t('detail.loading')} />
      </div>
    );
  }

  if (documentError || !documentData) {
    return (
      <Alert
        message={t('detail.error')}
        description={t('detail.loadError')}
        type="error"
        showIcon
      />
    );
  }

  const { document, fields, signers } = documentData;

  const handleBack = () => {
    navigate('/documents');
  };

  const handleEdit = () => {
    navigate(`/documents/editor/${id}`);
  };

  const handleInvite = () => {
    navigate(`/documents/${id}/invite`);
  };

  const handleSelfSign = async () => {
    try {
      const result = await selfSign(id!).unwrap();
      message.success(t('detail.selfSignSuccess'));

      // SỬA DÒNG NÀY: Dùng window.location.href thay cho navigate
      // navigate(result.signingUrl); <--- Dòng cũ
      window.location.href = result.signingUrl; // <--- Dòng mới FIX lỗi

    } catch (error) {
      message.error(t('detail.selfSignError'));
    }
  };

  // Signers table columns
  const signerColumns = [
    {
      title: t('detail.signers.name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('detail.signers.email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('detail.signers.order'),
      dataIndex: 'order',
      key: 'order',
      width: 100,
      render: (order: number) => `#${order}`,
    },
    {
      title: t('detail.signers.status'),
      dataIndex: 'status',
      key: 'status',
      render: (status: SignerStatus) => {
        const statusColors = {
          PENDING: 'default',
          OPENED: 'processing',
          SIGNED: 'success',
          DECLINED: 'error',
        };
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {t(`detail.signers.statusLabel.${status}`)}
          </Tag>
        );
      },
    },
    {
      title: t('detail.signers.signedAt'),
      dataIndex: 'signedAt',
      key: 'signedAt',
      render: (signedAt?: string) =>
        signedAt ? formatTimestamp(signedAt, i18n.language as 'vi' | 'en') : '-',
    },
  ];

  const canEdit = document.status === DocumentStatus.Draft;
  const canInvite = document.status === DocumentStatus.Draft && fields.length > 0;
  const isOwnerSigner = signers.some((s) => s.email === user?.email);
  const currentSigner = signers.find((s) => s.email === user?.email);
  const canSign = currentSigner && (currentSigner.status === 'PENDING' || currentSigner.status === 'OPENED' as SignerStatus);

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
          {t('detail.back')}
        </Button>
      </Space>

      <Row gutter={[16, 16]}>
        {/* Left Column - Document Info & Signers */}
        <Col xs={24} lg={16}>
          {/* Document Info Card */}
          <Card title={<Title level={4}>{document.title}</Title>}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('detail.status')}>
                  <StatusBadge status={document.status} />
                </Descriptions.Item>
                <Descriptions.Item label={t('detail.pageCount')}>
                  {document.pageCount} {t('detail.pages')}
                </Descriptions.Item>
                <Descriptions.Item label={t('detail.fileSize')}>
                  {(document.fileSize / 1024 / 1024).toFixed(2)} MB
                </Descriptions.Item>
                <Descriptions.Item label={t('detail.createdAt')}>
                  {formatTimestamp(document.createdAt, i18n.language as 'vi' | 'en')}
                </Descriptions.Item>
                <Descriptions.Item label={t('detail.updatedAt')}>
                  {formatTimestamp(document.updatedAt, i18n.language as 'vi' | 'en')}
                </Descriptions.Item>
                {document.completedAt && (
                  <Descriptions.Item label={t('detail.completedAt')}>
                    {formatTimestamp(document.completedAt, i18n.language as 'vi' | 'en')}
                  </Descriptions.Item>
                )}
                {document.declinedAt && (
                  <>
                    <Descriptions.Item label={t('detail.declinedAt')}>
                      {formatTimestamp(document.declinedAt, i18n.language as 'vi' | 'en')}
                    </Descriptions.Item>
                    {document.declineReason && (
                      <Descriptions.Item label={t('detail.declineReason')}>
                        <Text type="danger">{document.declineReason}</Text>
                      </Descriptions.Item>
                    )}
                  </>
                )}
              </Descriptions>

              <Space>
                {canEdit && (
                  <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                    {t('detail.editDocument')}
                  </Button>
                )}
                {canInvite && (
                  <>
                    <Button type="default" icon={<SendOutlined />} onClick={handleInvite}>
                      {t('detail.inviteSigners')}
                    </Button>
                    {!isOwnerSigner && (
                      <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={handleSelfSign}
                        loading={isSelfSigning}
                      >
                        {t('detail.selfSign')}
                      </Button>
                    )}
                  </>
                )}
                {canSign && (
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    onClick={() => { window.location.href = currentSigner!.signingUrl; }}
                  >
                    {t('detail.signNow', 'Sign Now')}
                  </Button>
                )}
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    // FIX: Lấy token từ STORAGE_KEYS.AUTH_TOKEN
                    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

                    // Tự động thêm Bearer token vào header
                    fetch(`/api/documents/${id}/download`, {
                      headers: { 'Authorization': `Bearer ${token}` },
                    })
                      .then(res => {
                        if (!res.ok) {
                          // Báo lỗi 403/404/500 rõ ràng hơn
                          return res.json().then(err => Promise.reject(err));
                        }
                        return res.blob();
                      })
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const link = window.document.createElement('a');
                        link.href = url;
                        link.download = `${document.title}_signed.pdf`;
                        link.click();
                        window.URL.revokeObjectURL(url);
                        message.success(t('detail.downloadSuccess', 'Download successful!'));
                      })
                      .catch((err) => {
                        console.error('Download error details:', err);
                        message.error(err?.message || t('detail.downloadError', 'Download failed. Vui lòng kiểm tra đã đăng nhập chưa.'));
                      });
                  }}
                >
                  {t('detail.download')}
                </Button>
              </Space>
            </Space>
          </Card>

          {/* Signers Card */}
          {signers && signers.length > 0 && (
            <Card
              title={<Title level={5}>{t('detail.signers.title')}</Title>}
              style={{ marginTop: 16 }}
            >
              <Table
                columns={signerColumns}
                dataSource={signers}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          )}

          {/* Fields Summary */}
          <Card
            title={<Title level={5}>{t('detail.fields.title')}</Title>}
            style={{ marginTop: 16 }}
          >
            <Descriptions column={2} size="small">
              <Descriptions.Item label={t('detail.fields.total')}>
                {fields.length}
              </Descriptions.Item>
              <Descriptions.Item label={t('detail.fields.filled')}>
                {fields.filter((f) => f.value).length}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Right Column - Document Preview */}
        <Col xs={24} lg={8}>
          <Card title={<Title level={5}>{t('detail.preview.title', 'Document Preview')}</Title>}>
            <DocumentPreview
              fileUrl={document.fileUrl}
              fields={fields}
              title={document.title}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

