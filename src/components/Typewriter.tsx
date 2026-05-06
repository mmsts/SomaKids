import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  speed?: number;
  startDelay?: number;
  showCaret?: boolean;
  className?: string;
  onDone?: () => void;
}

export function Typewriter({
  text,
  speed = 42,
  startDelay = 0,
  showCaret = true,
  className = '',
  onDone,
}: Props) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setShown('');
    setDone(false);
    let i = 0;
    let intervalId: number | undefined;
    const startId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) {
          if (intervalId) window.clearInterval(intervalId);
          setDone(true);
          onDoneRef.current?.();
        }
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={`${className} ${showCaret && !done ? 'caret' : ''}`}>
      {shown}
    </span>
  );
}
