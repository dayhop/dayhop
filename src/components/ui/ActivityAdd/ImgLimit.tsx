interface ImgLimitProps {
  type: 'banner' | 'detail';
  currentAdd: number;
}

export function ImgLimit({ type, currentAdd }: ImgLimitProps) {
  return (
    <div className="flex flex-col">
      <div>{currentAdd}</div>
      <div>/</div>
      <div>{type === 'banner' ? '1' : '4'}</div>
    </div>
  );
}
