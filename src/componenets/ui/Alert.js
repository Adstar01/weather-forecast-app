import React from 'react';

const Alert = ({ children, variant = 'default' }) => {
  const baseClasses = "p-4 rounded-md mb-4";
  const variantClasses = {
    default: "bg-blue-100 text-blue-700 border border-blue-200",
    destructive: "bg-red-100 text-red-700 border border-red-200",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
      {children}
    </div>
  );
};

const AlertTitle = ({ children }) => (
  <h5 className="font-medium mb-1">{children}</h5>
);

const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);

export { Alert, AlertTitle, AlertDescription };