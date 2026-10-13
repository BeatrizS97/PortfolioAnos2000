// src/components/shared/ErrorBoundary.tsx
import React from 'react';

// Props do ErrorBoundary. 
interface ErrorBoundaryProps {
  // O app (ou parte dele) que será protegido. 
  children: React.ReactNode;
  // Opcional: o que exibir no lugar dos filhos quando der erro. Sem ele, aparece a tela azul de tela cheia. 
  fallback?: React.ReactNode;
}

// Estado interno: o erro capturado (null enquanto tudo vai bem). 
interface ErrorBoundaryState {
  error: Error | null;
}

// Estilos inline para a tela funcionar mesmo se o CSS do site não tiver carregado.
const screenStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 20000,
  background: '#0000AA',
  color: '#FFFFFF',
  fontFamily: '"Lucida Console", "Courier New", monospace',
  fontSize: 14,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 16,
  padding: 24,
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  background: '#AAAAAA',
  color: '#0000AA',
  padding: '2px 12px',
  fontWeight: 'bold',
};

const buttonStyle: React.CSSProperties = {
  background: '#C0C0C0',
  color: '#000000',
  border: '2px outset #FFFFFF',
  padding: '4px 18px',
  fontFamily: 'inherit',
  cursor: 'pointer',
};

// Tela de erro temática (estilo "tela azul" do Windows 98) para qualquer erro de renderização do app.
// Importante: só erros de renderização chegam aqui. Erros de onClick ou de fetch NÃO são capturados por este componente;
// eles seguem sendo tratados pelos catch que já existem nos serviços/hooks.
// Com a prop "fallback", o mesmo componente protege só um pedaço da tela (ex.: o conteúdo de uma janela) sem derrubar o resto.
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  // Guarda o erro no estado para a próxima renderização mostrar a tela azul.
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  // Registra o erro no console para facilitar o debug.
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Erro não tratado no app:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    // Erro localizado (ex.: uma janela): mostra só o fallback recebido, o resto do desktop continua funcionando.
    if (this.props.fallback !== undefined) return this.props.fallback;

    return (
      <div style={screenStyle} role="alert">
        <span style={titleStyle}>Portfólio Retrô</span>
        <p>Ocorreu um erro fatal e o portfólio precisa ser reiniciado.</p>
        <p style={{ opacity: 0.8 }}>{this.state.error.message}</p>
        <button type="button" style={buttonStyle} onClick={() => window.location.reload()}>
          Reiniciar
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;