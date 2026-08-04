'use client'

import { useState, useEffect } from "react"
import { buscarClienteComCrediario, registrarPagamentoCrediario } from "@/app/actions/clientes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Wallet, Loader2 } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useParams } from "next/navigation"

export default function ClientePerfilPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [cliente, setCliente] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pagamentoValor, setPagamentoValor] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadCliente = async () => {
    if (!id) return
    const data = await buscarClienteComCrediario(id)
    if (!data) notFound()
    setCliente(data)
    setLoading(false)
  }

  useEffect(() => {
    loadCliente()
  }, [id])

  const handlePagamento = async () => {
    const valor = parseFloat(pagamentoValor.replace(',', '.'))
    if (!valor || valor <= 0) return alert("Digite um valor válido")

    setIsSubmitting(true)
    const res = await registrarPagamentoCrediario(id, valor)
    setIsSubmitting(false)

    if (res.success) {
      alert("Pagamento registrado com sucesso!")
      setIsModalOpen(false)
      setPagamentoValor("")
      loadCliente() // recarrega a tabela e o saldo
    } else {
      alert("Erro ao registrar pagamento: " + res.error)
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[#d4af37]" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/clientes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{cliente.name}</h2>
          <p className="text-muted-foreground mt-1">
            CPF: {cliente.cpf || 'Não informado'} | Tel: {cliente.phone || 'Não informado'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-[#4a0e4e] text-white border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-[#d4af37] flex items-center">
              <Wallet className="mr-2 h-5 w-5" /> Saldo Devedor (Crediário)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">R$ {cliente.saldoDevedor.toFixed(2)}</div>
            {cliente.saldoDevedor > 0 && (
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 bg-[#d4af37] hover:bg-[#b8860b] text-[#2a0845] font-bold w-full">
                Dar Baixa (Receber Pagamento)
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden mt-6">
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <h3 className="font-semibold text-lg">Histórico da Conta</h3>
        </div>
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cliente.accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground h-32">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              cliente.accounts.map((acc: any) => (
                <TableRow key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell>{new Date(acc.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{acc.notes}</TableCell>
                  <TableCell>
                    {acc.type === 'DEBITO' ? (
                      <span className="text-rose-600 font-semibold bg-rose-100 px-2 rounded-full text-xs">Nova Dívida</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold bg-emerald-100 px-2 rounded-full text-xs">Pagamento Recebido</span>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${acc.type === 'DEBITO' ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {acc.type === 'DEBITO' ? '-' : '+'} R$ {acc.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODAL PAGAMENTO */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Pagamento</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Valor Recebido (R$)</Label>
              <Input 
                type="number" 
                step="0.01" 
                value={pagamentoValor} 
                onChange={e => setPagamentoValor(e.target.value)} 
                placeholder="Ex: 50.00"
              />
              <p className="text-xs text-muted-foreground">O cliente deve R$ {cliente.saldoDevedor.toFixed(2)} no total.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handlePagamento} disabled={isSubmitting || !pagamentoValor}>
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirmar Pagamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
