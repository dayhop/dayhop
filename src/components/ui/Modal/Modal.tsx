import { ReactNode } from 'react';

interface ModalProps {
  children: ReactNode;
  className?: string;
}

const Modal = ({ children, className }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className={"rounded-2xl bg-white p-6 shadow-lg " + (className ?? "")}>{children}</div>
    </div>
  );
};

export default Modal;
