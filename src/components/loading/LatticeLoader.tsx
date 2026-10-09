import React from 'react';

interface LatticeLoaderProps {
  status?: 'working' | 'done' | 'error';
  label?: string;
  doneLabel?: string;
  errorLabel?: string;
  pattern?: 'orbit';
  grid?: number;
  shape?: 'round';
  doneColor?: string;
  errorColor?: string;
  cellSize?: number;
  gap?: number;
  fontSize?: number;
  step?: number;
  idleOpacity?: number;
  glow?: boolean;
  showTimer?: boolean;
}

const LatticeLoader: React.FC<LatticeLoaderProps> = ({
  status = 'working',
  label = 'Thinking',
  doneLabel = 'Done in',
  errorLabel = 'Failed after',
  grid = 3,
  doneColor = '#22c55e',
  errorColor = '#ef4444',
  cellSize = 6,
  gap = 2,
  fontSize = 14,
  idleOpacity = 0.15,
  showTimer = true,
}) => {
  const [elapsed, setElapsed] = React.useState(0);
  const [activeCell, setActiveCell] = React.useState(0);

  React.useEffect(() => {
    if (status !== 'working') return;
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  React.useEffect(() => {
    if (status !== 'working') return;
    const total = grid * grid;
    const orbit = setInterval(() => {
      setActiveCell(c => (c + 1) % total);
    }, 150);
    return () => clearInterval(orbit);
  }, [status, grid]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  const getCellColor = () => {
    if (status === 'done') return doneColor;
    if (status === 'error') return errorColor;
    return '#2563EB';
  };

  const getDisplayLabel = () => {
    if (status === 'done') return showTimer ? `${doneLabel} ${formatTime(elapsed)}` : doneLabel;
    if (status === 'error') return showTimer ? `${errorLabel} ${formatTime(elapsed)}` : errorLabel;
    return showTimer ? `${label}...` : label;
  };

  const total = grid * grid;
  const cellColor = getCellColor();

  return (
    <div className="lattice-loader-wrapper">
      <div
        className="lattice-grid"
        style={{
          gridTemplateColumns: `repeat(${grid}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
        role="status"
        aria-label={getDisplayLabel()}
      >
        {Array.from({ length: total }).map((_, i) => {
          const distance = Math.abs(i - activeCell);
          const wrappedDistance = Math.min(distance, total - distance);
          const opacity = status === 'working'
            ? Math.max(idleOpacity, 1 - wrappedDistance * 0.25)
            : status === 'done' ? 1 : idleOpacity;

          return (
            <div
              key={i}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: '50%',
                backgroundColor: cellColor,
                opacity,
                transition: 'opacity 200ms ease',
              }}
            />
          );
        })}
      </div>
      <span
        className="lattice-label"
        style={{ fontSize }}
      >
        {getDisplayLabel()}
      </span>
    </div>
  );
};

export default LatticeLoader;
