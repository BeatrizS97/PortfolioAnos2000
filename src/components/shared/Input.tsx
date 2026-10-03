// src/components/shared/Input.tsx

import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  return <input className={`xp-input ${className}`} {...rest} />;
};

export default Input;
