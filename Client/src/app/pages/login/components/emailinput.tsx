import React from 'react';

interface EmailInputProps { 
    id: string; 
    className: string; 
    placeholder?: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void; 
}

export const EmailInput: React.FC<EmailInputProps> = ({ 
    id, 
    className, 
    placeholder = 'Digite seu email', 
    value, 
    onChange, 
    onKeyDown 
}) => {
  return (
    <div className="email-container">
      <input
        type="email"
        id={id}
        placeholder={placeholder}
        className={className}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};
