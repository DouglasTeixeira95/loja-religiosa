'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { UserX, UserCheck } from "lucide-react"
import { alternarStatusCliente } from "@/app/actions/clientes"
import { useRouter } from "next/navigation"

export function ToggleCustomerButton({ id, name }: { id: string, name: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const isInactive = name.startsWith('[INATIVO] ')

  const handleToggle = async () => {
    const action = isInactive ? "ativar" : "desativar"
    if (window.confirm(`Tem certeza que deseja ${action} este cliente?`)) {
      setIsLoading(true)
      const res = await alternarStatusCliente(id, name)
      
      if (res.success) {
        router.refresh()
      } else {
        alert("Erro ao alterar status: " + res.error)
      }
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleToggle}
      disabled={isLoading}
      className={isInactive ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20" : "text-amber-500 hover:text-amber-400 hover:bg-amber-500/20"}
      title={isInactive ? "Ativar Cliente" : "Desativar Cliente"}
    >
      {isInactive ? <UserCheck className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
    </Button>
  )
}
