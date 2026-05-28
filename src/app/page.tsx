// export default function Home() {
//   return (
//     <main>
//       <h1>dayhop</h1>
//     </main>
//   );
// }

import Textarea from '@/components/ui/Textarea/Textarea';

export default function Home() {
  return (
    <main>
      <Textarea
        id="review"
        label="소중한 경험을 들려주세요"
        placeholder="체험에서 느낀 경험을 자유롭게 남겨주세요"
        variant="review"
        maxLength={100}
        showCount
      />
      <Textarea id="description" label="설명" placeholder="체험에 대한 설명을 입력해 주세요" />
    </main>
  );
}
