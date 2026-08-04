'use client'

import { useState } from "react"
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Wallet, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { finalizarVenda } from "@/app/actions/vendas"

export default function PDVPage() {
  const [cart, setCart] = useState<{ id: string; code: string; name: string; price: number; qty: number }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("DINHEIRO")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0)

  const handleAddItem = () => {
    if (!searchTerm) return
    const newItem = {
      id: "uuid-generico-teste", // ID falso até puxarmos a busca real
      code: "1024",
      name: "Produto " + searchTerm,
      price: 15.50,
      qty: 1
    }
    setCart([...cart, newItem])
    setSearchTerm("")
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return alert("Adicione itens à venda primeiro!")
    
    setIsSubmitting(true)
    try {
      // Se for crediário, precisamos do ID do cliente (Mockado por enquanto)
      const customerId = paymentMethod === 'CREDIARIO' ? 'uuid-cliente-teste' : undefined
      
      const response = await finalizarVenda(cart, paymentMethod, customerId)
      if (response.success) {
        alert(`Venda finalizada com sucesso! Forma: ${paymentMethod}`)
        setCart([])
      } else {
        alert("Erro ao finalizar venda: " + response.error)
      }
    } catch (error) {
      alert("Erro inesperado.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Esquerda: Pesquisa e Lista de Produtos */}
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ponto de Venda</h2>
          <p className="text-muted-foreground mt-1">Busque produtos pelo código ou descrição para adicionar à venda.</p>
        </div>

        <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50 flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Código de barras ou descrição..." 
                  className="pl-10 text-lg h-12 bg-white/80 dark:bg-slate-950/80"
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
              <TableHeader className="bg-slate-50/50 sticky top-0 dark:bg-slate-800/50">
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
                    <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                      Nenhum item adicionado à venda.
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                      <TableCell className="font-medium text-slate-500">{item.code}</TableCell>
                      <TableCell className="font-semibold">{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="icon" className="h-6 w-6"><Minus className="h-3 w-3" /></Button>
                          <span className="w-8 text-center">{item.qty}</span>
                          <Button variant="outline" size="icon" className="h-6 w-6"><Plus className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">R$ {item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-bold">R$ {(item.price * item.qty).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="text-red-500 h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/50">
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
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full h-14 text-lg bg-[#d4af37] hover:bg-[#b8860b] text-[#2a0845] font-bold shadow-lg">
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : 'Finalizar Venda'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
