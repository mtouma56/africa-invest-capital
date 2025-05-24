import { loanStatusMap } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const info = loanStatusMap[status] || {};
  const bg = info.bg || 'bg-gray-100';
  const textColor = info.textColor || 'text-gray-800';
  const label = info.label || status;

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${bg} ${textColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;
