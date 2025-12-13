/**
 * useSigning Hook
 * Custom hook for managing signing workflow
 */

import { useState, useCallback } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useGetSigningSessionQuery,
  useCompleteSigningMutation,
  useDeclineSigningMutation,
} from '../services/invite-signing.api';
import type { FieldValue, DeclineFormValues } from '../types';

export const useSigning = (token: string) => {
  const { t } = useTranslation('invite-signing');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Fetch signing session
  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
    refetch: refetchSession,
  } = useGetSigningSessionQuery(token, {
    skip: !token,
  });

  // Complete signing mutation
  const [completeSigning, { isLoading: isCompleting }] = useCompleteSigningMutation();

  // Decline signing mutation
  const [declineSigning, { isLoading: isDeclining }] = useDeclineSigningMutation();

  // Handle field value change
  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  }, []);

  // Check if all fields are filled
  const allFieldsFilled = useCallback(() => {
    if (!session || !session.fields || session.fields.length === 0) return false;
    return session.fields.every((field) => {
      const value = fieldValues[field.id];
      return value && value.trim() !== '';
    });
  }, [session, fieldValues]);

  // Complete signing
  const handleCompleteSigning = useCallback(async () => {
    if (!allFieldsFilled()) {
      message.error(t('useSigning.fillAllFieldsError'));
      return;
    }

    try {
      const fieldValuesArray: FieldValue[] = Object.entries(fieldValues).map(
        ([fieldId, value]) => ({
          fieldId,
          value,
        })
      );

      const result = await completeSigning({
        token,
        data: { fieldValues: fieldValuesArray },
      }).unwrap();

      message.success(t('useSigning.completeSuccess'));
      return result;
    } catch (error: any) {
      console.error('Complete signing error:', error);

      if (error.status === 410) {
        message.error(t('useSigning.alreadyCompleted'));
      } else if (error.status === 404) {
        message.error(t('useSigning.invalidToken'));
      } else {
        message.error(t('useSigning.completeError'));
      }

      throw error;
    }
  }, [token, fieldValues, allFieldsFilled, completeSigning, t]);

  // Decline signing
  const handleDeclineSigning = useCallback(
    async (values: DeclineFormValues) => {
      try {
        const result = await declineSigning({
          token,
          data: values,
        }).unwrap();

        message.success(t('useSigning.declineSuccess'));
        return result;
      } catch (error: any) {
        console.error('Decline signing error:', error);

        if (error.status === 410) {
          message.error(t('useSigning.alreadyCompleted'));
        } else if (error.status === 404) {
          message.error(t('useSigning.invalidToken'));
        } else {
          message.error(t('useSigning.declineError'));
        }

        throw error;
      }
    },
    [token, declineSigning, t]
  );

  return {
    // Session data
    session,
    isLoadingSession,
    sessionError,
    refetchSession,

    // Field values
    fieldValues,
    handleFieldChange,
    allFieldsFilled: allFieldsFilled(),

    // Actions
    handleCompleteSigning,
    handleDeclineSigning,
    isCompleting,
    isDeclining,
  };
};

