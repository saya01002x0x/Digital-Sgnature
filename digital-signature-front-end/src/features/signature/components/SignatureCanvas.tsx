/**
 * SignatureCanvas Component
 * Canvas component for drawing signatures
 */

import React, { useRef, useEffect } from 'react';
import { Card, Button, Space, message } from 'antd';
import { ClearOutlined, UndoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import type { SignatureCanvasOptions } from '../types';

type SignatureCanvasProps = {
  options?: SignatureCanvasOptions;
  onSave?: (dataUrl: string) => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({
  options = {},
  onSave,
}) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [canUndo, setCanUndo] = React.useState(false);
  const pathsRef = useRef<ImageData[]>([]);

  const {
    width = 600,
    height = 200,
    backgroundColor = '#ffffff',
    penColor = '#000000',
    minWidth = 0.5,
    maxWidth = 2.5,
  } = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Set pen style
    ctx.strokeStyle = penColor;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = (minWidth + maxWidth) / 2;
  }, [width, height, backgroundColor, penColor, minWidth, maxWidth]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save state for undo
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pathsRef.current.push(imageData);
    setCanUndo(true);

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pathsRef.current = [];
    setCanUndo(false);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || pathsRef.current.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = pathsRef.current.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    }

    if (pathsRef.current.length === 0) {
      setCanUndo(false);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if canvas is empty
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const isEmpty = !imageData.data.some(channel => channel !== 0);

    if (isEmpty) {
      message.warning(t('signature.canvasEmpty', 'Please draw your signature'));
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    onSave?.(dataUrl);
  };

  return (
    <Card>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div
          style={{
            border: '2px dashed #d9d9d9',
            borderRadius: 8,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            backgroundColor: '#fafafa',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              cursor: 'crosshair',
              touchAction: 'none',
            }}
          />
        </div>

        <Space>
          <Button
            icon={<UndoOutlined />}
            onClick={undo}
            disabled={!canUndo}
          >
            {t('signature.undo', 'Undo')}
          </Button>
          <Button
            icon={<ClearOutlined />}
            onClick={clearCanvas}
          >
            {t('signature.clear', 'Clear')}
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
          >
            {t('signature.saveSignature', 'Save Signature')}
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

