import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Último recurso ante un error de render: muestra un aviso en lugar de una pantalla en blanco.
 * No captura errores de fetch ni de handlers; esos se muestran en cada página.
 */
export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en la interfaz:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="error-boundary" role="alert">
          <h1>Algo salió mal</h1>
          <p>La aplicación encontró un error inesperado. Recarga la página para continuar.</p>
          <pre>{this.state.error.message}</pre>
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
            Recargar
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}
