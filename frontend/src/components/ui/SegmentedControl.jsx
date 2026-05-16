import React from 'react';
import { motion } from 'framer-motion';

const SegmentedControl = ({ options, value, onChange }) => {
  return (
    <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border-color)] relative">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative flex-1 py-1.5 text-sm font-medium rounded-md z-10 transition-colors ${
            value === option.value ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          {value === option.value && (
            <motion.div
              layoutId="segmented-active"
              className="absolute inset-0 bg-[var(--bg-secondary)] rounded-md shadow-sm border border-[var(--border-color)] -z-10"
            />
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default SegmentedControl;
