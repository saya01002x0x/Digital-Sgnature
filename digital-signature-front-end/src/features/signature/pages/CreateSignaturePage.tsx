/**
 * CreateSignaturePage Component
 * Page for creating new signatures
 */

import React from 'react';
import { Typography, Space, Tabs, Card, Input, Button, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, HighlightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SignatureCanvas } from '../components/SignatureCanvas';
import { SignatureTyped } from '../components/SignatureTyped';
import { useSignature } from '../hooks/useSignature';
import { SignatureType } from '../types';

const { Title, Text } = Typography;

export const CreateSignaturePage: React.FC = () => {
  const { t } = useTranslation(['signature', 'translation']);
  const navigate = useNavigate();
  const { createSignature, isCreating } = useSignature();

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
      message.warning(t('pleaseCreateSignature'));
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
          {t('drawSignature')}
        </span>
      ),
      children: (
        <SignatureCanvas
          options={{
            width: 600,
            height: 200,
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
          {t('typeSignature')}
        </span>
      ),
      children: (
        <SignatureTyped onSave={handleTypedCreate} />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/signatures')}
            style={{ marginBottom: 16 }}
          >
            {t('common.back', { ns: 'translation' })}
          </Button>
          <Title level={2}>{t('createNewSignature')}</Title>
          <Text type="secondary">
            {t('createDescription')}
          </Text>
        </div>

        {/* Signature Name (Optional) */}
        <Card>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>{t('signatureName')} ({t('common.optional')})</Text>
            <Input
              placeholder={t('nameExample')}
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              maxLength={50}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('nameHint')}
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
          <Card title={t('preview')}>
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
            {t('common.cancel', { ns: 'translation' })}
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            loading={isCreating}
            disabled={!imageData}
          >
            {t('saveSignature')}
          </Button>
        </div>
      </Space>
    </div>
  );
};

