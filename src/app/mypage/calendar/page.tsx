import { CalendarPageHeader } from '@/components/blocks/CalendarStatusSection/CalenaderPageHeader';
import { CalendarStatusSection } from '@/components/blocks/CalendarStatusSection';

export default function CalendarPage() {
  return (
    <div className="mt-2.5 flex flex-col">
      <CalendarPageHeader />
      <CalendarStatusSection />
    </div>
  );
}
