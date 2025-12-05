/**
 * SignatureTyped Component
 * Component for creating typed text signatures
 */

import React from 'react';
import { Card, Input, Select, Button, Space, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { SIGNATURE_FONTS } from '../types';
import { textToSignatureDataUrl } from '../utils/signatureHelpers';

const { Text } = Typography;

type SignatureTypedProps = {
  onSave?: (dataUrl: string) => void;
}

export const SignatureTyped: React.FC<SignatureTypedProps> = ({ onSave }) => {
  const { t } = useTranslation();
  const [text, setText] = React.useState('');
  const [selectedFont, setSelectedFont] = React.useState(SIGNATURE_FONTS[0].value);

  const currentFont = SIGNATURE_FONTS.find(f => f.value === selectedFont) || SIGNATURE_FONTS[0];

  const handleSave = () => {
    if (!text.trim()) {
      message.warning(t('signature.enterText', 'Please enter your signature text'));
      return;
    }

    try {
      const dataUrl = textToSignatureDataUrl(text, currentFont.fontFamily, {
        fontSize: 48,
        color: '#000000',
        backgroundColor: 'transparent',
      });
      onSave?.(dataUrl);
    } catch (error) {
      message.error(t('signature.createFailed', 'Failed to create signature'));
      console.error('Failed to create typed signature:', error);
    }
  };

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Input */}
        <div>
          <Text strong>{t('signature.yourName', 'Your Name')}</Text>
          <Input
            size="large"
            placeholder={t('signature.enterYourName', 'Enter your name')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={50}
            style={{ marginTop: 8 }}
          />
        </div>

        {/* Font Selector */}
        <div>
          <Text strong>{t('signature.selectFont', 'Select Font')}</Text>
          <Select
            size="large"
            style={{ width: '100%', marginTop: 8 }}
            value={selectedFont}
            onChange={setSelectedFont}
            options={SIGNATURE_FONTS.map(font => ({
              value: font.value,
              label: font.label,
            }))}
          />
        </div>

        {/* Preview */}
        <div>
          <Text strong>{t('signature.preview', 'Preview')}</Text>
          <div
            style={{
              marginTop: 8,
              padding: 40,
              border: '2px dashed #d9d9d9',
              borderRadius: 8,
              backgroundColor: '#fafafa',
              minHeight: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {text ? (
              <div
                style={{
                  fontFamily: currentFont.fontFamily,
                  fontSize: 48,
                  color: '#000000',
                  userSelect: 'none',
                }}
              >
                {text}
              </div>
            ) : (
              <Text type="secondary">
                {t('signature.typePreview', 'Your signature will appear here')}
              </Text>
            )}
          </div>
        </div>

        {/* Actions */}
        <Button
          type="primary"
          size="large"
          onClick={handleSave}
          disabled={!text.trim()}
          block
        >
          {t('signature.saveSignature', 'Save Signature')}
        </Button>
      </Space>
    </Card>
  );
};

