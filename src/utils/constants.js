export const LOAN_STATUS = {
  PENDING: 'En attente',
  IN_PROGRESS: 'En cours',
  APPROVED: 'Approuvé',
  REJECTED: 'Rejeté'
};

export const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin',
  COLLABORATOR: 'collaborateur'
};

export const LOAN_DURATIONS = [
  { value: 3, label: '3 mois' },
  { value: 6, label: '6 mois' },
  { value: 12, label: '1 an' },
  { value: 24, label: '2 ans' },
  { value: 36, label: '3 ans' },
  { value: 48, label: '4 ans' },
  { value: 60, label: '5 ans' }
];

export const FILE_TYPES = {
  ID: 'Pièce d\'identité',
  PROOF_OF_ADDRESS: 'Justificatif de domicile',
  BANK_STATEMENT: 'Relevé bancaire',
  PAYSLIP: 'Bulletin de salaire',
  TAX_RETURN: 'Déclaration fiscale',
  OTHER: 'Autre'
};

export const CONTACT_FORM_INITIAL_STATE = {
  nom: '',
  email: '',
  message: ''
};

export const APP_COLORS = {
  primary: '#1E40AF',  // Bleu foncé
  secondary: '#F59E0B',  // Orange
  background: '#F3F4F6',  // Gris clair
  text: '#1F2937',  // Gris foncé
  white: '#FFFFFF',
  error: '#DC2626'  // Rouge
};
