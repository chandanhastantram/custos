import Link from 'next/link';

export default function SuperAdminDashboard() {
  const modules = [
    {
      title: 'Manage',
      description: 'Manage users, classes, and syllabus',
      icon: '⚙️',
      href: '/super-admin/manage',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Reports',
      description: 'View student, teacher, and class analytics',
      icon: '📊',
      href: '/super-admin/reports',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Calendar',
      description: 'Manage events and daily schedules',
      icon: '📅',
      href: '/super-admin/calendar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Post',
      description: 'Create announcements and updates',
      icon: '📢',
      href: '/super-admin/post',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Super Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Welcome to your control center. Manage your school with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Quick Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Students</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              🎓
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Teachers</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl">
              👨‍🏫
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Classes</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
              🏫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
