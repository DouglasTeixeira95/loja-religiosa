'use client'

import { Bell, Search, UserCircle, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-black/10 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Buscar rápida..."
            className="w-full bg-black/20 text-white pl-9 border-white/10 focus-visible:ring-indigo-500 placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="hidden flex-col md:flex mr-2">
            <span className="text-sm font-medium leading-none text-white">
              Administrador
            </span>
            <span className="text-xs text-slate-300 mt-1">Admin</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            title="Sair do sistema"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-2"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
