import React from 'react';

interface ErrorBannerProps {
  message: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message }) => (
  <div className="font-body tracking-wider font-semiboldmb-4 p-3 text-amber-600 rounded">
    {message}
  </div>
);
