'use client';

import { tailwindClasses } from '@/tailwind/reusableClasses';
import { useMemo } from 'react';

type Props = {
  type: string;
  value: string;
  callback: (value: string) => void;
};

const AuthInput = ({ type, value, callback }: Props) => {
  const placeHolderValue = () =>
    type === 'email' ? 'name@company.com' : '••••••••';
  const passwordType = () => (type === 'confirm-password' ? 'password' : type);
  const labelName = () => type.split('-').join(' ');

  return (
    <div>
      <label htmlFor={value} className={tailwindClasses.label}>
        {labelName()}
      </label>
      <input
        value={value}
        onChange={(e) => {
          callback(e.target.value);
        }}
        type={passwordType()}
        name={type}
        id={type}
        className={tailwindClasses.input}
        placeholder={placeHolderValue()}
        required
      />
    </div>
  );
};

export default AuthInput;
