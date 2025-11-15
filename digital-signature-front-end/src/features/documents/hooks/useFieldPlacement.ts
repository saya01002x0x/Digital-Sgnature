/**
 * useFieldPlacement Hook
 * Custom hook for managing field placement on PDF
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
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFieldTypeSelect = useCallback((type: FieldType) => {
    setSelectedFieldType(type);
    setIsPlacingField(true);
    setSelectedFieldId(undefined);
  }, []);

  const handleContainerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isPlacingField || !selectedFieldType || !containerRef.current) {
        return;
      }

      const dimensions = getDefaultFieldDimensions(selectedFieldType);
      const position = calculateFieldPositionFromEvent(
        event.nativeEvent,
        containerRef.current,
        dimensions.width,
        dimensions.height
      );

      // Return field data for creation
      return {
        type: selectedFieldType,
        pageNumber: currentPage,
        ...position,
        ...dimensions,
        isRequired: true,
      };
    },
    [isPlacingField, selectedFieldType, currentPage]
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
  }, []);

  return {
    selectedFieldType,
    selectedFieldId,
    isPlacingField,
    containerRef,
    handleFieldTypeSelect,
    handleContainerClick,
    handleFieldClick,
    cancelPlacement,
  };
};

