import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { PaymentChart } from "@/components/dashboard/payment-chart"
import { buscarEstatisticasDashboard } from "@/app/actions/dashboard"

export default async function Dashboard() {
  const stats = await buscarEstatisticasDashboard()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-slate-300 mt-1">
            Visão geral da sua loja de artigos religiosos.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ {stats.vendasHoje.toFixed(2)}</div>
            <p className="text-xs text-slate-300">
              {stats.qtdVendasHoje} vendas realizadas hoje
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProdutos}</div>
            <p className="text-xs text-slate-300">
              {stats.estoqueBaixo} produtos com estoque baixo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas em Aberto</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ {stats.contasAberto.toFixed(2)}</div>
            <p className="text-xs text-slate-300">
              Crediário a receber
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.qtdVendasHoje}</div>
            <p className="text-xs text-slate-300">
              Vendas registradas hoje
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>
              Acompanhamento de vendas dos últimos dias.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        
        <Card className="col-span-3 bg-black/20 backdrop-blur-xl border-white/10 text-white">
          <CardHeader>
            <CardTitle>Formas de Pagamento</CardTitle>
            <CardDescription>
              Distribuição do faturamento por modalidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
