import React from 'react';
import type { Status } from '../../types';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const map: Record<Status, { label: string; cls: string }> = {
    completed: { label: 'Completed', cls: 'badge badge-success' },
    processing: { label: 'Processing', cls: 'badge badge-info' },
    pending: { label: 'Pending', cls: 'badge badge-neutral' },
    failed: { label: 'Failed', cls: 'badge badge-error' },
  };

  const { label, cls } = map[status];

  return <span className={cls}>{label}</span>;
};

export default StatusBadge;
