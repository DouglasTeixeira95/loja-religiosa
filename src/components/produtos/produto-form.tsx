'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { criarProduto } from "@/app/actions/produtos"
import { useState } from "react"

const produtoSchema = z.object({
  code: z.string().min(1, "O código é obrigatório"),
  description: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
  stock_quantity: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
  size: z.string().optional(),
  unit_price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  box_price: z.coerce.number().min(0, "O preço da caixa não pode ser negativo"),
})

type ProdutoFormValues = z.infer<typeof produtoSchema>

export function ProdutoForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: {
      code: "",
      description: "",
      stock_quantity: 0,
      size: "",
      unit_price: 0,
      box_price: 0,
    }
  })

  const onSubmit = async (data: ProdutoFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await criarProduto(data)
      if (response.success) {
        alert("Produto salvo com sucesso!")
        router.push("/produtos")
      } else {
        alert("Erro ao salvar produto: " + response.error)
      }
    } catch (error) {
      alert("Ocorreu um erro inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cadastrar Produto</h2>
          <p className="text-muted-foreground text-sm">
            Adicione um novo item ao seu estoque.
          </p>
        </div>
      </div>

      <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código do Produto</Label>
                <Input 
                  id="code" 
                  placeholder="Ex: 1024"
                  {...form.register("code")} 
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Quantidade Inicial</Label>
                <Input 
                  id="stock_quantity" 
                  type="number" 
                  {...form.register("stock_quantity")} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                placeholder="Ex: Imagem Nossa Senhora 30cm"
                {...form.register("description")} 
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Tamanho / Medida</Label>
                <Input 
                  id="size" 
                  placeholder="Ex: 30cm"
                  {...form.register("size")} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
                <Input 
                  id="unit_price" 
                  type="number" 
                  step="0.01"
                  {...form.register("unit_price")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="box_price">Preço Cx. Fechada (R$)</Label>
                <Input 
                  id="box_price" 
                  type="number" 
                  step="0.01"
                  {...form.register("box_price")} 
                />
              </div>
            </div>

          </CardContent>
          
          <div className="flex justify-end p-6 pt-0">
            <Button type="submit" className="bg-primary">
              <Save className="mr-2 h-4 w-4" /> Salvar Produto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
