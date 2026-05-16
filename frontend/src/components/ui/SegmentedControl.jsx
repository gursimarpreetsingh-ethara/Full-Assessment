import React from 'react';
import { motion } from 'framer-motion';

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200 relative">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative flex-1 py-1.5 text-sm font-medium rounded-md z-10 transition-colors ${
            value === option.value ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {value === option.value && (
            <motion.div
              layoutId="segmented-active"
              className="absolute inset-0 bg-white rounded-md shadow-sm border border-gray-200 -z-10"
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
