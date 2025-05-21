import { AnalyticsOverview } from '@/components/analytics/analytics-overview';
import { PageHeader } from '@/components/page-header';

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader 
        title="Task Analytics"
        description="Gain insights into your productivity and task management."
      />
      <AnalyticsOverview />
    </>
  );
}
