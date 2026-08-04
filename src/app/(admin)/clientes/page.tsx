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

export default async function ClientesPage() {
  const clientes = await listarClientes()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie o cadastro de clientes e contas de crediário.
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button className="bg-primary shadow-lg shadow-primary/20 transition-transform active:scale-95">
            <UserPlus className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead className="text-right">Status Crediário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-32">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              clientes.map(cliente => (
                <TableRow key={cliente.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell className="font-medium">{cliente.name}</TableCell>
                  <TableCell>{cliente.phone || '-'}</TableCell>
                  <TableCell>{cliente.cpf || '-'}</TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Verificando...
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600">Ver Conta</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
