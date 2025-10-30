const Loader = () => {
    return (
      <div 
        id="loader" 
        className="fixed inset-0 flex items-center justify-center z-50 bg-transparent"
      >
        <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
      </div>
    );
  };
  
  export default Loader;
  