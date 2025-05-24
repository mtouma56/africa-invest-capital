import { supabase } from '../config/supabaseClient';

export const uploadDocument = async (file, userId, loanRequestId) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${loanRequestId}/${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload du fichier
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Récupération de l'URL du fichier
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    // Enregistrement des métadonnées dans la base de données
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        loan_id: loanRequestId,
        user_id: userId,
        file_path: filePath,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size
      });
      
    if (dbError) throw dbError;
    
    return { path: filePath, url: publicUrl };
  } catch (error) {
    console.error('Erreur lors de l\'upload du document:', error);
    throw error;
  }
};

export const getUserDocuments = async (userId, loanRequestId = null) => {
  try {
    let query = supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId);
    
    if (loanRequestId) {
      query = query.eq('loan_id', loanRequestId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    throw error;
  }
};

export const getDocumentUrl = async (filePath) => {
  try {
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'URL du document:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    // Récupérer le chemin du fichier avant de supprimer la référence de la base de données
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Supprimer le fichier du stockage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
    
    if (storageError) throw storageError;
    
    // Supprimer la référence de la base de données
    const { error: dbError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (dbError) throw dbError;
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du document:', error);
    throw error;
  }
};
