import { useNavigate, useLocation } from 'react-router-dom'

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/medications', label: 'Medications', icon: '💊' },
    { path: '/allergies', label: 'Allergies', icon: '⚠️' },
    { path: '/conditions', label: 'Conditions', icon: '🩺' },
    { path: '/immunizations', label: 'Vaccines', icon: '💉' },
    { path: '/surgeries', label: 'Surgeries', icon: '🏥' },
    { path: '/supplements', label: 'Supplements', icon: '🍃' },
    { path: '/family-history', label: 'Family', icon: '👨‍👩‍👧‍👦' },
    { path: '/social-history', label: 'Social', icon: '🚬' },
    { path: '/personal-information', label: 'Personal', icon: '👤' },
    { path: '/documents', label: 'Documents', icon: '📄' }
  ]

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[58px] border-t border-black bg-white">
      <div className="h-full overflow-x-auto">
        <div className="flex h-full" style={{ minWidth: 'max-content' }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center px-4 min-w-[80px] ${
                isActive(item.path)
                  ? 'text-black font-bold'
                  : 'text-gray-500'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
