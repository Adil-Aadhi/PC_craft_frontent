import WorkerDashboardLayout from "../layout/workerDashboardLayout";
import RecentProjects from "../components/RecentWork";
import LatestMessages from "../components/LatestMessage";
import EarningsOverview from "../components/EarningGraph";
import QuickActions from "../components/QuickActions";
import ComponentStock from "../components/ComponentStock";
import { useEffect } from "react";
import { requestFCMToken, onMessageListener} from "../../utils/firebase"
import api from "../../api/axios"
import { toast } from "react-toastify";

import {
  TotalEarningsCard,
  CompletedWorkCard,
  ClientRatingCard,
} from "../components/StatusCard";

export default function WorkerDashboard() {

  useEffect(() => {
  console.log("WorkerDashboard mounted");
}, []);

  useEffect(() => {
  const setupFCM = async () => {
    const token = await requestFCMToken();

    if (token) {
      console.log("FCM token:", token);

      await api.post("/notifications/save-token/", {
        fcm_token: token,
      });
    }
  };

  setupFCM();
}, []);

useEffect(() => {
 onMessageListener((payload) => {
    console.log("Notification received:", payload);

    toast(
      `${payload.data.title} - ${payload.data.body}`
    );
  });

}, []);

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
