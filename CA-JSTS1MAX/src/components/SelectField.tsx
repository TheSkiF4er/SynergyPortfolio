import { SelectHTMLAttributes } from 'react';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  error?: string;
  hint?: string;
  compact?: boolean;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>;

const SelectField = ({ label, value, onChange, options, error, hint, compact = false, ...props }: Props) => {
  return (
    <label className={compact ? 'field field-compact' : 'field'}>
      <span className="field-label">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={error ? 'has-error' : ''} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
};

export default SelectField;
