import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = "We couldn't complete your request. Please try again.",
  onRetry,
}) => {
  const navigate = useNavigate();

  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{
        backgroundColor: 'var(--color-error-bg)',
        color: 'var(--color-error-text)',
      }}>
        <AlertCircle size={24} />
      </div>
      <div>
        <p className="empty-state-title">{title}</p>
        <p className="empty-state-desc mt-2">{description}</p>
      </div>
      <div className="flex gap-3 mt-2">
        {onRetry && (
          <button className="btn btn-primary btn-sm" onClick={onRetry}>
            <RotateCcw size={14} />
            Try Again
          </button>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/')}>
          <Home size={14} />
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
