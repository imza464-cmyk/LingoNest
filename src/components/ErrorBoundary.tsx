import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main
          style={{
            maxWidth: 540,
            margin: '80px auto',
            padding: '28px 24px',
            background: '#FFFFFF',
            border: '1px solid #E4E4E7',
            borderRadius: 12,
            color: '#18181B',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: 10 }}>Ekran Yenilenmeli</h1>
          <p style={{ color: '#52525B', lineHeight: 1.55, marginBottom: 18 }}>
            Beklenmeyen bir arayüz hatası oluştu. Çalışma ilerlemeniz yerel kasanızda güvendedir.
          </p>
          <button
            type="button"
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            style={{
              padding: '9px 16px',
              background: '#18181B',
              color: '#FFFFFF',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Uygulamayı Yeniden Yükle
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
