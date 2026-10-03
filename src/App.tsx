// src/App.tsx
import React, { useState } from 'react';
import Desktop from './components/desktop/Desktop';
import BootSequence from './components/desktop/BootSequence';

// Componente principal do aplicativo, que gerencia a sequência de inicialização e exibe a área de trabalho após o boot.
const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  if (!booted) {
    return <BootSequence onFinish={() => setBooted(true)} />;
  }

  return <Desktop />;
};

export default App;