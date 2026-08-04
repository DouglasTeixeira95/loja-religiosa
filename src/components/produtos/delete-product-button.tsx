'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { excluirProduto } from "@/app/actions/produtos"
import { useRouter } from "next/navigation"

export function DeleteProductButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e pode afetar o histórico de vendas se o produto já foi vendido.")) {
      setIsDeleting(true)
      const res = await excluirProduto(id)
      
      if (res.success) {
        // A action já faz revalidatePath, o router.refresh() garante que a UI atualize na hora
        router.refresh()
      } else {
        alert(res.error || "Erro ao excluir produto")
      }
      setIsDeleting(false)
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
      title="Excluir Produto"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  )
}
