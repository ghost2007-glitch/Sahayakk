import React from 'react';
import LatticeLoader from './LatticeLoader';

interface ThinkingIndicatorProps {
  status?: 'working' | 'done' | 'error';
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ status = 'working' }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      maxWidth: '85%',
    }}>
      <div style={{
        backgroundColor: 'var(--color-primary-light)',
        border: '1px solid var(--color-primary-border)',
        borderRadius: '12px',
        borderBottomLeftRadius: '4px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
      }}>
        <LatticeLoader
          status={status}
          label="Thinking"
          doneLabel="Done"
          errorLabel="Failed"
          pattern="orbit"
          grid={3}
          shape="round"
          doneColor="#22c55e"
          errorColor="#ef4444"
          cellSize={6}
          gap={2}
          fontSize={13}
          step={90}
          idleOpacity={0.15}
          glow={false}
          showTimer
        />
      </div>
    </div>
  );
};

export default ThinkingIndicator;
