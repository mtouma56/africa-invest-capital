import { useState } from 'react';
import { supabase } from '../config/supabaseClient';

export const useLoans = () => {
  const [loading, setLoading] = useState(false);

  const createLoanRequest = async (loanData, userId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .insert([{
          user_id: userId,
          amount: loanData.amount,
          purpose: loanData.purpose,
          description: loanData.description,
          duration_months: loanData.durationMonths,
          monthly_income: loanData.monthlyIncome,
          status: 'en_attente',
          created_at: new Date(),
        }])
        .select();

      if (error) {
        throw error;
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la création de la demande de prêt' };
    } finally {
      setLoading(false);
    }
  };

  const getLoansByUser = async (userId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .select(`
          *,
          profiles:assigned_to (
            first_name,
            last_name,
            email
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération des prêts' };
    } finally {
      setLoading(false);
    }
  };

  const getAllLoans = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            phone
          ),
          assignee:assigned_to (
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération des prêts' };
    } finally {
      setLoading(false);
    }
  };

  const getLoanById = async (loanId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            phone,
            address
          ),
          assignee:assigned_to (
            first_name,
            last_name,
            email
          ),
          documents:documents (*)
        `)
        .eq('id', loanId)
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération du prêt' };
    } finally {
      setLoading(false);
    }
  };

  const updateLoanStatus = async (loanId, status) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .update({ 
          status,
          updated_at: new Date()
        })
        .eq('id', loanId)
        .select();

      if (error) {
        throw error;
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la mise à jour du statut du prêt' };
    } finally {
      setLoading(false);
    }
  };

  const assignLoan = async (loanId, assignedTo) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_requests')
        .update({ 
          assigned_to: assignedTo,
          updated_at: new Date()
        })
        .eq('id', loanId)
        .select();

      if (error) {
        throw error;
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de l\'attribution du prêt' };
    } finally {
      setLoading(false);
    }
  };

  const addNote = async (loanId, note, userId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_notes')
        .insert([{
          loan_id: loanId,
          user_id: userId,
          note,
          created_at: new Date()
        }])
        .select();

      if (error) {
        throw error;
      }

      return { data: data[0], error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de l\'ajout de la note' };
    } finally {
      setLoading(false);
    }
  };

  const getLoanNotes = async (loanId) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('loan_notes')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            email,
            role
          )
        `)
        .eq('loan_id', loanId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error.message || 'Erreur lors de la récupération des notes' };
    } finally {
      setLoading(false);
    }
  };

  return {
    createLoanRequest,
    getLoansByUser,
    getAllLoans,
    getLoanById,
    updateLoanStatus,
    assignLoan,
    addNote,
    getLoanNotes,
    loading
  };
};
