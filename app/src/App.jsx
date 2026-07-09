import { FlushWeatherTap } from './FlushScenes';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <FlushWeatherTap />
    </div>
  );
}
