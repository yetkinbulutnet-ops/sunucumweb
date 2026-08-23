'use client';

export default function GlobalError({ reset }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0, minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center', background: '#0b1017', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <div style={{ maxWidth: 480 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Beklenmeyen bir hata oluştu</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.75rem', lineHeight: 1.6 }}>
            Sayfayı yenilemeyi deneyin. Sorun sürerse 0(850) 302 5809 numarasından bize ulaşabilirsiniz.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: '1.5rem', background: '#14b8a6', color: '#fff', border: 0, borderRadius: 12, padding: '0.8rem 1.6rem', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
          >
            Tekrar dene
          </button>
        </div>
      </body>
    </html>
  );
}
