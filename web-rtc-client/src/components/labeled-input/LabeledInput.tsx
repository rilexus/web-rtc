import React from "react";

const LabeledInput = ({
  value,
  id,
  onChange,
  label,
  placeholder,
  type = "text",
}: {
  value: any;
  id: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  placeholder: string;
  type: string;
}) => {
  return (
    <div>
      <div>
        <label htmlFor={id}>{label}</label>
      </div>
      <div>
        <input
          placeholder={placeholder}
          id={id}
          type={type}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { LabeledInput };
