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
import { criarProduto, atualizarProduto } from "@/app/actions/produtos"
import { useState } from "react"

const produtoSchema = z.object({
  code: z.string().min(1, "O código é obrigatório"),
  description: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
  stock_quantity: z.coerce.number().int().min(0, "O estoque não pode ser negativo"),
  size: z.string().optional(),
  cost_price: z.coerce.number().min(0, "O preço de custo não pode ser negativo"),
  unit_price: z.coerce.number().min(0, "O preço não pode ser negativo"),
  box_price: z.coerce.number().min(0, "O preço da caixa não pode ser negativo"),
})

type ProdutoFormValues = z.infer<typeof produtoSchema>

export function ProdutoForm({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!initialData
  
  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialData ? {
      ...initialData,
      cost_price: initialData.cost_price ?? 0,
    } : {
      code: "",
      description: "",
      stock_quantity: 0,
      size: "",
      cost_price: 0,
      unit_price: 0,
      box_price: 0,
    }
  })

  const watchedStock = Number(form.watch("stock_quantity")) || 0
  const watchedCost = Number(form.watch("cost_price")) || 0
  const totalInvested = watchedStock * watchedCost

  const onSubmit = async (data: ProdutoFormValues) => {
    setIsSubmitting(true)
    try {
      let response
      if (isEditing) {
        response = await atualizarProduto(initialData.id, data)
      } else {
        response = await criarProduto(data)
      }
      
      if (response.success) {
        alert(`Produto ${isEditing ? 'atualizado' : 'salvo'} com sucesso!`)
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
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">{isEditing ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
          <p className="text-slate-300 text-sm">
            {isEditing ? 'Atualize as informações do produto.' : 'Adicione um novo item ao seu estoque.'}
          </p>
        </div>
      </div>

      <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-slate-200">Código do Produto</Label>
                <Input 
                  id="code" 
                  placeholder="Ex: 1024"
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("code")} 
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-400">{form.formState.errors.code.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="text-slate-200">Quantidade em Estoque</Label>
                <Input 
                  id="stock_quantity" 
                  type="number" 
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("stock_quantity")} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-200">Descrição</Label>
              <Input 
                id="description" 
                placeholder="Ex: Alguidar número 4"
                className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                {...form.register("description")} 
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-400">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size" className="text-slate-200">Tamanho / Medida</Label>
                <Input 
                  id="size" 
                  placeholder="Ex: 30cm ou Nº 4"
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("size")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost_price" className="text-slate-200">Preço Pago / Custo Un. (R$)</Label>
                <Input 
                  id="cost_price" 
                  type="number" 
                  step="0.01"
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("cost_price")} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit_price" className="text-slate-200">Preço Venda Un. (R$)</Label>
                <Input 
                  id="unit_price" 
                  type="number" 
                  step="0.01"
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("unit_price")} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="box_price" className="text-slate-200">Preço Cx. Fechada (R$)</Label>
                <Input 
                  id="box_price" 
                  type="number" 
                  step="0.01"
                  className="bg-black/30 border-white/15 text-white placeholder:text-slate-400"
                  {...form.register("box_price")} 
                />
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  Valor Total Investido neste Produto
                </p>
                <p className="text-xs text-slate-300">
                  Multiplicação automática: {watchedStock} un. × R$ {watchedCost.toFixed(2)} = R$ {totalInvested.toFixed(2)}
                </p>
              </div>
              <div className="text-2xl font-bold text-emerald-400">
                R$ {totalInvested.toFixed(2)}
              </div>
            </div>

          </CardContent>
          
          <div className="flex justify-end p-6 pt-0">
            <Button type="submit" disabled={isSubmitting} className="bg-[#d4af37] text-[#2a0845] hover:bg-[#b8860b] font-bold">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Salvar Produto
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
