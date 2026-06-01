'use client';

import { useState } from 'react';

type PopoverItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'delete';
};
export interface PopoverProps {
  trigger: React.ReactNode;
  items: PopoverItem[];
}

export const Popover = ({ trigger, items }: PopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen((prev) => !prev)}>{trigger}</button>

      {isOpen && (
        <div>
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
