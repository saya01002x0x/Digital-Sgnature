/**
 * Field Helper Utilities
 * Helper functions for field positioning and validation
 */

import type { Field, FieldType } from '../types';
import { DEFAULT_FIELD_DIMENSIONS } from '../types';

/**
 * Convert pixel position to percentage (relative to page dimensions)
 */
export const pixelToPercent = (pixelValue: number, pageSize: number): number => {
  return (pixelValue / pageSize) * 100;
};

/**
 * Convert percentage to pixel position
 */
export const percentToPixel = (percentValue: number, pageSize: number): number => {
  return (percentValue * pageSize) / 100;
};

/**
 * Validate field placement (ensure within page bounds)
 */
export const validateFieldPlacement = (
  positionX: number,
  positionY: number,
  width: number,
  height: number
): boolean => {
  return (
    positionX >= 0 &&
    positionY >= 0 &&
    positionX + width <= 100 &&
    positionY + height <= 100
  );
};

/**
 * Clamp field position to page bounds
 */
export const clampFieldPosition = (
  positionX: number,
  positionY: number,
  width: number,
  height: number
): { positionX: number; positionY: number } => {
  const clampedX = Math.max(0, Math.min(positionX, 100 - width));
  const clampedY = Math.max(0, Math.min(positionY, 100 - height));
  return { positionX: clampedX, positionY: clampedY };
};

/**
 * Get default dimensions for field type
 */
export const getDefaultFieldDimensions = (type: FieldType) => {
  return DEFAULT_FIELD_DIMENSIONS[type];
};

/**
 * Calculate field position from mouse/touch event
 */
export const calculateFieldPositionFromEvent = (
  event: MouseEvent | Touch,
  container: HTMLElement,
  fieldWidth: number,
  fieldHeight: number
): { positionX: number; positionY: number } => {
  const rect = container.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // Convert to percentage and center the field on cursor
  const positionX = pixelToPercent(x - (fieldWidth * rect.width) / 200, rect.width);
  const positionY = pixelToPercent(y - (fieldHeight * rect.height) / 200, rect.height);

  return clampFieldPosition(positionX, positionY, fieldWidth, fieldHeight);
};

/**
 * Get field color by type
 */
export const getFieldColor = (type: FieldType): string => {
  const colors = {
    SIGNATURE: '#1890ff',
    INITIALS: '#52c41a',
    DATE: '#fa8c16',
    TEXT: '#722ed1',
  };
  return colors[type];
};

/**
 * Get field label by type
 */
export const getFieldLabel = (type: FieldType): string => {
  const labels = {
    SIGNATURE: 'Signature',
    INITIALS: 'Initials',
    DATE: 'Date',
    TEXT: 'Text',
  };
  return labels[type];
};

/**
 * Check if fields overlap
 */
export const doFieldsOverlap = (field1: Field, field2: Field): boolean => {
  if (field1.pageNumber !== field2.pageNumber) return false;

  const field1Right = field1.positionX + field1.width;
  const field1Bottom = field1.positionY + field1.height;
  const field2Right = field2.positionX + field2.width;
  const field2Bottom = field2.positionY + field2.height;

  return !(
    field1Right < field2.positionX ||
    field1.positionX > field2Right ||
    field1Bottom < field2.positionY ||
    field1.positionY > field2Bottom
  );
};

/**
 * Sort fields by position (top to bottom, left to right)
 */
export const sortFieldsByPosition = (fields: Field[]): Field[] => {
  return [...fields].sort((a, b) => {
    if (a.pageNumber !== b.pageNumber) {
      return a.pageNumber - b.pageNumber;
    }
    if (Math.abs(a.positionY - b.positionY) > 5) {
      return a.positionY - b.positionY;
    }
    return a.positionX - b.positionX;
  });
};

