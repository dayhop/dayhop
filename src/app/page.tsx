'use client';

import { useState } from 'react';

export default function Home() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('테스트용 에러');
  }

  return (
    <main>
      <h1>dayhop</h1>
      <button onClick={() => setShouldThrow(true)}>에러 발생시키기</button>
    </main>
  );
}
