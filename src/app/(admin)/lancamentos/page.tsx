'use client'

import { useState, useEffect } from "react"
import { ArrowDownRight, Plus, Search, Loader2, X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { criarLancamento, listarLancamentos, excluirLancamento } from "@/app/actions/lancamentos"
import { listarProdutos } from "@/app/actions/produtos"

type Lancamento = {
  id: string;
  created_at: string;
  description: string;
  type: 'COMPRA_ESTOQUE' | 'DESPESA_GERAL';
  amount: number;
}

export default function LancamentosPage() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'COMPRA_ESTOQUE' | 'DESPESA_GERAL'>('DESPESA_GERAL')
  const [selectedProductId, setSelectedProductId] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState("")
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const carregarLancamentos = async () => {
    setLoading(true)
    const [data, prods] = await Promise.all([
      listarLancamentos(),
      listarProdutos(),
    ])
    setLancamentos(data as Lancamento[])
    setProdutos(prods || [])
    setLoading(false)
  }

  useEffect(() => {
    carregarLancamentos()
  }, [])

  const openModal = (type: 'COMPRA_ESTOQUE' | 'DESPESA_GERAL') => {
    setModalType(type)
    setSelectedProductId("")
    setDescription("")
    setQuantity("1")
    setUnitPrice("")
    setAmount("")
    setIsModalOpen(true)
  }

  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId)
    if (!prodId) return
    const prod = produtos.find((p) => p.id === prodId)
    if (prod) {
      const descPadrao = prod.size
        ? `Reposição: ${prod.description} (${prod.size})`
        : `Reposição: ${prod.description}`
      setDescription(descPadrao)
      const custo = Number(prod.cost_price || 0)
      if (custo > 0) {
        const custoStr = custo.toFixed(2)
        setUnitPrice(custoStr)
        const q = parseFloat(quantity.replace(',', '.')) || 1
        setAmount((q * custo).toFixed(2))
      }
    }
  }

  const handleQuantityOrUnitChange = (newQty: string, newUnit: string) => {
    setQuantity(newQty)
    setUnitPrice(newUnit)
    const q = parseFloat(newQty.replace(',', '.'))
    const u = parseFloat(newUnit.replace(',', '.'))
    if (!isNaN(q) && !isNaN(u) && q > 0 && u >= 0) {
      setAmount((q * u).toFixed(2))
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este lançamento?")) return
    const res = await excluirLancamento(id)
    if (res.success) {
      setLancamentos(lancamentos.filter(item => item.id !== id))
    } else {
      alert("Erro ao excluir lançamento: " + res.error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    setIsSubmitting(true)
    const valorNum = parseFloat(amount.replace(',', '.'))
    const q = parseFloat(quantity.replace(',', '.'))
    const u = parseFloat(unitPrice.replace(',', '.'))

    const finalDescription =
      modalType === 'COMPRA_ESTOQUE' && !isNaN(q) && !isNaN(u) && q > 0 && u > 0
        ? `${description} (${q} un. x R$ ${u.toFixed(2)})`
        : description
    
    // A data assumida será o momento do clique via banco de dados e client-side
    const response = await criarLancamento({
      description: finalDescription,
      amount: valorNum,
      type: modalType,
      productId: modalType === 'COMPRA_ESTOQUE' && selectedProductId ? selectedProductId : undefined,
      addedQuantity: modalType === 'COMPRA_ESTOQUE' && !isNaN(q) && q > 0 ? Math.round(q) : undefined,
      newCostPrice: modalType === 'COMPRA_ESTOQUE' && !isNaN(u) && u > 0 ? u : undefined,
    })

    if (response.success) {
      setLancamentos([response.data as Lancamento, ...lancamentos])
      if (modalType === 'COMPRA_ESTOQUE' && selectedProductId && !isNaN(q) && q > 0) {
        setProdutos(
          produtos.map((p) =>
            p.id === selectedProductId
              ? {
                  ...p,
                  stock_quantity: Number(p.stock_quantity || 0) + Math.round(q),
                  cost_price: !isNaN(u) && u > 0 ? u : p.cost_price,
                }
              : p
          )
        )
      }
      setIsModalOpen(false)
      alert(
        modalType === 'COMPRA_ESTOQUE' && selectedProductId
          ? 'Compra lançada e estoque somado automaticamente com sucesso!'
          : 'Lançamento salvo com sucesso!'
      )
    } else {
      alert('Erro ao salvar lançamento: ' + response.error)
    }
    
    setIsSubmitting(false)
  }

  const lancamentosFiltrados = lancamentos.filter(item =>
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Lançamentos</h2>
          <p className="text-slate-300 mt-1">
            Registre compras para reposição de estoque e despesas da loja.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => openModal('DESPESA_GERAL')}
            variant="outline" 
            className="text-rose-200 border-rose-500/40 bg-rose-500/20 hover:bg-rose-500/30 hover:text-white">
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
        <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 text-white">
          <p className="text-sm font-medium text-slate-300">Compras de Estoque (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-400">
            R$ {lancamentos.filter(l => l.type === 'COMPRA_ESTOQUE').reduce((a, b) => a + Number(b.amount || 0), 0).toFixed(2)}
          </h3>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 text-white">
          <p className="text-sm font-medium text-slate-300">Despesas Gerais (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-rose-400">
            R$ {lancamentos.filter(l => l.type === 'DESPESA_GERAL').reduce((a, b) => a + Number(b.amount || 0), 0).toFixed(2)}
          </h3>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 text-white">
          <p className="text-sm font-medium text-slate-300">Total Gasto (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-white">
            R$ {lancamentos.reduce((a, b) => a + Number(b.amount || 0), 0).toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden text-white">
        <div className="p-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar lançamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-black/40 hover:bg-black/40">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-300 h-32">
                  Carregando lançamentos...
                </TableCell>
              </TableRow>
            ) : lancamentosFiltrados.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 h-32">
                  Nenhum lançamento registrado.
                </TableCell>
              </TableRow>
            ) : (
              lancamentosFiltrados.map((item) => (
                <TableRow key={item.id} className="hover:bg-white/10 border-white/10 transition-colors">
                  <TableCell className="text-slate-300">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')} às {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="font-medium text-white">{item.description}</TableCell>
                  <TableCell>
                    {item.type === 'COMPRA_ESTOQUE' ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
                        Reposição de Estoque
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
                        Despesa Geral
                      </span>
                    )}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${item.type === 'COMPRA_ESTOQUE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    R$ {Number(item.amount || 0).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      title="Excluir lançamento"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal Customizado */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
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
              {modalType === 'COMPRA_ESTOQUE' && (
                <div className="space-y-2">
                  <Label htmlFor="productSelect" className="text-slate-800 font-semibold">
                    Vincular a um Produto do Estoque (Soma Automática)
                  </Label>
                  <select
                    id="productSelect"
                    value={selectedProductId}
                    onChange={(e) => handleSelectProduct(e.target.value)}
                    className="w-full h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  >
                    <option value="">-- Compra avulsa / geral (não somar produto específico) --</option>
                    {produtos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        [{prod.code}] {prod.description} {prod.size ? `(${prod.size})` : ''} — Estoque atual: {prod.stock_quantity}
                      </option>
                    ))}
                  </select>
                  {selectedProductId && (
                    <p className="text-xs text-emerald-700 font-medium">
                      ✓ Ao salvar, a quantidade comprada será somada automaticamente ao estoque deste produto.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-800 font-semibold">Descrição</Label>
                <Input 
                  id="description" 
                  placeholder={modalType === 'COMPRA_ESTOQUE' ? "Ex: Alguidar número 4" : "Ex: Conta de Energia"} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-white text-slate-900 border-slate-300 placeholder:text-slate-400"
                  required 
                  autoFocus
                />
              </div>

              {modalType === 'COMPRA_ESTOQUE' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="text-slate-800 font-semibold">Quantidade Comprada</Label>
                    <Input 
                      id="quantity" 
                      placeholder="Ex: 5" 
                      type="number"
                      min="1"
                      step="1"
                      value={quantity}
                      onChange={(e) => handleQuantityOrUnitChange(e.target.value, unitPrice)}
                      className="bg-white text-slate-900 border-slate-300 placeholder:text-slate-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice" className="text-slate-800 font-semibold">Valor Pago por Un. (R$)</Label>
                    <Input 
                      id="unitPrice" 
                      placeholder="Ex: 20,00" 
                      type="number"
                      step="0.01"
                      value={unitPrice}
                      onChange={(e) => handleQuantityOrUnitChange(quantity, e.target.value)}
                      className="bg-white text-slate-900 border-slate-300 placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-slate-800 font-semibold">
                  {modalType === 'COMPRA_ESTOQUE' ? 'Valor Total Investido (R$)' : 'Valor (R$)'}
                </Label>
                <Input 
                  id="amount" 
                  placeholder="0,00" 
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white text-slate-900 border-slate-300 placeholder:text-slate-400 font-bold"
                  required 
                />
                {modalType === 'COMPRA_ESTOQUE' && unitPrice && quantity && (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    Cálculo automático: {quantity} × R$ {parseFloat(unitPrice.replace(',', '.') || '0').toFixed(2)} = R$ {amount}
                  </p>
                )}
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={modalType === 'COMPRA_ESTOQUE' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}>
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
