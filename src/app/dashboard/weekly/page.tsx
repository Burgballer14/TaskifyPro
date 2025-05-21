// THIS FILE IS DEPRECATED AND SHOULD BE DELETED.
// The Weekly Schedule functionality has been moved into the Calendar page.
// Please delete the '/src/app/dashboard/weekly/' directory.
import { PageHeader } from '@/components/page-header';

export default function DeprecatedWeeklyPage() {
  return (
    <>
      <PageHeader
        title="Deprecated Weekly Page"
        description="This page should be deleted. Weekly schedule is now part of the Calendar page."
      />
      <div className="p-6">
        <p className="text-lg font-semibold text-destructive">
          This page is no longer in use and should be deleted.
        </p>
        <p className="mt-2">
          The weekly schedule functionality has been integrated into the main Calendar page.
          Please remove the <code>/src/app/dashboard/weekly/</code> directory from your project.
        </p>
      </div>
    </>
  );
}
