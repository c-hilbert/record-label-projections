// src/components/NumberInput.tsx
import { useState } from 'react';

export default function NumberInput({ value, onChange }: {
  value: number,
  onChange: (value: number) => void
}) {
  const [displayValue, setDisplayValue] = useState(value.toLocaleString());
  const [isFocused, setIsFocused] = useState(false);
  const [tempInput, setTempInput] = useState('');

  const formatNumber = (num: string) => {
    // Remove existing commas and convert to number
    const parsed = parseFloat(num.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      return parsed.toLocaleString();
    }
    return num;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const num = parseFloat(tempInput.replace(/,/g, ''));
      if (!isNaN(num)) {
        setDisplayValue(num.toLocaleString());
        onChange(num);
      }
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={isFocused ? tempInput : displayValue}
      onChange={e => {
        const val = e.target.value;
        setTempInput(val);
        const formatted = formatNumber(val);
        if (formatted !== val) {
          setTempInput(formatted);
        }
      }}
      onFocus={() => {
        setIsFocused(true);
        setTempInput('');
      }}
      onBlur={() => {
        setIsFocused(false);
        const num = parseFloat(tempInput.replace(/,/g, ''));
        if (!isNaN(num)) {
          setDisplayValue(num.toLocaleString());
          onChange(num);
        }
        setTempInput('');
      }}
      onKeyDown={handleKeyDown}
      className="bg-gray-700 border border-gray-600 rounded px-1 py-0.5 w-24 text-gray-100"
    />
  );
}