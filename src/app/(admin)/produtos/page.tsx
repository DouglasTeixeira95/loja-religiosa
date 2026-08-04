import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground mt-1">
            Gerencie o estoque e os preços da loja.
          </p>
        </div>
        <Link href="/produtos/novo">
          <Button className="bg-primary shadow-lg shadow-primary/20 transition-transform active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por código ou descrição..."
            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200/60"
          />
        </div>
        <Button variant="outline" className="bg-white/50 dark:bg-slate-900/50">
          <Filter className="mr-2 h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Preço Un.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Lista mockada de exemplo - integraremos com Supabase em breve */}
            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="font-medium">1001</TableCell>
              <TableCell>Vela 7 Dias Branca</TableCell>
              <TableCell>Único</TableCell>
              <TableCell className="text-right">45</TableCell>
              <TableCell className="text-right">R$ 7,50</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-blue-600">Editar</Button>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <TableCell className="font-medium">2043</TableCell>
              <TableCell>Imagem N. Sra Aparecida</TableCell>
              <TableCell>30cm</TableCell>
              <TableCell className="text-right">5</TableCell>
              <TableCell className="text-right">R$ 145,00</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" className="text-blue-600">Editar</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
