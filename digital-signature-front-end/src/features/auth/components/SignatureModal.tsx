import React, { useRef, useState, useEffect } from 'react';
import { Modal, Tabs, Button, Input, Select } from 'antd';
import SignatureCanvas from 'react-signature-canvas';
import { useTranslation } from 'react-i18next';

interface SignatureModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (signatureData: string) => void;
  initialSignature?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  open,
  onClose,
  onSave,
  initialSignature,
}) => {
  const { t } = useTranslation();
  const signatureRef = useRef<SignatureCanvas>(null);
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureColor, setSignatureColor] = useState('#000000');
  const [activeTab, setActiveTab] = useState('draw');

  useEffect(() => {
    if (open && initialSignature && signatureRef.current) {
      signatureRef.current.fromDataURL(initialSignature);
    }
  }, [open, initialSignature]);

  const handleClear = () => {
    if (activeTab === 'draw' && signatureRef.current) {
      signatureRef.current.clear();
    } else if (activeTab === 'type') {
      setTypedSignature('');
    }
  };

  const handleSave = () => {
    let signatureData = '';
    
    if (activeTab === 'draw' && signatureRef.current) {
      signatureData = signatureRef.current.toDataURL();
    } else if (activeTab === 'type') {
      // Create a canvas to render typed signature
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px "Brush Script MT", cursive';
        ctx.fillStyle = signatureColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedSignature, canvas.width / 2, canvas.height / 2);
        signatureData = canvas.toDataURL();
      }
    }
    
    if (signatureData) {
      onSave(signatureData);
      onClose();
    }
  };

  const handleCancel = () => {
    handleClear();
    onClose();
  };

  const drawTab = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderRadius: '4px', 
        marginBottom: 16,
        backgroundColor: '#fff'
      }}>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width: 500,
            height: 350,
            className: 'signature-canvas',
            style: { width: '100%', height: '350px' }
          }}
          backgroundColor="#ffffff"
          penColor={signatureColor}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ marginRight: 8 }}>Color:</span>
          <Select
            value={signatureColor}
            onChange={setSignatureColor}
            style={{ width: 120 }}
          >
            <Select.Option value="#000000">Black</Select.Option>
            <Select.Option value="#0000FF">Blue</Select.Option>
          </Select>
        </div>
        <Button onClick={handleClear}>
          {t('auth.clearSignature')}
        </Button>
      </div>
    </div>
  );

  const typeTab = (
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        border: '1px solid #d9d9d9', 
        borderRadius: '4px', 
        marginBottom: 16,
        padding: 32,
        minHeight: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
      }}>
        {typedSignature ? (
          <div style={{ 
            fontSize: '48px', 
            fontFamily: '"Brush Script MT", cursive',
            color: signatureColor
          }}>
            {typedSignature}
          </div>
        ) : (
          <div style={{ color: '#999' }}>
            {t('auth.typeYourSignature')}
          </div>
        )}
      </div>
      <Input
        placeholder={t('auth.typeYourSignature')}
        value={typedSignature}
        onChange={(e) => setTypedSignature(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ marginRight: 8 }}>Color:</span>
          <Select
            value={signatureColor}
            onChange={setSignatureColor}
            style={{ width: 120 }}
          >
            <Select.Option value="#000000">Black</Select.Option>
            <Select.Option value="#0000FF">Blue</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );

  const tabItems = [
    {
      key: 'draw',
      label: t('auth.draw'),
      children: drawTab,
    },
    {
      key: 'type',
      label: t('auth.type'),
      children: typeTab,
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t('common.cancel')}
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {t('auth.next')}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
        style={{
          minHeight: 508,
          width: '100%'
        }}
      />
    </Modal>
  );
};

