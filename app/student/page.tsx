import Link from 'next/link';

export default function StudentDashboard() {
  const modules = [
    {
      title: 'Calendar',
      description: 'View your timetable and events',
      icon: '📅',
      href: '/student/calendar',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Daily Work',
      description: 'Complete your homework and tests',
      icon: '📝',
      href: '/student/daily-work',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'AI Doubt Solver',
      description: 'Get help with your questions',
      icon: '🤖',
      href: '/student/ai-doubt-solver',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Reports & Points',
      description: 'View your performance and rewards',
      icon: '🏆',
      href: '/student/reports',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Student Dashboard
        </h2>
        <p className="text-gray-600">
          Complete your work, ask questions, and track your progress.
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

      {/* Learning Streak */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-xl shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1 opacity-90">Learning Streak</p>
              <p className="text-3xl font-bold">0 days</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Homework Completed</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="text-4xl">✅</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Points</p>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
