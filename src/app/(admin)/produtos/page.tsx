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
import { listarProdutos } from "@/app/actions/produtos"
import { DeleteProductButton } from "@/components/produtos/delete-product-button"

export default async function ProductsPage() {
  const produtos = await listarProdutos()

  const totalInvestidoGeral = produtos.reduce(
    (acc, p) => acc + (Number(p.cost_price || 0) * Number(p.stock_quantity || 0)),
    0
  )
  const totalVendaPotencial = produtos.reduce(
    (acc, p) => acc + (Number(p.unit_price || 0) * Number(p.stock_quantity || 0)),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Produtos</h2>
          <p className="text-slate-300 mt-1">
            Gerencie o estoque, o valor investido e os preços da loja.
          </p>
        </div>
        <Link href="/produtos/novo">
          <Button className="bg-[#d4af37] text-[#2a0845] hover:bg-[#b8860b] shadow-lg shadow-black/20 transition-transform active:scale-95 font-bold">
            <Plus className="mr-2 h-4 w-4" /> Novo Produto
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Itens Cadastrados</p>
          <h3 className="text-2xl font-bold mt-1 text-white">
            {produtos.length} produtos
          </h3>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-300">Total Investido em Estoque (Custo × Qtd)</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-400">
            R$ {totalInvestidoGeral.toFixed(2)}
          </h3>
        </div>
        <div className="rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/10 backdrop-blur-xl p-5 text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-[#d4af37]">Valor Total de Venda em Estoque</p>
          <h3 className="text-2xl font-bold mt-1 text-[#d4af37]">
            R$ {totalVendaPotencial.toFixed(2)}
          </h3>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por código ou descrição..."
            className="pl-9 bg-black/20 border-white/10 text-white placeholder:text-slate-400"
          />
        </div>
        <Button variant="outline" className="bg-black/20 border-white/10 text-white hover:bg-white/10 hover:text-white">
          <Filter className="mr-2 h-4 w-4" /> Filtros
        </Button>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden text-white">
        <Table>
          <TableHeader className="bg-black/40 hover:bg-black/40">
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead className="text-right">Estoque</TableHead>
              <TableHead className="text-right">Custo Un.</TableHead>
              <TableHead className="text-right">Total Investido</TableHead>
              <TableHead className="text-right">Preço Venda</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {produtos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-slate-400 h-32">
                  Nenhum produto cadastrado.
                </TableCell>
              </TableRow>
            ) : (
              produtos.map(produto => {
                const custoUnitario = Number(produto.cost_price || 0)
                const qtdEstoque = Number(produto.stock_quantity || 0)
                const totalInvestidoItem = custoUnitario * qtdEstoque

                return (
                  <TableRow key={produto.id} className="hover:bg-white/10 border-white/10 transition-colors">
                    <TableCell className="font-medium text-slate-300">{produto.code}</TableCell>
                    <TableCell className="text-white">{produto.description}</TableCell>
                    <TableCell className="text-slate-300">{produto.size || '-'}</TableCell>
                    <TableCell className="text-right text-white">{qtdEstoque}</TableCell>
                    <TableCell className="text-right text-slate-300">R$ {custoUnitario.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-400">R$ {totalInvestidoItem.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold text-[#d4af37]">R$ {Number(produto.unit_price || 0).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/produtos/${produto.id}/editar`}>
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20">
                            Editar
                          </Button>
                        </Link>
                        <DeleteProductButton id={produto.id} />
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
