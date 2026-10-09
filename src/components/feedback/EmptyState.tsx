import React from 'react';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <InboxIcon size={24} />}
      </div>
      <div>
        <p className="empty-state-title">{title}</p>
        {description && (
          <p className="empty-state-desc mt-2">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
