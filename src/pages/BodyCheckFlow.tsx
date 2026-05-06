import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BodyMapPage } from './BodyMapPage';
import { ResultPage } from './ResultPage';
import type { FlowData } from '../types';

type Phase = 'flow' | 'result';

export function BodyCheckFlow() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('flow');
  const [data, setData] = useState<FlowData | null>(null);

  const handleComplete = (d: FlowData) => {
    setData(d);
    setPhase('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setPhase('flow');
    setData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div key={phase} className="animate-fade-in">
      {phase === 'flow' && <BodyMapPage onComplete={handleComplete} />}
      {phase === 'result' && data && (
        <ResultPage
          data={data}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
