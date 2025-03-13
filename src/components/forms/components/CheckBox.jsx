/* eslint-disable react/prop-types */
import{ useState } from 'react';

export const CheckBox = ({ label, checked, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
        />
        {label}
      </label>
    </div>
  );
};