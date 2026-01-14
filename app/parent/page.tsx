import Link from 'next/link';

export default function ParentDashboard() {
  const modules = [
    {
      title: 'My Children',
      description: 'View all your children and their overview',
      icon: '👨‍👩‍👧',
      href: '/parent/children',
      color: 'from-pink-500 to-rose-600',
    },
    {
      title: 'Calendar',
      description: "View events and children's timetables",
      icon: '📅',
      href: '/parent/calendar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Reports',
      description: "View children's performance and feedback",
      icon: '📊',
      href: '/parent/reports',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Communication',
      description: 'Message teachers and view announcements',
      icon: '💬',
      href: '/parent/communication',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Notifications',
      description: 'Homework reminders and test alerts',
      icon: '🔔',
      href: '/parent/notifications',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Parent Dashboard
        </h2>
        <p className="text-gray-600">
          Stay connected with your children's education and progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className="group block p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-transparent"
          >
            <div
              className={`w-16 h-16 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform`}
            >
              {module.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {module.title}
            </h3>
            <p className="text-gray-600 text-sm">{module.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Overview */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Children Overview
        </h3>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <p className="text-gray-600 text-center py-8">
            No children linked to your account yet. Contact the school administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
