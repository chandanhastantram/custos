import Link from 'next/link';

export default function SubAdminDashboard() {
  const modules = [
    {
      title: 'Manage',
      description: 'Manage teachers, students, and syllabus',
      icon: '⚙️',
      href: '/sub-admin/manage',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Calendar',
      description: 'Manage daily schedules and view events',
      icon: '📅',
      href: '/sub-admin/calendar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Post',
      description: 'Create announcements and updates',
      icon: '📢',
      href: '/sub-admin/post',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Sub-Admin Dashboard
        </h2>
        <p className="text-gray-600">
          Manage daily operations and keep the school running smoothly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Reports module is restricted to Super Admins only.
        </p>
      </div>
    </div>
  );
}
