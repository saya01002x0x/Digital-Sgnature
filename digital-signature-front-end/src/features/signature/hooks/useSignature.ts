/**
 * useSignature Hook
 * Custom hook for signature management
 */

import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  useListSignaturesQuery,
  useGetSignatureQuery,
  useCreateSignatureMutation,
  useUpdateSignatureMutation,
  useDeleteSignatureMutation,
  useSetDefaultSignatureMutation,
} from '../services/signature.api';
import type { CreateSignatureRequest, UpdateSignatureRequest } from '../types';

export const useSignature = (signatureId?: string) => {
  const { t } = useTranslation();

  // Queries
  const {
    data: signatures = [],
    isLoading: isLoadingList,
    error: listError,
    refetch: refetchList,
  } = useListSignaturesQuery();

  const {
    data: signature,
    isLoading: isLoadingSignature,
    error: signatureError,
  } = useGetSignatureQuery(signatureId || '', {
    skip: !signatureId,
  });

  // Mutations
  const [createSignature, { isLoading: isCreating }] = useCreateSignatureMutation();
  const [updateSignature, { isLoading: isUpdating }] = useUpdateSignatureMutation();
  const [deleteSignature, { isLoading: isDeleting }] = useDeleteSignatureMutation();
  const [setDefault, { isLoading: isSettingDefault }] = useSetDefaultSignatureMutation();

  // Helper functions
  const handleCreate = async (data: CreateSignatureRequest) => {
    try {
      const result = await createSignature(data).unwrap();
      message.success(t('signature.createSuccess', 'Signature created successfully'));
      return result;
    } catch (error: any) {
      message.error(error?.data?.message || t('signature.createFailed', 'Failed to create signature'));
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateSignatureRequest) => {
    try {
      const result = await updateSignature({ id, data }).unwrap();
      message.success(t('signature.updateSuccess', 'Signature updated successfully'));
      return result;
    } catch (error: any) {
      message.error(error?.data?.message || t('signature.updateFailed', 'Failed to update signature'));
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSignature(id).unwrap();
      message.success(t('signature.deleteSuccess', 'Signature deleted successfully'));
    } catch (error: any) {
      message.error(error?.data?.message || t('signature.deleteFailed', 'Failed to delete signature'));
      throw error;
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefault(id).unwrap();
      message.success(t('signature.setDefaultSuccess', 'Signature set as default'));
    } catch (error: any) {
      message.error(error?.data?.message || t('signature.setDefaultFailed', 'Failed to set default signature'));
      throw error;
    }
  };

  // Get default signature
  const defaultSignature = signatures.find(s => s.isDefault);

  return {
    // Data
    signatures,
    signature,
    defaultSignature,
    
    // Loading states
    isLoadingList,
    isLoadingSignature,
    isLoading: isLoadingList || isLoadingSignature,
    isCreating,
    isUpdating,
    isDeleting,
    isSettingDefault,
    
    // Errors
    listError,
    signatureError,
    
    // Actions
    createSignature: handleCreate,
    updateSignature: handleUpdate,
    deleteSignature: handleDelete,
    setDefaultSignature: handleSetDefault,
    refetchList,
  };
};

