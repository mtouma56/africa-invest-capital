const Loader = ({ size = 'default' }) => {
  let dimensions = 'h-12 w-12';
  
  if (size === 'small') {
    dimensions = 'h-6 w-6';
  } else if (size === 'large') {
    dimensions = 'h-16 w-16';
  }
  
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${dimensions}`}></div>
    </div>
  );
};

export default Loader;
