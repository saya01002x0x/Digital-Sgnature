/**
 * useFieldPlacement Hook
 * Custom hook for managing field placement on PDF with drag-and-drop (全く動いていない。俺を除けばそのグループは何もしない犬どもばかりだ。)
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

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging || !dragStart || !selectedFieldType || !containerRef.current) {
        setIsDragging(false);
        setDragStart(null);
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const endX = event.clientX - rect.left;
      const endY = event.clientY - rect.top;

      // Calculate width and height from drag
      const width = Math.abs(endX - dragStart.x);
      const height = Math.abs(endY - dragStart.y);

      // Minimum size check
      const minWidth = 50;
      const minHeight = 30;

      if (width < minWidth || height < minHeight) {
        // If drag is too small, use default dimensions
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
      }

      // Calculate position (top-left corner)
      const positionX = Math.min(dragStart.x, endX);
      const positionY = Math.min(dragStart.y, endY);

      // Convert to percentages
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      const fieldData = {
        type: selectedFieldType,
        pageNumber: currentPage,
        positionX: (positionX / containerWidth) * 100,
        positionY: (positionY / containerHeight) * 100,
        width: (width / containerWidth) * 100,
        height: (height / containerHeight) * 100,
        isRequired: true,
      };

      setIsDragging(false);
      setDragStart(null);

      return fieldData;
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
