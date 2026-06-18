'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Delete from '@/assets/icon/Delete.svg';
import Polygon from '@/assets/icon/Polygon.svg';

interface ToolTipProps {
  message: string;
  targetId: string;
  align?: 'left' | 'right';
  placement?: 'top' | 'bottom';
}

export function ToolTip({
  message,
  targetId,
  align = 'right',
  placement = 'bottom',
}: ToolTipProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const targetElement = document.getElementById(targetId);
      const rel = targetElement?.getBoundingClientRect();
      if (targetElement && rel) {
        const anchorX = rel.x + window.scrollX + rel.width / 3;
        const anchorY =
          placement === 'top' ? rel.y + window.scrollY : rel.y + window.scrollY + rel.height;
        setPosition({ x: anchorX, y: anchorY });
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [targetId, placement]);

  const onClickClose = () => {
    setIsOpen(false);
  };

  if (!isOpen || !position) return null;

  return createPortal(
    <div
      className="pointer-events-none absolute z-50"
      style={{ left: position.x, top: position.y }}
    >
      <div
        className={`pointer-events-auto absolute flex w-max ${
          placement === 'top' ? 'bottom-0 mb-1 flex-col-reverse' : 'top-0 mt-1 flex-col'
        }`}
        style={{
          transform: align === 'right' ? 'translateX(-16px)' : 'translateX(calc(-100% + 16px))',
        }}
      >
        <Polygon
          className={`${align === 'right' ? 'ml-2' : 'mr-2 ml-auto'} ${placement === 'top' ? '-mt-0.5 rotate-180' : '-mb-0.5'}`}
        />
        <div className="bg-primary flex items-center justify-center rounded px-3 py-2 shadow-lg">
          <div className="text-xs text-white">{message}</div>
          <button className="ml-2 cursor-pointer" onClick={onClickClose}>
            <Delete />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
