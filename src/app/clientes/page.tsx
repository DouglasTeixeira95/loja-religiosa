import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, UserCheck, AlertCircle } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ClientesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie o cadastro de clientes e as contas de crediário.
          </p>
        </div>
        <Link href="/clientes/novo">
          <Button className="bg-primary shadow-lg shadow-primary/20 transition-transform active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Novo Cliente
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
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-right">Crediário Pendente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="font-medium">Maria das Graças</TableCell>
              <TableCell>123.456.789-00</TableCell>
              <TableCell>(11) 98765-4321</TableCell>
              <TableCell className="text-right font-medium text-orange-600 flex justify-end items-center gap-2">
                <AlertCircle className="h-4 w-4" /> R$ 340,00
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-blue-600">Ver Extrato</Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="font-medium">José Pereira</TableCell>
              <TableCell>987.654.321-11</TableCell>
              <TableCell>(11) 91234-5678</TableCell>
              <TableCell className="text-right font-medium text-emerald-600 flex justify-end items-center gap-2">
                <UserCheck className="h-4 w-4" /> Sem débitos
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-blue-600">Ver Extrato</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
