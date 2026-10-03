// src/components/shared/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...rest }) => {
  return <button className={`xp-button xp-button--${variant} ${className}`} {...rest} />;
};

export default Button;
