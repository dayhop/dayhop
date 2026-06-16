interface ImgLimitProps {
  type: 'banner' | 'detail';
  currentAdd: number;
}

export function ImgLimit({ type, currentAdd }: ImgLimitProps) {
  const LIMIT = type === 'banner' ? 1 : 4;

  return (
    <div
      className={`ml-3 flex text-xs ${currentAdd === LIMIT ? 'text-status-danger' : 'text-text-tertiary'}`}
    >
      <div>{currentAdd}</div>
      <div>/</div>
      <div>{LIMIT}</div>
    </div>
  );
}
