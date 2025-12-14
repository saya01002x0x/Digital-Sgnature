/**
 * DocumentEditorPage Component
 * Page for editing document and placing fields via drag-and-drop
 */

import React, { useState, useRef } from 'react';
import { Typography, Space, Row, Col, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFViewer } from '../components/PDFViewer';
import { FieldToolbar } from '../components/FieldToolbar';
import { FieldOverlay } from '../components/FieldOverlay';
import { DocumentUpload } from '../components/DocumentUpload';
import { usePDFViewer } from '../hooks/usePDFViewer';
import { FieldType } from '../types';
import { getDefaultFieldDimensions, calculateFieldPositionFromEvent } from '../utils/fieldHelpers';
import {
  useGetDocumentQuery,
  useCreateFieldMutation,
  useDeleteFieldMutation,
  useUploadDocumentMutation,
} from '../services/documents.api';

const { Title, Text } = Typography;

export const DocumentEditorPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pageCount, currentPage, setCurrentPage } = usePDFViewer();
  const containerRef = useRef<HTMLDivElement>(null);

  const isNewDocument = id === 'new';

  // Drag state
  const [draggingFieldType, setDraggingFieldType] = useState<FieldType | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);

  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useGetDocumentQuery(id || '', { skip: !id || isNewDocument });

  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();
  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation();
  const [deleteField, { isLoading: isDeletingField }] = useDeleteFieldMutation();

  // Drag handlers
  const handleFieldDragStart = (type: FieldType) => {
    setDraggingFieldType(type);
  };

  const handleFieldDragEnd = () => {
    setDraggingFieldType(null);
    setIsDragOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    if (!draggingFieldType || !containerRef.current || !id) {
      return;
    }

    // Get fixed dimensions for this field type
    const dimensions = getDefaultFieldDimensions(draggingFieldType);
    const position = calculateFieldPositionFromEvent(
      event.nativeEvent,
      containerRef.current,
      dimensions.width,
      dimensions.height
    );

    const fieldData = {
      type: draggingFieldType,
      pageNumber: currentPage,
      ...position,
      ...dimensions,
      isRequired: true,
    };

    try {
      await createField({ documentId: id, data: fieldData }).unwrap();
      message.success(t('documents.fieldAdded', 'Đã thêm trường ký thành công'));
    } catch (error: any) {
      message.error(error?.data?.message || t('documents.fieldAddError', 'Không thể thêm trường ký'));
    }

    setDraggingFieldType(null);
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteField(fieldId).unwrap();
      message.success(t('documents.fieldDeleted', 'Đã xóa trường ký'));
    } catch (error: any) {
      message.error(error?.data?.message || t('documents.fieldDeleteError', 'Không thể xóa trường ký'));
    }
  };

  const handleFieldClick = (field: any) => {
    setSelectedFieldId(field.id);
  };

  const handleFileSelect = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace('.pdf', ''));

      const document = await uploadDocument(formData).unwrap();
      message.success(t('documents.uploadSuccess', 'Tải lên thành công'));
      navigate(`/documents/editor/${document.id}`);
    } catch (error: any) {
      message.error(error?.data?.message || t('documents.uploadError', 'Không thể tải lên'));
    }
  };

  // Show upload UI for new document
  if (isNewDocument) {
    return (
      <div style={{ padding: '24px', maxWidth: 800, margin: '0 auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/documents')}
              style={{ marginBottom: 16 }}
            >
              {t('common.back', 'Quay lại')}
            </Button>
            <Title level={2}>{t('documents.createNewDocument', 'Tạo tài liệu mới')}</Title>
            <Text type="secondary">
              {t('documents.uploadSubtitle', 'Tải lên tài liệu PDF để bắt đầu')}
            </Text>
          </div>
          <DocumentUpload onFileSelect={handleFileSelect} disabled={isUploading} />
        </Space>
      </div>
    );
  }

  if (isLoadingDocument) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (documentError || !documentData) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text type="danger">{t('documents.loadError', 'Không thể tải tài liệu')}</Text>
      </div>
    );
  }

  const { document, fields = [] } = documentData;

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/documents')}
              style={{ marginBottom: 16 }}
            >
              {t('common.back', 'Quay lại')}
            </Button>
            <Title level={2}>{document.title}</Title>
            <Text type="secondary">
              {t('documents.editorSubtitle', 'Thêm trường ký vào tài liệu của bạn')}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => navigate(`/documents/${id}/invite`)}
          >
            {t('documents.saveAndContinue', 'Lưu & Tiếp tục')}
          </Button>
        </div>

        <Row gutter={24}>
          {/* Field Toolbar */}
          <Col xs={24} lg={6}>
            <FieldToolbar
              onFieldDragStart={handleFieldDragStart}
              onFieldDragEnd={handleFieldDragEnd}
              disabled={document.status !== 'DRAFT'}
            />
          </Col>

          {/* PDF Viewer with Field Overlay */}
          <Col xs={24} lg={18}>
            <div
              ref={containerRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                position: 'relative',
                border: isDragOver ? '3px dashed #1890ff' : '3px dashed transparent',
                borderRadius: 8,
                transition: 'border-color 0.2s',
                backgroundColor: isDragOver ? 'rgba(24, 144, 255, 0.05)' : 'transparent',
              }}
            >
              <PDFViewer
                fileUrl={document.fileUrl}
                pageCount={document.pageCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />

              {/* Field Overlay */}
              {containerRef.current && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                  }}
                >
                  <FieldOverlay
                    fields={fields}
                    pageNumber={currentPage}
                    containerWidth={containerRef.current.clientWidth}
                    containerHeight={containerRef.current.clientHeight}
                    onFieldClick={handleFieldClick}
                    onFieldDelete={handleDeleteField}
                    selectedFieldId={selectedFieldId}
                  />
                </div>
              )}

              {/* Drop hint */}
              {isDragOver && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(24, 144, 255, 0.9)',
                    color: 'white',
                    padding: '16px 32px',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 500,
                    pointerEvents: 'none',
                  }}
                >
                  {t('documents.dropHere', 'Thả vào đây để đặt trường ký')}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
