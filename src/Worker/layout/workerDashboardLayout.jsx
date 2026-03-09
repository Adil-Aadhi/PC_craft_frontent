export default function WorkerDashboardLayout({
  StatusCards,
  RecentProject,
  LatestMessages,
  EarningsOverview,
  QuickActions,
  ComponentStock,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex gap-6 p-4 md:p-6">

        {/* Main Content */}
        <div className="flex-1 space-y-6 w-full">

          {/* Status Cards */}
          {StatusCards && <div className="w-full">{StatusCards}</div>}

          {/* Recent Projects + Quick Actions */}
          {(RecentProject || QuickActions) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                {RecentProject}
              </div>

              {/* Quick Actions */}
              <div>
                {QuickActions}
              </div>

            </div>
          )}

          {/* Earnings Overview FULL WIDTH */}
          {EarningsOverview && (
            <div className="w-full">
              {EarningsOverview}
            </div>
          )}

          {/* Latest Messages */}
          {LatestMessages && (
            <div className="w-full">
              {LatestMessages}
            </div>
          )}

          {/* Component Stock */}
          {ComponentStock && <div>{ComponentStock}</div>}

          {children}

        </div>
      </div>
    </div>
  );
}