export const totalPriceToString = (totalPrice: number) => {
  return `₩${totalPrice.toLocaleString('ko-KR')}`;
};
