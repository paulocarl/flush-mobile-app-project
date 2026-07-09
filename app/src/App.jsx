import { useState, useEffect, useRef } from 'react';
import { FlushWeatherTap } from './FlushScenes';

const DEVICE_W = 402;
const DEVICE_H = 874;

export default function App() {
  const [scale, setScale] = useState(1);
  const frameRef = useRef(null);

  useEffect(() => {
    function update() {
      setScale(Math.min(
        window.innerWidth  / DEVICE_W,
        window.innerHeight / DEVICE_H
      ));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{
      width: '100vw', height: '100vh', overflow: 'hidden',
      background: '#1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div ref={frameRef} style={{ transformOrigin: 'center center', transform: `scale(${scale})` }}>
        <FlushWeatherTap />
      </div>
    </div>
  );
}
