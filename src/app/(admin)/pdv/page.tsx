'use client'

import { useState, useEffect } from "react"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Wallet, FileText, Loader2, User, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { finalizarVenda } from "@/app/actions/vendas"
import { buscarProduto } from "@/app/actions/produtos"
import { listarClientes } from "@/app/actions/clientes"
import { TicketReceipt } from "@/components/pdv/ticket-receipt"

export default function PDVPage() {
  const [cart, setCart] = useState<{ id: string; code: string; name: string; price: number; qty: number }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  
  const [clientes, setClientes] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [isCrediarioModalOpen, setIsCrediarioModalOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<{ items: any[], total: number, type: 'VENDA'|'ORCAMENTO', paymentMethod?: string, customerName?: string } | null>(null)

  useEffect(() => {
    listarClientes().then(setClientes)
  }, [])

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0)

  const updateQty = (index: number, delta: number) => {
    const newCart = [...cart]
    newCart[index].qty += delta
    if (newCart[index].qty <= 0) {
      newCart.splice(index, 1)
    }
    setCart(newCart)
  }

  const removeItem = (index: number) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
  }

  const handleAddItem = async () => {
    if (!searchTerm) return
    setIsSearching(true)
    
    try {
      const res = await buscarProduto(searchTerm)
      if (!res.success || !res.data) {
        alert("Produto não encontrado!")
        return
      }
      
      const produto = res.data
      const newItem = {
        id: produto.id,
        code: produto.code,
        name: produto.description,
        price: produto.unit_price,
        qty: 1
      }
      setCart([...cart, newItem])
      setSearchTerm("")
    } catch (error) {
      alert("Erro ao buscar o produto.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleCheckoutClick = () => {
    if (cart.length === 0) return alert("Adicione itens à venda primeiro!")
    
    if (paymentMethod === 'CREDIARIO') {
      setIsCrediarioModalOpen(true)
      return
    }

    processCheckout(undefined)
  }

  const processCheckout = async (customerId?: string) => {
    setIsSubmitting(true)
    try {
      const response = await finalizarVenda(cart, paymentMethod, customerId)
      if (response.success) {
        alert("Venda finalizada com sucesso!")
        setCart([])
        setSelectedCustomer("")
        setIsCrediarioModalOpen(false)
      } else {
        alert("Erro ao finalizar venda: " + response.error)
      }
    } catch (error) {
      console.error(error)
      const msg = error instanceof Error ? error.message : String(error)
      alert("Erro inesperado: " + msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOrcamento = () => {
    if (cart.length === 0) return alert("Adicione itens para gerar orçamento!")
    setReceiptData({
      items: cart,
      total: total,
      type: 'ORCAMENTO'
    })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Esquerda: Pesquisa e Lista de Produtos */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Ponto de Venda</h2>
          <p className="text-slate-300 mt-1">Busque produtos pelo código ou descrição para adicionar à venda.</p>
        </div>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Código de barras ou descrição..." 
                  className="pl-10 text-lg h-12 bg-black/20 border-white/10 text-white placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  autoFocus
                />
              </div>
              <Button size="lg" className="h-12 px-8 bg-[#4a0e4e] hover:bg-[#2a0845] text-white" onClick={handleAddItem}>
                Inserir
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-auto p-0">
            <Table>
              <TableHeader className="bg-black/40 sticky top-0">
                <TableRow>
                  <TableHead className="w-[100px]">Cód.</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Unitário</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-48 text-center text-slate-400">
                      Nenhum item adicionado à venda.
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-white/10 border-white/10 transition-colors">
                      <TableCell className="font-medium text-slate-300">{item.code}</TableCell>
                      <TableCell className="font-semibold text-white">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white" onClick={() => updateQty(idx, -1)}><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center text-white">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6 border-white/20 bg-white/5 hover:bg-white/10 hover:text-white" onClick={() => updateQty(idx, 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-slate-300">R$ {item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold text-[#d4af37]">R$ {(item.price * item.qty).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-red-400 h-8 w-8 hover:bg-red-500/20" onClick={() => removeItem(idx)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Direita: Resumo e Pagamento */}
      <div className="w-[400px] flex flex-col">
        <Card className="bg-slate-900 border-none shadow-xl text-slate-50 flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl">Resumo da Venda</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({cart.length} itens)</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Descontos</span>
                <span>R$ 0,00</span>
              </div>
              <div className="h-px bg-slate-800 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-lg">Total</span>
                <span className="text-4xl font-bold text-[#d4af37]">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-6">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Forma de Pagamento</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={() => setPaymentMethod('DINHEIRO')}
                  variant={paymentMethod === 'DINHEIRO' ? 'default' : 'outline'} 
                  className={`h-14 justify-start gap-3 ${paymentMethod === 'DINHEIRO' ? 'bg-[#4a0e4e] border-[#4a0e4e]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                  <Banknote className="h-5 w-5 text-emerald-400" /> Dinheiro
                </Button>
                <Button 
                  onClick={() => setPaymentMethod('PIX')}
                  variant={paymentMethod === 'PIX' ? 'default' : 'outline'} 
                  className={`h-14 justify-start gap-3 ${paymentMethod === 'PIX' ? 'bg-[#4a0e4e] border-[#4a0e4e]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                  <div className="h-5 w-5 font-bold text-teal-400">PIX</div> Pix
                </Button>
                <Button 
                  onClick={() => setPaymentMethod('CARTAO_CREDITO')}
                  variant={paymentMethod === 'CARTAO_CREDITO' ? 'default' : 'outline'} 
                  className={`h-14 justify-start gap-3 ${paymentMethod === 'CARTAO_CREDITO' ? 'bg-[#4a0e4e] border-[#4a0e4e]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                  <CreditCard className="h-5 w-5 text-blue-400" /> Crédito
                </Button>
                <Button 
                  onClick={() => setPaymentMethod('CARTAO_DEBITO')}
                  variant={paymentMethod === 'CARTAO_DEBITO' ? 'default' : 'outline'} 
                  className={`h-14 justify-start gap-3 ${paymentMethod === 'CARTAO_DEBITO' ? 'bg-[#4a0e4e] border-[#4a0e4e]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                  <Wallet className="h-5 w-5 text-orange-400" /> Débito
                </Button>
                <Button 
                  onClick={() => setPaymentMethod('CREDIARIO')}
                  variant={paymentMethod === 'CREDIARIO' ? 'default' : 'outline'} 
                  className={`h-14 justify-start gap-3 col-span-2 ${paymentMethod === 'CREDIARIO' ? 'bg-[#4a0e4e] border-[#4a0e4e]' : 'border-slate-700 bg-slate-800 hover:bg-slate-700'}`}>
                  <FileText className="h-5 w-5 text-purple-400" /> Crediário (Conta Cliente)
                </Button>
              </div>
            </div>

            {/* O modal agora lida com o cliente do crediário */}
          </CardContent>
          <CardFooter className="pt-0 flex gap-2">
            <Button 
              disabled={isSubmitting}
              onClick={handleOrcamento}
              variant="outline"
              className="flex-1 h-14 text-lg border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
              <Printer className="mr-2 h-5 w-5" /> Orçamento
            </Button>
            <Button 
              disabled={isSubmitting}
              onClick={handleCheckoutClick}
              className="flex-[2] h-14 text-lg bg-[#d4af37] hover:bg-[#b8860b] text-[#2a0845] font-bold shadow-lg">
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : 'Finalizar Venda'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* MODAL DE RECIBO / ORÇAMENTO */}
      <Dialog open={!!receiptData} onOpenChange={(open) => !open && setReceiptData(null)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white p-0 overflow-hidden">
          <div className="p-4 bg-white text-black min-h-[400px] flex items-center justify-center">
            {receiptData && (
              <TicketReceipt 
                items={receiptData.items} 
                total={receiptData.total} 
                type={receiptData.type} 
                paymentMethod={receiptData.paymentMethod}
                customerName={receiptData.customerName}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL DE CREDIÁRIO */}
      <Dialog open={isCrediarioModalOpen} onOpenChange={setIsCrediarioModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#d4af37]">Finalizar Venda no Crediário</DialogTitle>
            <DialogDescription className="text-slate-400">
              Selecione para qual cliente cadastrado esta venda será lançada.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Select value={selectedCustomer} onValueChange={(val) => setSelectedCustomer(val || "")}>
                <SelectTrigger className="w-full h-12 bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Selecione o cliente...">
                    {selectedCustomer ? clientes.find(c => c.id === selectedCustomer)?.name : "Selecione o cliente..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {clientes.map(cliente => (
                    <SelectItem key={cliente.id} value={cliente.id}>{cliente.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCrediarioModalOpen(false)} className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white">
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                if (!selectedCustomer) return alert("Selecione um cliente!")
                processCheckout(selectedCustomer)
              }} 
              disabled={isSubmitting || !selectedCustomer}
              className="bg-[#d4af37] hover:bg-[#b8860b] text-[#2a0845] font-bold">
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirmar Lançamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
