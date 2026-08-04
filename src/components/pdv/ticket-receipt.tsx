import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"

type TicketItem = {
  name: string
  qty: number
  price: number
}

type TicketReceiptProps = {
  items: TicketItem[]
  total: number
  type: 'VENDA' | 'ORCAMENTO'
  paymentMethod?: string
  customerName?: string
  date?: string
}

export function TicketReceipt({ items, total, type, paymentMethod, customerName, date }: TicketReceiptProps) {
  const dataEmissao = date || new Date().toLocaleString('pt-BR')

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div 
        id="print-area" 
        className="bg-white text-slate-800 p-8 w-full shadow-lg font-sans text-sm print:shadow-none print:p-0"
        style={{ minHeight: '297mm', width: '210mm', maxWidth: '100%' }}
      >
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6 mb-6">
          <div>
            <h2 className="font-bold text-2xl uppercase tracking-wider text-slate-900">Império da Rosa 7</h2>
            <p className="text-slate-500">Artigos Religiosos</p>
          </div>
          <div className="text-right">
            <h1 className="text-xl font-bold uppercase text-indigo-600">
              {type === 'ORCAMENTO' ? 'Orçamento' : 'Recibo de Venda'}
            </h1>
            <p className="text-slate-500 mt-1">Data: {dataEmissao}</p>
          </div>
        </div>

        {customerName && (
          <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-100">
            <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Cliente</h3>
            <p className="font-medium text-slate-900 text-lg">{customerName}</p>
          </div>
        )}

        <table className="w-full text-left border-collapse mb-8">
          <thead>
            <tr className="border-b-2 border-slate-200 text-slate-500">
              <th className="font-semibold py-3 px-2">Descrição do Produto</th>
              <th className="font-semibold py-3 px-2 text-center w-20">Qtd</th>
              <th className="font-semibold py-3 px-2 text-right w-32">V. Unitário</th>
              <th className="font-semibold py-3 px-2 text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-100">
                <td className="py-3 px-2 text-slate-700">{item.name}</td>
                <td className="py-3 px-2 text-center text-slate-600">{item.qty}</td>
                <td className="py-3 px-2 text-right text-slate-600">R$ {item.price.toFixed(2)}</td>
                <td className="py-3 px-2 text-right font-medium text-slate-800">R$ {(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            {paymentMethod && (
              <div className="flex justify-between text-slate-600">
                <span>Pagamento:</span>
                <span className="capitalize">{paymentMethod.toLowerCase().replace('_', ' ')}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-slate-900 pt-3 border-t-2 border-slate-200">
              <span>Total:</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>{type === 'ORCAMENTO' ? 'Este orçamento é válido por 7 dias.' : 'Obrigado pela preferência!'}</p>
          <p className="mt-2 text-xs">Império da Rosa 7 - Todos os direitos reservados</p>
        </div>
      </div>

      <div className="mt-6 flex w-full gap-4 print:hidden justify-end">
        <Button onClick={handlePrint} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          <Printer className="mr-2 h-4 w-4" /> Imprimir Documento
        </Button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            min-height: auto !important;
            margin: 0;
            padding: 20mm;
          }
        }
      `}} />
    </div>
  )
}
