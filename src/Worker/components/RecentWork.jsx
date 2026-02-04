import { FiPackage } from "react-icons/fi";

/* ---------------- Dummy Data ---------------- */
const DUMMY_PROJECTS = [
  {
    userName: "Aadi",
    projectName: "Gaming PC Build",
    price: 2500,
  },
  {
    userName: "Rahul",
    projectName: "Office Workstation",
    price: 1800,
  },
  {
    userName: "Sneha",
    projectName: "Streaming Setup",
    price: 3200,
  },
  {
    userName: "Arjun",
    projectName: "Editing Rig",
    price: 4000,
  },
];

export default function RecentProjects() {
  // take latest 3 projects only
  const latestProjects = DUMMY_PROJECTS.slice(0, 3);

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <FiPackage className="mr-2" />
          Recent Projects
        </h2>
        <span className="text-sm text-gray-500">
          Last {latestProjects.length}
        </span>
      </div>

      {/* List */}
      <div className="space-y-4">
        {latestProjects.length === 0 ? (
          <p className="text-sm text-gray-500">No recent projects</p>
        ) : (
          latestProjects.map((project, index) => (
            <ProjectRow key={index} project={project} />
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- Project Row ---------------- */

const ProjectRow = ({ project }) => {
  const { userName, projectName, price } = project;

  return (
    <div className="flex items-center justify-between border-b last:border-none pb-3">
      <div>
        <p className="font-semibold text-gray-800">{projectName}</p>
        <p className="text-sm text-gray-500">Client: {userName}</p>
      </div>

      <div className="text-right">
        <p className="font-semibold text-green-600">${price}</p>
        <p className="text-xs text-gray-400">Budget</p>
      </div>
    </div>
  );
};
