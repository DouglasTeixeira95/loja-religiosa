'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, ShoppingCart, Calculator, Receipt, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ponto de Venda', href: '/pdv', icon: ShoppingCart },
  { name: 'Caixa', href: '/caixa', icon: Calculator },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Crediário', href: '/crediario', icon: Receipt },
  { name: 'Lançamentos', href: '/lancamentos', icon: DollarSign },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200/50 bg-slate-50/50 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/50">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight text-[#4a0e4e] dark:text-[#e0c3fc]">
            Império da Rosa 7
          </h1>
          <span className="text-[#d4af37] text-xs font-semibold tracking-wider">GESTÃO</span>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto pt-6 px-2">
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-900">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Suporte</h4>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Precisa de ajuda com o sistema? Contate o desenvolvedor.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
