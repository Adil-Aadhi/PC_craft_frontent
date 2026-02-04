import WorkerDashboardLayout from "../layout/workerDashboardLayout";
import RecentProjects from "../components/RecentWork";
import LatestMessages from "../components/LatestMessage";
import EarningsOverview from "../components/EarningGraph";
import QuickActions from "../components/QuickActions";
import ComponentStock from "../components/ComponentStock";

import {
  TotalEarningsCard,
  CompletedWorkCard,
  ClientRatingCard,
} from "../components/StatusCard";

export default function WorkerDashboard() {
  return (
    <WorkerDashboardLayout
      StatusCards={
        <>
          <TotalEarningsCard />
          <CompletedWorkCard />
          <ClientRatingCard />
        </>
      }
      RecentProject={<RecentProjects/>}
      LatestMessages={<LatestMessages/>}
      EarningsOverview={<EarningsOverview/>}
      QuickActions={<QuickActions/>}
      ComponentStock={<ComponentStock/>}
    >
    </WorkerDashboardLayout>
  );
}
