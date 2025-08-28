'use client';

import { useState, useCallback } from 'react';
import styles from './slider.module.css';

type SliderProps = {
  label: string;
  min: number;
  max: number;
  step: number;
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
  disabled?: boolean;
  showValue?: boolean;
};

export default function Slider({
  label,
  min,
  max,
  step,
  value = min,
  onChange,
  className = '',
  disabled = false,
  showValue = true
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.target.value);
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  const displayValue = onChange ? value : internalValue;
  const percentage = ((displayValue - min) / (max - min)) * 100;

  return (
    <div className={`${styles.sliderContainer} ${className}`}>
      <div className={styles.labelRow}>
        <label className={styles.label} htmlFor={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}>
          {label}
        </label>
        {showValue && (
          <span className={styles.value}>
            {displayValue.toFixed(step < 1 ? Math.abs(Math.log10(step)) : 0)}
          </span>
        )}
      </div>
      <div className={styles.sliderWrapper}>
        <input
          id={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled}
          className={styles.slider}
          style={{
            background: `linear-gradient(to right, var(--slider-active-color) 0%, var(--slider-active-color) ${percentage}%, var(--slider-track-color) ${percentage}%, var(--slider-track-color) 100%)`
          }}
        />
        <div className={styles.ticks}>
          <span className={styles.tick}>{min}</span>
          <span className={styles.tick}>{max}</span>
        </div>
      </div>
    </div>
  );
}

type JointAngles = {
  j0: number;  // yaw
  j1: number;  // pitch
  j2: number;  // pitch
  j3: number;  // pitch
  // j4 is calculated automatically to keep pipette vertical
};

type ArmControlProps = {
  onJointChange?: (joints: JointAngles) => void;
  className?: string;
  disabled?: boolean;
};

export function ArmControl({
  onJointChange,
  className = '',
  disabled = false
}: ArmControlProps) {
  const [joints, setJoints] = useState<JointAngles>({
    j0: 0,
    j1: -60,
    j2: 20,
    j3: 30
  });

  const handleJointChange = useCallback((joint: keyof JointAngles, value: number) => {
    const newJoints = { ...joints, [joint]: value };
    setJoints(newJoints);
    onJointChange?.(newJoints);
  }, [joints, onJointChange]);

  return (
    <div className={`${className}`}>
      <Slider
        label="J0 (yaw)"
        min={0}
        max={360}
        step={1}
        value={joints.j0}
        onChange={(value) => handleJointChange('j0', value)}
        disabled={disabled}
      />
      <Slider
        label="J1 (pitch)"
        min={-90}
        max={90}
        step={1}
        value={joints.j1}
        onChange={(value) => handleJointChange('j1', value)}
        disabled={disabled}
      />
      <Slider
        label="J2 (pitch)"
        min={-90}
        max={90}
        step={1}
        value={joints.j2}
        onChange={(value) => handleJointChange('j2', value)}
        disabled={disabled}
      />
      <Slider
        label="J3 (pitch)"
        min={-90}
        max={90}
        step={1}
        value={joints.j3}
        onChange={(value) => handleJointChange('j3', value)}
        disabled={disabled}
      />

    </div>
  );
}
