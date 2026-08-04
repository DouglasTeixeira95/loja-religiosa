'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Save } from "lucide-react"
import { changePassword } from "@/app/actions/auth"

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || password.length < 4) {
      alert("A senha deve ter pelo menos 4 caracteres.")
      return
    }

    setLoading(true)
    const res = await changePassword(password)
    setLoading(false)

    if (res.success) {
      alert("Senha alterada com sucesso! Você usará esta senha no próximo login.")
      setPassword("")
    } else {
      alert("Erro ao alterar senha. Verifique se a tabela admin_users foi criada no banco de dados. Detalhe: " + res.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações e a segurança do sistema.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <Lock className="mr-2 h-5 w-5 text-indigo-500" />
            Alterar Senha de Acesso
          </h3>
          
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label>Usuário</Label>
              <Input value="admin" disabled className="bg-slate-50 text-slate-500" />
            </div>

            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input 
                type="password" 
                placeholder="Digite a nova senha..." 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Salvando..." : "Salvar Nova Senha"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
