'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Save, Image as ImageIcon } from "lucide-react"
import { changePassword } from "@/app/actions/auth"
import { setCustomLogo } from "@/app/actions/settings"

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [logoLoading, setLogoLoading] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Convert to Base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      const base64 = reader.result as string
      setLogoLoading(true)
      const res = await setCustomLogo(base64)
      setLogoLoading(false)
      if (res.success) {
        alert("Logo atualizada com sucesso! Recarregue a página (F5) para ver as mudanças.")
      } else {
        alert("Erro ao atualizar logo: " + res.error)
      }
    }
  }

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

        {/* LOGO UPLOAD SECTION */}
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold flex items-center mb-4">
            <ImageIcon className="mr-2 h-5 w-5 text-[#d4af37]" />
            Personalizar Logo da Loja
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecione uma imagem do seu computador para usar como logo no sistema e na página inicial.
            </p>
            
            <div className="space-y-2">
              <Label>Escolher Imagem (JPG ou PNG)</Label>
              <Input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoLoading}
              />
            </div>
            
            {logoLoading && <p className="text-sm text-blue-500">Fazendo upload e atualizando o sistema...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
