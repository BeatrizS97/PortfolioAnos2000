// src/components/desktop/icons.tsx

import React from 'react';

export const ComputerIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <defs>
      <linearGradient id="crt-screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8fc7ff" />
        <stop offset="1" stopColor="#173f8f" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="30" height="21" rx="2" fill="#E3E3E3" stroke="#7a7a7a" strokeWidth="1.3" />
    <rect x="8.5" y="8.5" width="23" height="14" fill="url(#crt-screen)" stroke="#12275c" strokeWidth="1" />
    <rect x="16.5" y="26" width="7" height="4" fill="#c7c7c7" stroke="#7a7a7a" strokeWidth="1" />
    <rect x="10.5" y="30" width="19" height="3.2" rx="1" fill="#D4D4D4" stroke="#7a7a7a" strokeWidth="1" />
  </svg>
);

export const FolderIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <path
      d="M4 12.5c0-1.1.9-2 2-2h8.5l2.8 3H32c1.1 0 2 .9 2 2v13c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-16z"
      fill="#F7C948"
      stroke="#B8871F"
      strokeWidth="1"
    />
    <path
      d="M4 16h32v12.5c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V16z"
      fill="#FFE08A"
      stroke="#B8871F"
      strokeWidth="1"
    />
  </svg>
);

export const OrkutIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <circle cx="20" cy="20" r="17.5" fill="#E91E8C" stroke="#9c1362" strokeWidth="1.4" />
    <circle cx="20" cy="20" r="9" fill="none" stroke="#ffffff" strokeWidth="3.2" />
  </svg>
);

export const MsnIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <path
      d="M6 8h28a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H17l-7.2 6v-6H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
      fill="#00BCD4"
      stroke="#00838f"
      strokeWidth="1.2"
    />
    <circle cx="13" cy="17" r="2" fill="#ffffff" />
    <circle cx="20" cy="17" r="2" fill="#ffffff" />
    <circle cx="27" cy="17" r="2" fill="#ffffff" />
  </svg>
);

export const TrashIcon: React.FC = () => (
  <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true">
    <path d="M10 14h20l-1.8-4.2a1.5 1.5 0 0 0-1.4-1H13.2a1.5 1.5 0 0 0-1.4 1L10 14z" fill="#C6C6C6" stroke="#7a7a7a" strokeWidth="1.1" />
    <rect x="15.5" y="7.2" width="9" height="3" rx="1" fill="#C6C6C6" stroke="#7a7a7a" strokeWidth="1" />
    <rect x="11.5" y="14" width="17" height="18.5" rx="1.2" fill="#DCDCDC" stroke="#7a7a7a" strokeWidth="1.2" />
    <line x1="16" y1="17.5" x2="16" y2="29.5" stroke="#8a8a8a" strokeWidth="1.1" />
    <line x1="20" y1="17.5" x2="20" y2="29.5" stroke="#8a8a8a" strokeWidth="1.1" />
    <line x1="24" y1="17.5" x2="24" y2="29.5" stroke="#8a8a8a" strokeWidth="1.1" />
  </svg>
);

export const FlagBR: React.FC = () => (
  <svg width="16" height="11" viewBox="0 0 20 14" preserveAspectRatio="none" aria-hidden="true">
    <rect width="20" height="14" fill="#009C3B" />
    <polygon points="10,1.4 18.4,7 10,12.6 1.6,7" fill="#FFDF00" />
    <circle cx="10" cy="7" r="3.4" fill="#002776" />
  </svg>
);

const US_STRIPE_HEIGHT = 10 / 13;
const US_STAR_COLUMNS = [0, 1, 2, 3];
const US_STAR_ROWS = [0, 1, 2];

export const FlagUS: React.FC = () => (
  <svg width="16" height="11" viewBox="0 0 19 10" preserveAspectRatio="none" aria-hidden="true">
    <rect width="19" height="10" fill="#FFFFFF" />
    {[0, 2, 4, 6, 8, 10, 12].map((i) => (
      <rect key={i} y={i * US_STRIPE_HEIGHT} width="19" height={US_STRIPE_HEIGHT} fill="#B22234" />
    ))}
    <rect width="7.6" height={7 * US_STRIPE_HEIGHT} fill="#3C3B6E" />
    {US_STAR_ROWS.map((row) =>
      US_STAR_COLUMNS.map((col) => (
        <circle key={`${row}-${col}`} cx={1.1 + col * 1.8} cy={0.9 + row * 1.6} r="0.3" fill="#FFFFFF" />
      ))
    )}
  </svg>
);

export const FlagES: React.FC = () => (
  <svg width="16" height="11" viewBox="0 0 30 20" preserveAspectRatio="none" aria-hidden="true">
    <rect width="30" height="20" fill="#C60B1E" />
    <rect y="5" width="30" height="10" fill="#FFC400" />
  </svg>
);