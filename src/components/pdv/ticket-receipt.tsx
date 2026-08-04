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
    <div className="flex flex-col items-center max-w-sm mx-auto">
      <div 
        id="print-area" 
        className="bg-white text-black p-6 w-full shadow-lg font-mono text-sm print:shadow-none print:p-0"
        style={{ width: '80mm', minHeight: '100px' }}
      >
        <div className="text-center mb-4">
          <h2 className="font-bold text-lg uppercase">Império da Rosa 7</h2>
          <p className="text-xs">Artigos Religiosos</p>
          <p className="text-xs mt-2 border-b border-dashed border-gray-400 pb-2">
            {type === 'ORCAMENTO' ? '*** ORÇAMENTO ***' : 'CUPOM NÃO FISCAL'}
          </p>
        </div>

        <div className="text-xs mb-2">
          <p>DATA: {dataEmissao}</p>
          {customerName && <p>CLIENTE: {customerName}</p>}
        </div>

        <table className="w-full text-xs border-t border-b border-dashed border-gray-400 my-2 py-2">
          <thead>
            <tr className="text-left">
              <th className="font-normal pb-1">QTD</th>
              <th className="font-normal pb-1">DESCRIÇÃO</th>
              <th className="font-normal text-right pb-1">V.UN</th>
              <th className="font-normal text-right pb-1">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="align-top">
                <td className="pt-1">{item.qty}</td>
                <td className="pt-1 pr-1">{item.name.substring(0, 20)}</td>
                <td className="pt-1 text-right">{item.price.toFixed(2)}</td>
                <td className="pt-1 text-right">{(item.qty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right mt-2 text-sm">
          <p>Subtotal: R$ {total.toFixed(2)}</p>
          <p className="font-bold text-base mt-1">TOTAL: R$ {total.toFixed(2)}</p>
        </div>

        {paymentMethod && (
          <div className="mt-4 pt-2 border-t border-dashed border-gray-400 text-xs">
            <p>FORMA DE PAGAMENTO: {paymentMethod}</p>
          </div>
        )}

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>{type === 'ORCAMENTO' ? 'Válido por 7 dias' : 'Obrigado pela preferência!'}</p>
          <p className="mt-1">Volte Sempre!</p>
        </div>
      </div>

      <div className="mt-6 flex w-full gap-4 print:hidden">
        <Button onClick={handlePrint} className="w-full bg-slate-800 hover:bg-slate-700">
          <Printer className="mr-2 h-4 w-4" /> Imprimir Recibo
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
            width: 80mm !important;
            margin: 0;
            padding: 0;
          }
        }
      `}} />
    </div>
  )
}
