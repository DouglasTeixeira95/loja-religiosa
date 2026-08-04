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
import { useState } from "react"
import { criarCliente } from "@/app/actions/clientes"

const clienteSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  phone: z.string().optional(),
  address: z.string().optional(),
  cpf: z.string().optional(),
})

type ClienteFormValues = z.infer<typeof clienteSchema>

export function ClienteForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      cpf: "",
    }
  })

  const onSubmit = async (data: ClienteFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await criarCliente(data)
      if (response.success) {
        alert("Cliente salvo com sucesso!")
        router.push("/clientes")
      } else {
        alert("Erro ao salvar cliente: " + response.error)
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      alert("Ocorreu um erro inesperado: " + msg)
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
          <h2 className="text-2xl font-bold tracking-tight">Cadastrar Cliente</h2>
          <p className="text-muted-foreground text-sm">
            Adicione um novo cliente para poder abrir conta crediário.
          </p>
        </div>
      </div>

      <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input 
                id="name" 
                placeholder="Ex: Maria das Graças"
                {...form.register("name")} 
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input 
                  id="cpf" 
                  placeholder="000.000.000-00"
                  {...form.register("cpf")} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                <Input 
                  id="phone" 
                  placeholder="(00) 00000-0000"
                  {...form.register("phone")} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                placeholder="Rua, Número, Bairro, Cidade"
                {...form.register("address")} 
              />
            </div>

          </CardContent>
          
          <div className="flex justify-end p-6 pt-0">
            <Button type="submit" className="bg-primary" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
              Salvar Cliente
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
