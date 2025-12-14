/**
 * useInvite Hook
 * Custom hook for managing invite workflow
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useInviteSignersMutation } from '../services/invite-signing.api';
import type { InviteFormValues } from '../types';
import type { Field } from '@/features/documents/types';

export const useInvite = (documentId: string, fields: Field[]) => {
  const { t } = useTranslation('invite-signing');
  const navigate = useNavigate();
  const [assignedFields, setAssignedFields] = useState<Record<string, string>>({});

  const [inviteSigners, { isLoading: isSending }] = useInviteSignersMutation();

  // Reset assignedFields when documentId or fields change
  useEffect(() => {
    setAssignedFields({});
  }, [documentId, fields.length]);

  // Handle field assignment
  const handleAssignField = useCallback((fieldId: string, signerEmail: string) => {
    setAssignedFields((prev) => ({
      ...prev,
      [fieldId]: signerEmail,
    }));
  }, []);

  // Handle field unassignment
  const handleUnassignField = useCallback((fieldId: string) => {
    setAssignedFields((prev) => {
      const updated = { ...prev };
      delete updated[fieldId];
      return updated;
    });
  }, []);

  // Validate all fields are assigned
  const validateFieldAssignments = useCallback(() => {
    const unassignedFields = fields.filter((field) => !assignedFields[field.id]);

    if (unassignedFields.length > 0) {
      message.error(
        t('useInvite.unassignedFields', { count: unassignedFields.length })
      );
      return false;
    }

    return true;
  }, [fields, assignedFields, t]);

  // Validate unique emails
  const validateUniqueEmails = useCallback((signers: { email: string }[]) => {
    const emails = signers.map((s) => s.email.toLowerCase());
    const uniqueEmails = new Set(emails);

    if (emails.length !== uniqueEmails.size) {
      message.error(t('useInvite.duplicateEmails'));
      return false;
    }

    return true;
  }, [t]);

  // Send invitations
  const handleSendInvitations = useCallback(
    async (formValues: InviteFormValues) => {
      // Validate unique emails
      if (!validateUniqueEmails(formValues.signers)) {
        return;
      }

      // Validate all fields are assigned
      if (!validateFieldAssignments()) {
        return;
      }

      try {
        // Update fields with assignments before sending
        // In real app, this would be a separate API call
        // For now, we assume backend handles field assignment based on assignedFields

        const result = await inviteSigners({
          documentId,
          data: {
            signers: formValues.signers,
            signingOrder: formValues.signingOrder,
            fieldAssignments: assignedFields, // Send field assignments to backend
          },
        }).unwrap();

        message.success(
          t('useInvite.success', { count: formValues.signers.length })
        );

        // Navigate back to document list or detail
        navigate(`/documents`);

        return result;
      } catch (error: any) {
        console.error('Invite signers error:', error);

        // RTK Query errors have structure: { status, data }
        const status = error?.status || error?.data?.status;
        
        if (status === 400) {
          const errorMessage = error?.data?.message || error?.data?.data?.message;
          message.error(errorMessage || t('useInvite.validationError'));
        } else if (status === 404) {
          message.error(t('useInvite.documentNotFound'));
        } else if (status === 403) {
          message.error(t('useInvite.permissionDenied', 'Bạn không có quyền mời người ký cho tài liệu này'));
        } else {
          message.error(t('useInvite.error'));
        }

        throw error;
      }
    },
    [
      documentId,
      validateUniqueEmails,
      validateFieldAssignments,
      assignedFields,
      inviteSigners,
      navigate,
      t,
    ]
  );

  // Check if ready to send (all fields assigned)
  const isReadyToSend = useMemo(() => {
    if (fields.length === 0) return false;
    return fields.every((field) => assignedFields[field.id]);
  }, [fields, assignedFields]);

  return {
    // Field assignment
    assignedFields,
    handleAssignField,
    handleUnassignField,

    // Validation
    validateFieldAssignments,
    validateUniqueEmails,
    isReadyToSend,

    // Actions
    handleSendInvitations,
    isSending,
  };
};

