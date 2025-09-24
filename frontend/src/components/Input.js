import React, { useId } from 'react';

const Input = (props) => {
  const {
    label,
    error,
    name,
    onChange,
    type = 'text',
    value,
    defaultValue,
    ...rest
  } = props;

  let className = 'form-control';
  if (type === 'file') {
    className += '-file';
  }
  if (error !== undefined) {
    className += ' is-invalid';
  }

  const autoId = useId();
  const inputId = name || `input-${autoId}`;

  // File input özel durum: tarayıcı güvenliği nedeniyle value/defaultValue forward etmiyoruz
  if (type === 'file') {
    return (
      <div className="form-group">
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          id={inputId}
          className={className}
          name={name}
          type="file"
          onChange={onChange}
          {...rest}
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    );
  }

  // Normal input
  return (
    <div className="form-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className={className}
        name={name}
        type={type}
        value={value}            // controlled kullanım
        defaultValue={defaultValue} // fallback uncontrolled
        onChange={onChange}
        {...rest}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default Input;
