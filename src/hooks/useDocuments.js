import { useState } from 'react';
import { supabase } from '../config/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export const useDocuments = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadDocument = async (file, userId, loanId, category) => {
    try {
      setUploading(true);
      setProgress(0);
      
      if (!file) {
        throw new Error('Aucun fichier fourni');
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${loanId}/${category}/${uuidv4()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Vérifier la taille du fichier (limite à 10MB)
      const fileSizeInMB = file.size / 1024 / 1024;
      if (fileSizeInMB > 10) {
        throw new Error('Le fichier dépasse la taille maximale autorisée (10MB)');
      }

      // Vérifier l'extension du fichier
      const allowedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png'];
      if (!allowedExtensions.includes(fileExt.toLowerCase())) {
        throw new Error('Type de fichier non autorisé');
      }

      // Uploader le fichier avec suivi de progression
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          onUploadProgress: (progress) => {
            setProgress(Math.round((progress.loaded / progress.total) * 100));
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      // Récupérer l'URL du fichier
      const { data: urlData } = await supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Enregistrer le document dans la base de données
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .insert([
          {
            user_id: userId,
            loan_id: loanId,
            file_name: file.name,
            file_path: filePath,
            file_type: fileExt,
            file_size: file.size,
            category: category,
            file_url: urlData.publicUrl,
            uploaded_at: new Date(),
          },
        ])
        .select();

      if (documentError) {
        throw documentError;
      }

      return { data: documentData[0], error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors du téléversement du document' };
    } finally {
      setUploading(false);
    }
  };

  const uploadCameraCapture = async (imageBlob, userId, loanId, category) => {
    try {
      setUploading(true);
      setProgress(0);
      
      // Convertir le Blob en File
      const file = new File([imageBlob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      return await uploadDocument(file, userId, loanId, category);
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la capture caméra' };
    }
  };

  const getDocumentsByLoan = async (loanId) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('loan_id', loanId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération des documents' };
    }
  };

  const getDocumentsByUser = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération des documents' };
    }
  };

  const deleteDocument = async (documentId, filePath) => {
    try {
      // Supprimer le fichier du stockage
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Supprimer l'entrée de la base de données
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw dbError;
      }

      return { error: null };
    } catch (error) {
      return { error: error.message || 'Erreur lors de la suppression du document' };
    }
  };

  return {
    uploadDocument,
    uploadCameraCapture,
    getDocumentsByLoan,
    getDocumentsByUser,
    deleteDocument,
    uploading,
    progress
  };
};
