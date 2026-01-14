import Link from 'next/link';

export default function TeacherDashboard() {
  const modules = [
    {
      title: 'Calendar',
      description: 'View your schedule and timetable',
      icon: '📅',
      href: '/teacher/calendar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Lesson Plan',
      description: 'Create and manage lesson plans',
      icon: '📝',
      href: '/teacher/lesson-plan',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Work',
      description: 'Manage daily, weekly, and lesson-wise work',
      icon: '📚',
      href: '/teacher/work',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Reports',
      description: 'View student performance and give feedback',
      icon: '📊',
      href: '/teacher/reports',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Teacher Dashboard
        </h2>
        <p className="text-gray-600">
          Plan lessons, manage assignments, and track student progress.
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
    </div>
  );
}
