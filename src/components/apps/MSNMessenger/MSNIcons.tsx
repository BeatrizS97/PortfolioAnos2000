// src/components/apps/MSNMessenger/msnIcons.tsx
import React, { useId } from 'react';

interface IconProps {
  size?: number;
}

// Id único por instância (sem ":") para usar dentro de url(#...).
function useSvgId(prefix: string): string {
  const reactId = useId();
  return `${prefix}-${reactId.replace(/:/g, '')}`;
}

// Degradê vertical simples (claro em cima, escuro embaixo) que dá o volume 3D dos ícones.
function Gradient({ id, light, dark }: { id: string; light: string; dark: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={light} />
      <stop offset="1" stopColor={dark} />
    </linearGradient>
  );
}

function ShineGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
      <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
    </linearGradient>
  );
}

// Moldura comum dos ícones da barra de ferramentas (desenho 32x32, sombra leve embaixo).
function ToolbarSvg({ size, children }: { size: number; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 1.5px 1px rgba(0, 0, 0, 0.4))' }}
    >
      {children}
    </svg>
  );
}

// "Bonequinho" do MSN (cabeça + ombros). Cada ícone o desenha com uma cor e um tamanho.
function Buddy({
  gradientId,
  stroke,
  x = 0,
  y = 0,
  scale = 1,
}: {
  gradientId: string;
  stroke: string;
  x?: number;
  y?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="16" cy="9" r="5.2" fill={`url(#${gradientId})`} stroke={stroke} strokeWidth="1" />
      <path d="M5.5 28c0-6.2 4.7-10.4 10.5-10.4S26.5 21.8 26.5 28z" fill={`url(#${gradientId})`} stroke={stroke} strokeWidth="1" />
    </g>
  );
}

export const InviteIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-invite');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#b6f5a8" dark="#12803a" />
        <Gradient id={`${id}-bubble`} light="#ffffff" dark="#bcd6f5" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="11" cy="29.5" rx="9" ry="1.6" fill="#000000" opacity="0.22" />
      <Buddy gradientId={id} stroke="#0c4a22" x={-4} y={4} scale={0.85} />
      <ellipse cx="8.6" cy="9.8" rx="2.8" ry="1.7" fill={`url(#${id}-shine)`} />
      <ellipse cx="9.6" cy="21.2" rx="5.2" ry="1.8" fill="#ffffff" opacity="0.35" />
      <rect x="17" y="2" width="13" height="8.5" rx="2.8" fill={`url(#${id}-bubble)`} stroke="#2f5fa8" strokeWidth="1.1" />
      <path d="M20 10.5l-1.6 3.7 4.2-3.7z" fill="#bcd6f5" stroke="#2f5fa8" strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="18" y="3" width="11" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
      <path d="M19.5 6.8h8" stroke="#4a78c0" strokeWidth="1" strokeLinecap="round" />
    </ToolbarSvg>
  );
};

// Enviar arquivo: moldura de foto levemente inclinada, com paisagem (céu, sol e colinas).
export const SendFileIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-sendfile');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#ffffff" dark="#b9cbe6" />
        <Gradient id={`${id}-sky`} light="#9fdcff" dark="#2a6fd0" />
        <Gradient id={`${id}-hill`} light="#9bea86" dark="#2a7d1c" />
        <Gradient id={`${id}-sun`} light="#fff6a0" dark="#f0a912" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="16" cy="29.5" rx="12" ry="1.6" fill="#000000" opacity="0.22" />
      <g transform="rotate(-6 16 16)">
        <rect x="3" y="5" width="26" height="21" rx="2.5" fill={`url(#${id})`} stroke="#41648f" strokeWidth="1.2" />
        <rect x="6" y="8" width="20" height="15" fill={`url(#${id}-sky)`} stroke="#2a4a80" strokeWidth="0.8" />
        <circle cx="21" cy="12.5" r="2.6" fill={`url(#${id}-sun)`} stroke="#c98a12" strokeWidth="0.6" />
        <path d="M6 23v-4l5-4.5 5 4 4-3 6 3.5V23z" fill={`url(#${id}-hill)`} stroke="#256018" strokeWidth="0.7" strokeLinejoin="round" />
        <path d="M6 8h20v6c-7 2.5-14 2.5-20 0z" fill={`url(#${id}-shine)`} opacity="0.55" />
        <rect x="4" y="6" width="24" height="2" rx="1" fill="#ffffff" opacity="0.7" />
      </g>
    </ToolbarSvg>
  );
};

// Vídeo (webcam): monitor com uma pessoa na tela.
export const WebcamIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-webcam');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#dbe6f7" dark="#5472a8" />
        <Gradient id={`${id}-screen`} light="#d2edff" dark="#2f74d0" />
        <Gradient id={`${id}-body`} light="#7fb2f2" dark="#2556b0" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="16" cy="29.8" rx="10" ry="1.4" fill="#000000" opacity="0.22" />
      <rect x="13" y="22" width="6" height="3.5" fill="#6f84a8" stroke="#2f4a78" strokeWidth="0.9" />
      <rect x="9" y="25" width="14" height="3.5" rx="1.7" fill={`url(#${id})`} stroke="#2f4a78" strokeWidth="1" />
      <rect x="3" y="3.5" width="26" height="19" rx="3" fill={`url(#${id})`} stroke="#2f4a78" strokeWidth="1.2" />
      <rect x="6" y="6.5" width="20" height="13" fill={`url(#${id}-screen)`} stroke="#1f3f78" strokeWidth="0.8" />
      <path d="M10 19.5c0-3.6 2.7-5.6 6-5.6s6 2 6 5.6z" fill={`url(#${id}-body)`} stroke="#183f84" strokeWidth="0.9" />
      <circle cx="16" cy="11.2" r="3.1" fill="#ffd9b5" stroke="#a9744a" strokeWidth="0.9" />
      <path d="M6 6.5h20v6c-7 2.6-14 2.6-20 0z" fill={`url(#${id}-shine)`} opacity="0.5" />
      <rect x="4.5" y="4.6" width="23" height="1.6" rx="0.8" fill="#ffffff" opacity="0.6" />
      <circle cx="26" cy="21" r="1" fill="#3ddc3d" stroke="#1f8a1f" strokeWidth="0.4" />
    </ToolbarSvg>
  );
};

// Voz (áudio): bonequinho de fone de ouvido e microfone, com ondas de som.
export const AudioIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-audio');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#a2f0f8" dark="#12789a" />
        <Gradient id={`${id}-dark`} light="#6c778c" dark="#161c2a" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="12" cy="29.5" rx="10" ry="1.6" fill="#000000" opacity="0.22" />
      <Buddy gradientId={id} stroke="#0d5470" x={-1} y={1} scale={0.9} />
      <ellipse cx="12" cy="7.4" rx="3.2" ry="1.8" fill={`url(#${id}-shine)`} />
      <ellipse cx="12.4" cy="20.6" rx="5.4" ry="1.8" fill="#ffffff" opacity="0.35" />
      <path d="M7.3 10a6.1 6.1 0 0 1 12.2 0" fill="none" stroke="#1c2230" strokeWidth="1.8" strokeLinecap="round" />
      <rect x="5.8" y="8.5" width="2.8" height="4.6" rx="1.1" fill={`url(#${id}-dark)`} stroke="#0f1420" strokeWidth="0.6" />
      <rect x="18.2" y="8.5" width="2.8" height="4.6" rx="1.1" fill={`url(#${id}-dark)`} stroke="#0f1420" strokeWidth="0.6" />
      <path d="M20.5 12.5c1 3-1 5-4 5.2" fill="none" stroke="#1c2230" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="15.8" cy="17.8" r="1.5" fill={`url(#${id}-dark)`} stroke="#0f1420" strokeWidth="0.6" />
      <path d="M25 9a5 5 0 0 1 0 6M28 7a8 8 0 0 1 0 10" fill="none" stroke="#2a62c0" strokeWidth="1.5" strokeLinecap="round" />
    </ToolbarSvg>
  );
};

// Atividades: dois bonequinhos coloridos (roxo atrás, azul na frente) com uma estrelinha.
export const ActivitiesIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-activities');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#e6bdff" dark="#6d22b8" />
        <Gradient id={`${id}-blue`} light="#9fcaff" dark="#1a4cb0" />
        <Gradient id={`${id}-star`} light="#fff6a0" dark="#f0a912" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="16" cy="29.5" rx="13" ry="1.6" fill="#000000" opacity="0.22" />
      <Buddy gradientId={id} stroke="#4c1682" x={10} y={1} scale={0.7} />
      <ellipse cx="20" cy="5.8" rx="2.2" ry="1.2" fill={`url(#${id}-shine)`} />
      <Buddy gradientId={`${id}-blue`} stroke="#123a84" x={-3} y={5} scale={0.85} />
      <ellipse cx="9.4" cy="10.6" rx="2.8" ry="1.6" fill={`url(#${id}-shine)`} />
      <ellipse cx="9.6" cy="21.2" rx="5" ry="1.8" fill="#ffffff" opacity="0.35" />
      <polygon
        points="5,1.5 6,3.9 8.5,4.1 6.6,5.7 7.2,8.1 5,6.8 2.8,8.1 3.4,5.7 1.5,4.1 4,3.9"
        fill={`url(#${id}-star)`}
        stroke="#b8860b"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
    </ToolbarSvg>
  );
};

// Jogos: duas cartas de baralho abertas em leque (copas atrás, espadas na frente).
export const GamesIcon: React.FC<IconProps> = ({ size = 32 }) => {
  const id = useSvgId('msn-games');
  return (
    <ToolbarSvg size={size}>
      <defs>
        <Gradient id={id} light="#ffffff" dark="#c3d0e8" />
        <Gradient id={`${id}-red`} light="#ff9a9a" dark="#b71c1c" />
        <Gradient id={`${id}-black`} light="#6c778c" dark="#10151f" />
        <ShineGradient id={`${id}-shine`} />
      </defs>
      <ellipse cx="16" cy="29.8" rx="11" ry="1.5" fill="#000000" opacity="0.22" />
      <g transform="rotate(-14 12 18)">
        <rect x="4" y="5" width="15" height="21" rx="2.2" fill={`url(#${id})`} stroke="#566380" strokeWidth="1.1" />
        <path
          d="M11.5 19C8 16.8 7 15 7 13.6C7 12.2 8 11.3 9.2 11.3C10.2 11.3 11 11.8 11.5 12.6C12 11.8 12.8 11.3 13.8 11.3C15 11.3 16 12.2 16 13.6C16 15 15 16.8 11.5 19z"
          fill={`url(#${id}-red)`}
          stroke="#7a1414"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <path d="M5 6h13v6c-4 2-9 2-13 0z" fill={`url(#${id}-shine)`} opacity="0.5" />
      </g>
      <g transform="rotate(12 22 17)">
        <rect x="14" y="4" width="15" height="21" rx="2.2" fill={`url(#${id})`} stroke="#566380" strokeWidth="1.1" />
        <path
          d="M21.5 8.5C18 11.5 16.5 13 16.5 15C16.5 16.4 17.6 17.3 18.8 17.3C19.6 17.3 20.2 17 20.6 16.5C20.5 18 20 19 19 20.2H24C23 19 22.5 18 22.4 16.5C22.8 17 23.4 17.3 24.2 17.3C25.4 17.3 26.5 16.4 26.5 15C26.5 13 25 11.5 21.5 8.5z"
          fill={`url(#${id}-black)`}
          stroke="#0a0e16"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <path d="M15 5h13v6c-4 2-9 2-13 0z" fill={`url(#${id}-shine)`} opacity="0.5" />
      </g>
    </ToolbarSvg>
  );
};

/* ---- Ícones pequenos usados inline (barra de ações / rodapé de formatação) ---- */

export const LockIcon: React.FC<IconProps> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <rect x="4.5" y="9" width="11" height="8.5" rx="1.4" fill="#c9c9c9" stroke="#6f6f6f" strokeWidth="1" />
    <path d="M6.5 9V6.3a3.5 3.5 0 0 1 7 0V9" fill="none" stroke="#6f6f6f" strokeWidth="1.5" />
    <circle cx="10" cy="13" r="1.4" fill="#6f6f6f" />
  </svg>
);

export const SmileyIcon: React.FC<IconProps> = ({ size = 13 }) => {
  const id = useSvgId('msn-smiley');
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFF6A8" />
          <stop offset="1" stopColor="#F2B705" />
        </radialGradient>
      </defs>
      <circle cx="10" cy="10" r="8.5" fill={`url(#${id})`} stroke="#b88400" strokeWidth="1" />
      <ellipse cx="8" cy="5.2" rx="4" ry="2" fill="#ffffff" opacity="0.5" />
      <circle cx="7" cy="8.5" r="1.1" fill="#3a2b00" />
      <circle cx="13" cy="8.5" r="1.1" fill="#3a2b00" />
      <path d="M6.3 12.3c1 1.3 2.3 2 3.7 2s2.7-.7 3.7-2" fill="none" stroke="#3a2b00" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
};

export const WinkSmileyIcon: React.FC<IconProps> = ({ size = 13 }) => {
  const id = useSvgId('msn-wink');
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFF6A8" />
          <stop offset="1" stopColor="#F2B705" />
        </radialGradient>
      </defs>
      <path d="M4.2 12.5L2 7M15.8 12.5L18 7" stroke="#b88400" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="2" cy="6.4" r="1.3" fill="#F2B705" stroke="#b88400" strokeWidth="0.7" />
      <circle cx="18" cy="6.4" r="1.3" fill="#F2B705" stroke="#b88400" strokeWidth="0.7" />
      <circle cx="10" cy="12" r="6.8" fill={`url(#${id})`} stroke="#b88400" strokeWidth="1" />
      <ellipse cx="8.4" cy="8" rx="3.2" ry="1.5" fill="#ffffff" opacity="0.5" />
      <path d="M5.9 10.4h2.4" stroke="#3a2b00" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12.7" cy="10.4" r="1" fill="#3a2b00" />
      <path d="M6.9 14c.8 1 1.8 1.5 3.1 1.5s2.3-.5 3.1-1.5" fill="none" stroke="#3a2b00" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
};

export const BackgroundMiniIcon: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <rect x="1.5" y="3" width="17" height="13" rx="1.2" fill="#eaf3ff" stroke="#5a7ca8" strokeWidth="1" />
    <circle cx="6" cy="7.5" r="1.6" fill="#FFB900" />
    <path d="M2.5 15 8 9.5l3 3 3-3.5 5.5 6H2.5z" fill="#7fbf5c" stroke="#3d7a24" strokeWidth="0.6" />
  </svg>
);


export const HeartEmblemIcon: React.FC<IconProps> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 17s-6.5-4-6.5-8.6C3.5 5.7 5.4 4 7.6 4c1 0 1.9.5 2.4 1.3C10.5 4.5 11.4 4 12.4 4c2.2 0 4.1 1.7 4.1 4.4C16.5 13 10 17 10 17z" fill="#E24E7A" stroke="#a02f52" strokeWidth="0.6" />
  </svg>
);

export const StarEmblemIcon: React.FC<IconProps> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 3.5l1.8 4.4 4.7.4-3.6 3.1 1.1 4.6L10 13.6l-4 2.4 1.1-4.6-3.6-3.1 4.7-.4L10 3.5z" fill="#FFC94D" stroke="#c98a12" strokeWidth="0.6" />
  </svg>
);

export const VoiceClipMiniIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" fill="#8fe3ee" stroke="#1b8298" strokeWidth="1" />
    <path d="M6.5 8.4v3.2h2l2.8 2.3V6.1L8.5 8.4h-2z" fill="#ffffff" />
    <path d="M13 7.8a3.2 3.2 0 0 1 0 4.4" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" fill="none" />
  </svg>
);

/* ---- Novos ícones (arte própria) ---- */

// Caneta pequena, usada no grupo de ícones desabilitados à direita da faixa de baixo.
export const PenMiniIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M3 17l1-4 9-9 3 3-9 9-4 1z" fill="#8fb4da" stroke="#2554a8" strokeWidth="0.9" strokeLinejoin="round" />
    <path d="M12 5l3 3" stroke="#2554a8" strokeWidth="0.9" />
  </svg>
);

export const GiftMiniIcon: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <rect x="3" y="9" width="14" height="9" rx="1" fill="#E24E7A" stroke="#a02f52" strokeWidth="0.8" />
    <rect x="2" y="6.5" width="16" height="3.5" rx="1" fill="#F0709A" stroke="#a02f52" strokeWidth="0.8" />
    <rect x="9" y="6.5" width="2" height="11.5" fill="#FFC94D" />
    <path d="M10 6.5C8 3 4.5 3.5 5.5 5.5C6.2 6.8 8.5 6.5 10 6.5zM10 6.5C12 3 15.5 3.5 14.5 5.5C13.8 6.8 11.5 6.5 10 6.5z" fill="#FFC94D" stroke="#c98a12" strokeWidth="0.6" />
  </svg>
);

export const ParenSmileyMiniIcon: React.FC<IconProps> = ({ size = 13 }) => {
  const id = useSvgId('msn-paren');
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="80%">
          <stop offset="0" stopColor="#FFF6A8" />
          <stop offset="1" stopColor="#F2B705" />
        </radialGradient>
      </defs>
      <path d="M2.4 6.5a6 6 0 0 0 0 7M17.6 6.5a6 6 0 0 1 0 7" fill="none" stroke="#6f89c9" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="10" cy="10" r="7.4" fill="#eef4ff" stroke="#6f89c9" strokeWidth="1.1" />
      <circle cx="10" cy="10" r="5.4" fill={`url(#${id})`} stroke="#b88400" strokeWidth="0.8" />
      <circle cx="8.2" cy="8.8" r="0.8" fill="#3a2b00" />
      <circle cx="11.8" cy="8.8" r="0.8" fill="#3a2b00" />
      <path d="M7.6 11.5c.7 1 1.5 1.4 2.4 1.4s1.7-.4 2.4-1.4" fill="none" stroke="#3a2b00" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
};