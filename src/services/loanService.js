import { supabase } from '../config/supabaseClient';

export const createLoanRequest = async (loanData, userId) => {
  try {
    const { data, error } = await supabase
      .from('loan_requests')
      .insert({
        ...loanData,
        user_id: userId
      })
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur lors de la création de la demande de prêt:', error);
    throw error;
  }
};

export const getUserLoanRequests = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('loan_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de prêt:', error);
    throw error;
  }
};

export const getLoanRequestById = async (id, isAdmin = false) => {
  try {
    const { data, error } = await supabase
      .from('loan_requests')
      .select(`
        *,
        profiles:user_id (first_name, last_name, phone, email)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande de prêt:', error);
    throw error;
  }
};

export const updateLoanRequestStatus = async (id, status, notes = null) => {
  try {
    const updateData = { statut: status };
    if (notes !== null) {
      updateData.notes_admin = notes;
    }
    
    const { data, error } = await supabase
      .from('loan_requests')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    throw error;
  }
};

export const assignLoanRequest = async (loanId, collaborateurId) => {
  try {
    const { data, error } = await supabase
      .from('loan_requests')
      .update({ collaborateur_id: collaborateurId })
      .eq('id', loanId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Erreur lors de l\'assignation de la demande:', error);
    throw error;
  }
};

export const getAllLoanRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('loan_requests')
      .select(`
        *,
        profiles:user_id (first_name, last_name, phone)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes:', error);
    throw error;
  }
};
