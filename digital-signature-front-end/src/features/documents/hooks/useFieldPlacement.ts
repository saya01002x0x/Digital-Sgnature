/**
 * useFieldPlacement Hook
 * Custom hook for managing field placement on PDF with click-to-place (fixed size)
 */

import { useState, useCallback, useRef } from 'react';
import type { Field, FieldType } from '../types';
import {
  calculateFieldPositionFromEvent,
  getDefaultFieldDimensions,
} from '../utils/fieldHelpers';

export const useFieldPlacement = (
  documentId: string,
  currentPage: number
) => {
  const [selectedFieldType, setSelectedFieldType] = useState<FieldType | undefined>(undefined);
  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined);
  const [isPlacingField, setIsPlacingField] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFieldTypeSelect = useCallback((type: FieldType) => {
    setSelectedFieldType(type);
    setIsPlacingField(true);
    setSelectedFieldId(undefined);
  }, []);

  // For fixed size, we only need mouse down position (no drag)
  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isPlacingField || !selectedFieldType || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragStart({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    },
    [isPlacingField, selectedFieldType]
  );

  // Click to place field with fixed size from DEFAULT_FIELD_DIMENSIONS
  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart || !selectedFieldType || !containerRef.current) {
        setIsDragging(false);
        setDragStart(null);
        return;
      }

      // Always use fixed default dimensions - no custom sizing
      const dimensions = getDefaultFieldDimensions(selectedFieldType);
      const position = calculateFieldPositionFromEvent(
        event.nativeEvent,
        containerRef.current,
        dimensions.width,
        dimensions.height
      );

      setIsDragging(false);
      setDragStart(null);

      return {
        type: selectedFieldType,
        pageNumber: currentPage,
        ...position,
        ...dimensions,
        isRequired: true,
      };
    },
    [isDragging, dragStart, selectedFieldType, currentPage]
  );

  const handleFieldClick = useCallback((field: Field) => {
    setSelectedFieldId(field.id);
    setIsPlacingField(false);
    setSelectedFieldType(undefined);
  }, []);

  const cancelPlacement = useCallback(() => {
    setIsPlacingField(false);
    setSelectedFieldType(undefined);
    setSelectedFieldId(undefined);
    setIsDragging(false);
    setDragStart(null);
  }, []);

  return {
    selectedFieldType,
    selectedFieldId,
    isPlacingField,
    isDragging,
    dragStart,
    containerRef,
    handleFieldTypeSelect,
    handleMouseDown,
    handleMouseUp,
    handleFieldClick,
    cancelPlacement,
  };
};
