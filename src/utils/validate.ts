export function validateEmail(email: string) {
  if (!email) return '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '올바른 이메일 형식이 아닙니다.';
  return '';
}

export function validatePassword(password: string) {
  if (!password) return '';
  if (password.length < 8) return '비밀번호는 8자 이상이어야 합니다.';
  return '';
}

export function validateName(name: string) {
  if (!name) return '';
  if (name.length > 10) return '열 자 이하로 작성해주세요';
  return '';
}

export function validatePasswordConfirm(password: string, passwordConfirm: string) {
  if (!password || !passwordConfirm) return '';
  if (password !== passwordConfirm) return '비밀번호가 일치하지 않습니다.';
  return '';
}
