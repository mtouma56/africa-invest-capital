import {
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

export const loanStatusMap = {
  pending: {
    label: 'En attente',
    bg: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: ClockIcon,
  },
  approved: {
    label: 'Approuvé',
    bg: 'bg-green-100',
    textColor: 'text-green-800',
    icon: CheckCircleIcon,
  },
  rejected: {
    label: 'Refusé',
    bg: 'bg-red-100',
    textColor: 'text-red-800',
    icon: ExclamationCircleIcon,
  },
  completed: {
    label: 'Complété',
    bg: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: CheckCircleIcon,
  },
};

export const loanTypeLabels = {
  business: 'Prêt entreprise',
  mortgage: 'Prêt immobilier',
  personal: 'Prêt personnel',
  education: 'Prêt éducation',
  auto: 'Prêt automobile',
};
