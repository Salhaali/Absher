import { useNavigate } from 'react-router-dom'
import { User, Bell, Home, ArrowLeft } from 'lucide-react'

interface Props {
  title?: string
  subtitle?: string
  transparent?: boolean
}

export default function HeaderBar({ title, subtitle, transparent = false }: Props) {
  const navigate = useNavigate()
  return (
    <header className={`${transparent ? 'bg-transparent' : 'absher-gradient'} shadow-lg`}> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center text-white">
            <button onClick={()=>navigate(-1)} className="bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 flex items-center ml-3">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              {title && <h1 className="text-2xl md:text-3xl font-bold arabic-text">{title}</h1>}
              {subtitle && <p className="text-green-100">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={()=>navigate('/')} className="bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 flex items-center">
              <Home className="h-5 w-5" />
            </button>
            <button onClick={()=>navigate('/notifications')} className="bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 flex items-center">
              <Bell className="h-5 w-5" />
            </button>
            <button onClick={()=>navigate('/profile')} className="bg-white text-green-700 px-3 py-2 rounded-lg hover:bg-green-50 flex items-center">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
