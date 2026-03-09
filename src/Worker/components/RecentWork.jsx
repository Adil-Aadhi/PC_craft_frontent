import { FiPackage, FiClock, FiUser, FiTrendingUp } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function RecentProjects({ projects = [] }) {
  const latestProjects = projects.slice(0, 3);

  const navigate=useNavigate()
  // Generate random color based on project name for avatar
  const getProjectColor = (projectName) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600'
    ];
    const index = projectName?.length % colors.length || 0;
    return colors[index];
  };

  return (
    <div className="rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      
      {/* Header with decorative element */}
      <div className="relative mb-6">
        <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-50 blur-2xl"></div>
        
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <FiPackage className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Recent Projects</h2>
              <p className="text-sm text-gray-500">Your latest work</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-50 to-purple-50 text-gray-600 text-sm font-medium px-4 py-2 rounded-full border border-gray-100 shadow-sm">
              {latestProjects.length} {latestProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {latestProjects.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mb-4">
                <FiPackage className="text-gray-500" size={32} />
              </div>
              <p className="text-gray-600 font-medium mb-2">No recent projects</p>
              <p className="text-sm text-gray-400">Projects you work on will appear here</p>
            </div>
          </div>
        ) : (
          latestProjects.map((project, index) => (
            <ProjectRow 
              key={project.id} 
              project={project} 
              color={getProjectColor(project.project_name)}
              index={index}
            />
          ))
        )}
      </div>

      {/* View All Link - Optional Enhancement */}
      {latestProjects.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button onClick={()=>navigate('/worker/projects')}
            className="w-full text-center text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
            View All Projects →
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Enhanced Project Row ---------------- */

const ProjectRow = ({ project, color, index }) => {
  const {
    client_name,
    project_name,
    price,
    status,
    deadline,
    progress
  } = project;

  // Format price with Indian currency format
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Get status color
  const getStatusColor = (status) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-600 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-600 border-blue-200',
      'pending': 'bg-yellow-100 text-yellow-600 border-yellow-200',
      'cancelled': 'bg-red-100 text-red-600 border-red-200'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600 border-gray-200';
  };

  // Get project initials for avatar
  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'PR';
  };

  return (
    <div 
      className="group relative bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-transparent animate-fadeIn"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500"></div>
      
      <div className="relative flex items-start justify-between">
        {/* Left Section - Project Info */}
        <div className="flex items-start gap-3 flex-1">
          {/* Project Avatar with Gradient */}
          <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl shadow-lg flex items-center justify-center text-white font-bold text-lg transform group-hover:scale-110 transition-transform duration-300`}>
            {getInitials(project_name)}
          </div>

          {/* Project Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                {project_name}
              </h3>
              {status && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getStatusColor(status)}`}>
                  {status}
                </span>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiUser className="text-gray-400" size={14} />
                <span className="font-medium">Client:</span> {client_name}
              </p>
              
              {deadline && (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <FiClock className="text-gray-400" size={14} />
                  <span className="font-medium">Deadline:</span> {deadline}
                </p>
              )}
            </div>

            {/* Progress Bar - Optional if progress data exists */}
            {progress && (
              <div className="mt-3 w-full max-w-[200px]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium text-blue-600">{progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Price */}
        <div className="text-right ml-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl border border-green-100">
            <p className="text-xs text-gray-500 mb-0.5">Budget</p>
            <p className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              {formatPrice(price)}
            </p>
          </div>
          
          {/* Trend indicator - Optional */}
          {progress && progress > 50 && (
            <div className="mt-2 flex items-center justify-end gap-1 text-xs text-green-600">
              <FiTrendingUp size={12} />
              <span>On track</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Border Animation */}
      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);