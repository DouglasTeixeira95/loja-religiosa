'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Search, Receipt, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { listarVendas, excluirVenda } from "@/app/actions/vendas"
import { TicketReceipt } from "@/components/pdv/ticket-receipt"

export default function VendasPage() {
  const [vendas, setVendas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const carregarVendas = () => {
    setLoading(true)
    listarVendas().then((data) => {
      setVendas(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    carregarVendas()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja cancelar e excluir esta venda? O estoque será devolvido e a operação não poderá ser desfeita.")) {
      setIsDeleting(true)
      const res = await excluirVenda(id)
      if (res.success) {
        carregarVendas()
      } else {
        alert(res.error || "Erro ao excluir venda")
      }
      setIsDeleting(false)
    }
  }

  const handlePrintReceipt = (venda: any) => {
    // Converter itens do bd pro formato do ticket
    const items = venda.sale_items?.map((item: any) => ({
      name: item.products?.description || 'Produto',
      qty: item.quantity,
      price: item.unit_price
    })) || []

    setSelectedReceipt({
      items,
      total: venda.total_amount,
      type: 'VENDA',
      paymentMethod: venda.payment_method,
      customerName: venda.customers?.name,
      date: new Date(venda.created_at).toLocaleString('pt-BR')
    })
  }

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Histórico de Vendas</h2>
          <p className="text-muted-foreground mt-1">
            Acompanhe todas as vendas realizadas no PDV.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Forma de Pagamento</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="text-center h-32">Carregando...</TableCell></TableRow>
            ) : vendas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  Nenhuma venda registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              vendas.map((venda: any) => (
                <TableRow key={venda.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell>
                    {new Date(venda.created_at).toLocaleDateString('pt-BR')} às {new Date(venda.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {venda.customers?.name || 'Cliente Avulso'}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {venda.payment_method}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    R$ {venda.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-2">
                      <Button 
                        onClick={() => handlePrintReceipt(venda)}
                        variant="ghost" 
                        size="sm" 
                        title="Imprimir Recibo"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/50">
                        <Receipt className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(venda.id)}
                        variant="ghost" 
                        size="sm" 
                        disabled={isDeleting}
                        title="Cancelar Venda"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
        <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-700 text-white p-0 overflow-hidden">
          <div className="p-4 bg-white text-black min-h-[400px] flex items-center justify-center">
            {selectedReceipt && (
              <TicketReceipt 
                items={selectedReceipt.items} 
                total={selectedReceipt.total} 
                type={selectedReceipt.type} 
                paymentMethod={selectedReceipt.paymentMethod}
                customerName={selectedReceipt.customerName}
                date={selectedReceipt.date}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
