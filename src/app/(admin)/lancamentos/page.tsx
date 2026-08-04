'use client'

import { useState } from "react"
import { ArrowDownRight, Plus, Search, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { criarLancamento } from "@/app/actions/lancamentos"

type Lancamento = {
  id: string;
  created_at: string;
  description: string;
  type: 'COMPRA_ESTOQUE' | 'DESPESA_GERAL';
  amount: number;
}

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([
    {
      id: '1',
      created_at: new Date().toISOString(),
      description: 'Compra: Fornecedor Velas Luz',
      type: 'COMPRA_ESTOQUE',
      amount: 1500
    },
    {
      id: '2',
      created_at: new Date(Date.now() - 86400000).toISOString(), // ontem
      description: 'Conta de Energia Elétrica',
      type: 'DESPESA_GERAL',
      amount: 240
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'COMPRA_ESTOQUE' | 'DESPESA_GERAL'>('DESPESA_GERAL')
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const openModal = (type: 'COMPRA_ESTOQUE' | 'DESPESA_GERAL') => {
    setModalType(type)
    setDescription("")
    setAmount("")
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    setIsSubmitting(true)
    const valorNum = parseFloat(amount.replace(',', '.'))
    
    // A data assumida será o momento do clique via banco de dados e client-side
    const response = await criarLancamento({
      description,
      amount: valorNum,
      type: modalType
    })

    if (response.success) {
      setLancamentos([response.data as Lancamento, ...lancamentos])
      setIsModalOpen(false)
      alert('Lançamento salvo com sucesso!')
    } else {
      alert('Erro ao salvar lançamento: ' + response.error)
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lançamentos</h2>
          <p className="text-muted-foreground mt-1">
            Registre compras para reposição de estoque e despesas da loja.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => openModal('DESPESA_GERAL')}
            variant="outline" 
            className="text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:hover:bg-rose-900/50">
            <ArrowDownRight className="mr-2 h-4 w-4" /> Nova Despesa
          </Button>
          <Button 
            onClick={() => openModal('COMPRA_ESTOQUE')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
            <Plus className="mr-2 h-4 w-4" /> Compra de Estoque
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Compras de Estoque (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-600">
            R$ {lancamentos.filter(l => l.type === 'COMPRA_ESTOQUE').reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </h3>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Despesas Gerais (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-rose-600">
            R$ {lancamentos.filter(l => l.type === 'DESPESA_GERAL').reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </h3>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Total Gasto (Mês)</p>
          <h3 className="text-2xl font-bold mt-2">
            R$ {lancamentos.reduce((a, b) => a + b.amount, 0).toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar lançamento..." className="pl-9 bg-transparent" />
          </div>
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
            {lancamentos.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{new Date(item.created_at).toLocaleDateString('pt-BR')} às {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</TableCell>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>
                  {item.type === 'COMPRA_ESTOQUE' ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Reposição de Estoque</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">Despesa Geral</span>
                  )}
                </TableCell>
                <TableCell className={`text-right font-medium ${item.type === 'COMPRA_ESTOQUE' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  R$ {item.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal Customizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className={`p-6 text-white ${modalType === 'COMPRA_ESTOQUE' ? 'bg-[#4a0e4e]' : 'bg-rose-600'}`}>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">
                  {modalType === 'COMPRA_ESTOQUE' ? 'Nova Compra de Estoque' : 'Nova Despesa Geral'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">A data e hora atuais serão registradas automaticamente.</p>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input 
                  id="description" 
                  placeholder="Ex: Compra de 50 caixas de velas" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required 
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input 
                  id="amount" 
                  placeholder="0,00" 
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required 
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={modalType === 'COMPRA_ESTOQUE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Confirmar e Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
