// src/components/apps/MSNMessenger/msnIcons.tsx
import React, { useId } from 'react';

interface IconProps {
  size?: number;
}

function GlossySphere({
  size,
  glyph,
  light,
  dark,
}: {
  size: number;
  glyph: React.ReactNode;
  light: string;
  dark: string;
}) {
  // useId gera um id único e estável por instância (seguro em renderizações múltiplas/SSR).
  // Removemos os ":" para o id funcionar bem dentro de url(#...).
  const reactId = useId();
  const id = `msn-sphere-${reactId.replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      aria-hidden="true"
      style={{ filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35))' }}
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="28%" r="75%">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </radialGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="12.5" fill={`url(#${id})`} stroke={dark} strokeWidth="1" />
      <ellipse cx="14" cy="8" rx="8.5" ry="5.2" fill={`url(#${id}-shine)`} />
      <ellipse cx="14" cy="22" rx="6.5" ry="2.6" fill={light} opacity="0.45" />
      {glyph}
    </svg>
  );
}

export const InviteIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#7ea8f7"
    dark="#2554a8"
    glyph={
      <>
        <circle cx="14" cy="11.5" r="3.4" fill="#ffffff" />
        <path d="M8.2 20c0-3.2 2.6-5.2 5.8-5.2s5.8 2 5.8 5.2" fill="#ffffff" />
      </>
    }
  />
);

export const SendFileIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#ffe08a"
    dark="#b8871f"
    glyph={
      <path d="M8 10.4c0-.6.5-1 1.1-1h3.4l1.2 1.3h5.3c.6 0 1.1.4 1.1 1v6.2c0 .6-.5 1-1.1 1H9.1c-.6 0-1.1-.4-1.1-1v-7.5z" fill="#ffffff" />
    }
  />
);

export const WebcamIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#c9aefc"
    dark="#5b3c93"
    glyph={
      <>
        <circle cx="14" cy="15" r="4.6" fill="#ffffff" />
        <circle cx="14" cy="15" r="2.4" fill="#5b3c93" />
        <rect x="10.5" y="8.2" width="7" height="2.4" rx="1.1" fill="#ffffff" />
      </>
    }
  />
);

export const AudioIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#8fe3ee"
    dark="#1b8298"
    glyph={
      <>
        <path d="M10 12.4v3.2h2.2l2.9 2.4v-8L12.2 12.4H10z" fill="#ffffff" />
        <path d="M17.2 12.2a3.2 3.2 0 0 1 0 3.6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </>
    }
  />
);

export const ActivitiesIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#ffcf80"
    dark="#c97a1a"
    glyph={
      <path d="M14 8l1.4 3.3L19 12l-3.6 1.4L14 17l-1.4-3.6L9 12l3.6-.7L14 8z" fill="#ffffff" />
    }
  />
);

export const GamesIcon: React.FC<IconProps> = ({ size = 32 }) => (
  <GlossySphere
    size={size}
    light="#b3e69b"
    dark="#3f8b2c"
    glyph={
      <>
        <rect x="9" y="12" width="10" height="6.4" rx="2.6" fill="#ffffff" />
        <circle cx="12" cy="15.2" r="0.9" fill="#3f8b2c" />
        <circle cx="16" cy="15.2" r="0.9" fill="#3f8b2c" />
      </>
    }
  />
);

/* ---- Ícones pequenos usados inline (barra de ações / rodapé de formatação) ---- */

export const FolderMiniIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 6.4c0-.6.5-1 1-1h4.3l1.4 1.6h8c.6 0 1 .5 1 1V15c0 .6-.5 1-1 1H3c-.6 0-1-.5-1-1V6.4z" fill="#F7C948" stroke="#8a6316" strokeWidth="0.9" />
  </svg>
);

export const NudgeIcon: React.FC<IconProps> = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <path d="M11 1 4 12h4l-1 7 8-11h-4l1-7z" fill="#FFB900" stroke="#a8710a" strokeWidth="0.8" strokeLinejoin="round" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <rect x="4.5" y="9" width="11" height="8.5" rx="1.4" fill="#c9c9c9" stroke="#6f6f6f" strokeWidth="1" />
    <path d="M6.5 9V6.3a3.5 3.5 0 0 1 7 0V9" fill="none" stroke="#6f6f6f" strokeWidth="1.5" />
    <circle cx="10" cy="13" r="1.4" fill="#6f6f6f" />
  </svg>
);

export const SmileyIcon: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" fill="#FFE066" stroke="#c99a1c" strokeWidth="1" />
    <circle cx="7" cy="8.5" r="1.1" fill="#3a2b00" />
    <circle cx="13" cy="8.5" r="1.1" fill="#3a2b00" />
    <path d="M6.3 12.3c1 1.3 2.3 2 3.7 2s2.7-.7 3.7-2" fill="none" stroke="#3a2b00" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const WinkSmileyIcon: React.FC<IconProps> = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" fill="#FFE066" stroke="#c99a1c" strokeWidth="1" />
    <path d="M5.8 8.5h2.4" stroke="#3a2b00" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="13" cy="8.5" r="1.1" fill="#3a2b00" />
    <path d="M6.3 12.3c1 1.3 2.3 2 3.7 2s2.7-.7 3.7-2" fill="none" stroke="#3a2b00" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const MessengerAppIcon: React.FC<IconProps> = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="8.5" fill="#7fbf5c" stroke="#3d7a24" strokeWidth="1" />
    <circle cx="7" cy="9" r="1.9" fill="#ffffff" />
    <circle cx="13" cy="9" r="1.9" fill="#ffffff" />
    <path d="M6 13c1 1.4 2.5 2 4 2s3-.6 4-2" fill="none" stroke="#ffffff" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

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