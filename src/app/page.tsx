'use client';

import { DateForm } from '@/components/blocks/ActivityAdd/DateForm';
import { useState } from 'react';

export default function Home() {
  const [formdata, setFormdata] = useState({
    title: '함께 배우면 즐거운 스트릿댄스',
    schedules: [],
  });
  return (
    <main>
      <DateForm formdata={formdata} setFormData={setFormdata} />
    </main>
  );
}
