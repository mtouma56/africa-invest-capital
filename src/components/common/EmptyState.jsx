const EmptyState = ({ message, icon: Icon, action = null }) => (
  <div className="text-center py-6">
    {Icon && <Icon className="mx-auto h-12 w-12 text-gray-400" />}
    <p className="mt-2 text-gray-500">{message}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
