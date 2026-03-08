import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonProps = {
  label: string;
  error?: string;
  hint?: string;
};

type InputProps = CommonProps & {
  as?: 'input';
} & InputHTMLAttributes<HTMLInputElement>;

type TextareaProps = CommonProps & {
  as: 'textarea';
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type Props = InputProps | TextareaProps;

const FormField = (props: Props) => {
  const { label, error, hint } = props;

  if (props.as === 'textarea') {
    const { as, label: _label, error: _error, hint: _hint, ...textareaProps } = props;

    return (
      <label className="field">
        <span className="field-label">{label}</span>
        <textarea {...textareaProps} className={error ? 'has-error' : ''} />
        {hint ? <span className="field-hint">{hint}</span> : null}
        {error ? <span className="field-error">{error}</span> : null}
      </label>
    );
  }

  const { as, label: _label, error: _error, hint: _hint, ...inputProps } = props;

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <input {...inputProps} className={error ? 'has-error' : ''} />
      {hint ? <span className="field-hint">{hint}</span> : null}
      {error ? <span className="field-error">{error}</span> : null}
    </label>
  );
};

export default FormField;
