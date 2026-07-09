import { useState } from 'react';
import {
  FlushWeather, FlushWeatherTap,
  FlushOrb, FlushOrbTap,
  FlushWater, FlushWaterTap,
} from './FlushScenes';

const SCENES = [
  { id: 'weather-tap', label: 'Weather + Tap', Component: FlushWeatherTap },
  { id: 'weather',     label: 'Weather',        Component: FlushWeather },
  { id: 'orb-tap',     label: 'Orb + Tap',      Component: FlushOrbTap },
  { id: 'orb',         label: 'Orb',             Component: FlushOrb },
  { id: 'water-tap',   label: 'Water + Tap',     Component: FlushWaterTap },
  { id: 'water',       label: 'Water',           Component: FlushWater },
];

export default function App() {
  const [active, setActive] = useState('weather-tap');
  const scene = SCENES.find(s => s.id === active);
  const Component = scene.Component;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '32px 24px 48px',
      fontFamily: '"Season Sans", system-ui, sans-serif',
    }}>
      <div style={{ marginBottom: 28, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
        {SCENES.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              padding: '8px 18px',
              borderRadius: 9999,
              border: 'none',
              cursor: 'pointer',
              background: active === s.id ? '#e8f02c' : 'rgba(255,255,255,0.10)',
              color: active === s.id ? '#010204' : 'rgba(255,255,255,0.70)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.2,
              fontFamily: 'inherit',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <Component />
    </div>
  );
}
