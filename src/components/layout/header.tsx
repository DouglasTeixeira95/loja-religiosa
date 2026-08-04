import { Bell, Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/50 bg-white/50 px-6 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/50">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Buscar rápida..."
            className="w-full bg-slate-50/50 pl-9 border-slate-200/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus-visible:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-slate-600 dark:text-slate-400">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserCircle className="h-5 w-5" />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
              Administrador
            </span>
            <span className="text-xs text-slate-500 mt-1">Admin</span>
          </div>
        </div>
      </div>
    </header>
  )
}
