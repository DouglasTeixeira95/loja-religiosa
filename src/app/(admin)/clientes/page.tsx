import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserPlus, Search, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listarClientes } from "@/app/actions/clientes"
import { ToggleCustomerButton } from "@/components/clientes/toggle-customer-button"

export default async function ClientesPage() {
  const clientes = await listarClientes()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Clientes</h2>
          <p className="text-slate-300 mt-1">
            Gerencie o cadastro de clientes e contas de crediário.
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button className="bg-[#d4af37] text-[#2a0845] hover:bg-[#b8860b] shadow-lg shadow-black/20 transition-transform active:scale-95 font-bold">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden text-white">
        <Table>
          <TableHeader className="bg-black/40 hover:bg-black/40">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-400 h-32">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              clientes.map(cliente => {
                const isInactive = cliente.name.startsWith('[INATIVO]')
                return (
                  <TableRow key={cliente.id} className={`hover:bg-white/10 border-white/10 transition-colors ${isInactive ? 'opacity-50 grayscale' : ''}`}>
                    <TableCell className="font-medium text-slate-300">{cliente.name}</TableCell>
                    <TableCell className="text-white">{cliente.phone || '-'}</TableCell>
                    <TableCell className="text-white">{cliente.cpf || '-'}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/clientes/${cliente.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                            Ver Conta / Cobrança
                          </Button>
                        </Link>
                        <ToggleCustomerButton id={cliente.id} name={cliente.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
