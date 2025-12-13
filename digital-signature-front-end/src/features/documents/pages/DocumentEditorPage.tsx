/**
 * DocumentEditorPage Component
 * Page for editing document and placing fields
 */

import React, { useState } from 'react';
import { Typography, Space, Row, Col, Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { PDFViewer } from '../components/PDFViewer';
import { FieldToolbar } from '../components/FieldToolbar';
import { FieldOverlay } from '../components/FieldOverlay';
import { DocumentUpload } from '../components/DocumentUpload';
import { usePDFViewer } from '../hooks/usePDFViewer';
import { useFieldPlacement } from '../hooks/useFieldPlacement';
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
  const { pageCount, currentPage } = usePDFViewer();

  const isNewDocument = id === 'new';

  const {
    data: documentData,
    isLoading: isLoadingDocument,
    error: documentError,
  } = useGetDocumentQuery(id || '', { skip: !id || isNewDocument });

  const [uploadDocument, { isLoading: isUploading }] = useUploadDocumentMutation();

  const [createField, { isLoading: isCreatingField }] = useCreateFieldMutation();
  const [deleteField, { isLoading: isDeletingField }] = useDeleteFieldMutation();

  const {
    selectedFieldType,
    selectedFieldId,
    isPlacingField,
    containerRef,
    handleFieldTypeSelect,
    handleContainerClick,
    handleFieldClick,
    cancelPlacement,
  } = useFieldPlacement(isNewDocument ? '' : (id || ''), currentPage);

  const handlePDFClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacingField) return;

    const fieldData = handleContainerClick(event);
    if (fieldData && id) {
      try {
        await createField({ documentId: id, data: fieldData }).unwrap();
        message.success(t('documents.fieldAdded', 'Field added successfully'));
        cancelPlacement();
      } catch (error: any) {
        message.error(error?.data?.message || t('documents.fieldAddError', 'Failed to add field'));
      }
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    try {
      await deleteField(fieldId).unwrap();
      message.success(t('documents.fieldDeleted', 'Field deleted successfully'));
    } catch (error: any) {
      message.error(error?.data?.message || t('documents.fieldDeleteError', 'Failed to delete field'));
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace('.pdf', ''));

      const document = await uploadDocument(formData).unwrap();
      message.success(t('documents.uploadSuccess', 'Document uploaded successfully'));
      navigate(`/documents/editor/${document.id}`);
    } catch (error: any) {
      message.error(error?.data?.message || t('documents.uploadError', 'Failed to upload document'));
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
              {t('common.back', 'Back')}
            </Button>
            <Title level={2}>{t('documents.createNewDocument', 'Create New Document')}</Title>
            <Text type="secondary">
              {t('documents.uploadSubtitle', 'Upload a PDF document to get started')}
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
        <Text type="danger">{t('documents.loadError', 'Failed to load document')}</Text>
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
              {t('common.back', 'Back')}
            </Button>
            <Title level={2}>{document.title}</Title>
            <Text type="secondary">
              {t('documents.editorSubtitle', 'Add signature fields to your document')}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => navigate(`/documents/${id}/invite`)}
          >
            {t('documents.saveAndContinue', 'Save & Continue')}
          </Button>
        </div>

        <Row gutter={24}>
          {/* Field Toolbar */}
          <Col xs={24} lg={6}>
            <FieldToolbar
              onFieldTypeSelect={handleFieldTypeSelect}
              disabled={document.status !== 'DRAFT'}
            />
          </Col>

          {/* PDF Viewer with Field Overlay */}
          <Col xs={24} lg={18}>
            <div
              ref={containerRef}
              onClick={handlePDFClick}
              style={{
                position: 'relative',
                cursor: isPlacingField ? 'crosshair' : 'default',
              }}
            >
              <PDFViewer
                fileUrl={document.fileUrl}
                pageCount={document.pageCount}
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
            </div>

            {/* Placement hint */}
            {isPlacingField && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Text type="secondary">
                  {t('documents.clickToPlace', 'Click on the document to place the field')}
                  {' '}
                  <Button size="small" onClick={cancelPlacement}>
                    {t('common.cancel', 'Cancel')}
                  </Button>
                </Text>
              </div>
            )}
          </Col>
        </Row>
      </Space>
    </div>
  );
};

