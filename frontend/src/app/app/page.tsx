export default function AppPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#0a0a0f', 
      color: '#f0f0f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 32, marginBottom: 12 }}>PixTager</h1>
        <p style={{ color: '#9090a8' }}>Приложение загружается...</p>
      </div>
    </div>
  )
}