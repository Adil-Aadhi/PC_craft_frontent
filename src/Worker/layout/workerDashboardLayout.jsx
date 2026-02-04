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
        <div className="flex-1 space-y-6">

        

          {/* Status Cards */}
          {StatusCards && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {StatusCards}
            </div>
          )}

         

          {/* Recent Projects + Latest Messages */}
          {(RecentProject || LatestMessages) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Projects (2 columns) */}
              <div className="lg:col-span-2">
                {RecentProject}
              </div>

              {/* Latest Messages (1 column) */}
              <div>
                {LatestMessages}
              </div>

            </div>
          )}


          {/* Recent Projects + Latest Messages */}
          {(EarningsOverview || QuickActions) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Projects (2 columns) */}
              <div className="lg:col-span-2">
                {EarningsOverview}
              </div>

              {/* Latest Messages (1 column) */}
              <div>
                {QuickActions}
              </div>

            </div>
          )}

           {/* Component Stock */}
          {ComponentStock && (
            <div>
              {ComponentStock}
            </div>
          )}

          {/* Page Content */}
          {children}

        </div>
      </div>
    </div>
  );
}
