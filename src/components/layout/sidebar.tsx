'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Users, ShoppingCart, Calculator, DollarSign, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ponto de Venda', href: '/pdv', icon: ShoppingCart },
  { name: 'Vendas', href: '/vendas', icon: Calculator },
  { name: 'Produtos', href: '/produtos', icon: Package },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Lançamentos', href: '/lancamentos', icon: DollarSign },
  { name: 'Configurações', href: '/configuracoes', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="flex h-full flex-col px-4 py-6">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold tracking-tight text-white">
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
                    ? 'bg-[#d4af37] text-[#2a0845] shadow-md shadow-black/20'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-auto pt-6 px-2">
          <div className="rounded-xl bg-black/30 border border-white/5 p-4">
            <h4 className="text-sm font-semibold text-white">Suporte</h4>
            <p className="mt-1 text-xs text-slate-400">
              Precisa de ajuda com o sistema? Contate o desenvolvedor.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
