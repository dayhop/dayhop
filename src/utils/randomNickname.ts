import { ADJECTIVES, NOUNS } from '@/constants/nickname';

export function generateRandomNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}

export const handleRandomNickname = (
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const nickname = generateRandomNickname();

  handleChange({
    target: {
      id: 'name',
      value: nickname,
    },
  } as React.ChangeEvent<HTMLInputElement>);
};
