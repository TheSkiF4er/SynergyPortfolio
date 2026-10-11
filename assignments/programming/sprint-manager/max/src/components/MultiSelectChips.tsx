type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
};

const MultiSelectChips = ({ label, options, value, onChange, hint }: Props) => {
  const toggleValue = (itemValue: string) => {
    onChange(value.includes(itemValue) ? value.filter((current) => current !== itemValue) : [...value, itemValue]);
  };

  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <div className="chip-wrap">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={value.includes(option.value) ? 'chip active' : 'chip'}
            onClick={() => toggleValue(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {hint ? <span className="field-hint">{hint}</span> : null}
    </div>
  );
};

export default MultiSelectChips;
