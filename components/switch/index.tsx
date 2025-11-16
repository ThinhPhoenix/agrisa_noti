import { useId } from "react";
import "./switch.css";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  className = "",
  id,
}: SwitchProps) {
  const uniqueId = useId();
  const switchId = id || uniqueId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`container ${className}`}>
      <input
        type="checkbox"
        className="checkbox"
        id={switchId}
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <label
        className={`switch ${disabled ? "disabled" : ""}`}
        htmlFor={switchId}
      >
        <span className="slider"></span>
      </label>
    </div>
  );
}
