/**
 * CreateSignaturePage Component
 * Page for creating new signatures
 */

import React from 'react';
import { Typography, Space, Tabs, Card, Input, Button, message, Grid } from 'antd';
import { ArrowLeftOutlined, EditOutlined, HighlightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { SignatureTyped } from '../components/SignatureTyped';
import { useSignature } from '../hooks/useSignature';
import { SignatureType } from '../types';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export const CreateSignaturePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createSignature, isCreating } = useSignature();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [activeTab, setActiveTab] = React.useState<string>('draw');
  const [signatureName, setSignatureName] = React.useState('');
  const [imageData, setImageData] = React.useState<string | null>(null);

  const handleCanvasCreate = (dataUrl: string) => {
    setImageData(dataUrl);
  };

  const handleTypedCreate = (dataUrl: string) => {
    setImageData(dataUrl);
  };

  const handleSave = async () => {
    if (!imageData) {
      message.warning(t('signature.pleaseCreateSignature', 'Please create a signature first'));
      return;
    }

    try {
      await createSignature({
        type: activeTab === 'draw' ? SignatureType.Draw : SignatureType.Type,
        imageData,
        name: signatureName || undefined,
      });

      // Navigate back to list
      navigate('/signatures');
    } catch (error) {
      // Error handled by hook
    }
  };

  const tabItems = [
    {
      key: 'draw',
      label: (
        <span>
          <HighlightOutlined />
          {t('signature.drawSignature', 'Draw Signature')}
        </span>
      ),
      children: (
        <SignatureCanvas
          options={{
            width: isMobile ? 320 : 600,
            height: isMobile ? 150 : 200,
            backgroundColor: '#ffffff',
            penColor: '#000000',
          }}
          onSave={handleCanvasCreate}
        />
      ),
    },
    {
      key: 'type',
      label: (
        <span>
          <EditOutlined />
          {t('signature.typeSignature', 'Type Signature')}
        </span>
      ),
      children: (
        <SignatureTyped onSave={handleTypedCreate} />
      ),
    },
  ];

  return (
    <div style={{ padding: isMobile ? 16 : 24, maxWidth: 900, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/signatures')}
            style={{ marginBottom: 16 }}
          >
            {t('common.back', 'Back')}
          </Button>
          <Title level={2}>{t('signature.createNewSignature', 'Create New Signature')}</Title>
          <Text type="secondary">
            {t('signature.createDescription', 'Choose your preferred method to create your signature')}
          </Text>
        </div>

        {/* Signature Name (Optional) */}
        <Card>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>{t('signature.signatureName', 'Signature Name')} ({t('common.optional', 'Optional')})</Text>
            <Input
              placeholder={t('signature.nameExample', 'e.g., Formal, Casual, Business')}
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              maxLength={50}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('signature.nameHint', 'Give your signature a name to easily identify it later')}
            </Text>
          </Space>
        </Card>

        {/* Creation Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />

        {/* Preview if created */}
        {imageData && (
          <Card title={t('signature.preview', 'Preview')}>
            <div
              style={{
                padding: 24,
                backgroundColor: '#fafafa',
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 120,
              }}
            >
              <img
                src={imageData}
                alt="Signature preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  objectFit: 'contain',
                }}
              />
            </div>
          </Card>
        )}

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button size="large" onClick={() => navigate('/signatures')}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            loading={isCreating}
            disabled={!imageData}
          >
            {t('signature.saveSignature', 'Save Signature')}
          </Button>
        </div>
      </Space>
    </div>
  );
};

