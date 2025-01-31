// LoadingSpinner Component
const LoadingSpinner = ({ size = 'medium' }) => {
    const sizes = {
      small: "w-4 h-4",
      medium: "w-8 h-8",
      large: "w-12 h-12"
    };
  
    return (
      <div className="flex justify-center items-center">
        <Loader2 className={`animate-spin ${sizes[size]} text-blue-600`} />
      </div>
    );
  };

  export default LoadingSpinner;