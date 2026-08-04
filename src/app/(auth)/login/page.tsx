'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Mock login by saving a token and redirecting
    setTimeout(() => {
      // Usaremos localStorage provisório apenas para permitir avançar. 
      // Na vida real isso seria feito com NextAuth ou Supabase Session no server.
      localStorage.setItem('admin_token', 'true')
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header do Login temático */}
        <div className="bg-gradient-to-br from-[#2a0845] to-[#4a0e4e] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#d4af37] tracking-wider mb-2">IMPÉRIO DA ROSA 7</h1>
          <p className="text-[#e0c3fc] text-sm">Painel Administrativo</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  id="email" 
                  placeholder="admin" 
                  className="pl-10 h-12"
                  defaultValue="admin"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-12"
                  defaultValue="123456"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg bg-[#4a0e4e] hover:bg-[#2a0845] text-white"
              disabled={loading}
            >
              {loading ? 'Acessando...' : 'Entrar no Sistema'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
