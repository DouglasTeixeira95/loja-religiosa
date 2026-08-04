import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { PaymentChart } from "@/components/dashboard/payment-chart"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Visão geral da sua loja de artigos religiosos.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 shadow-lg transition-transform active:scale-95 text-white border-0">
          <Sparkles className="mr-2 h-4 w-4" /> Gerar Relatório de Lucro com IA
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Hoje</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">R$ 1.250,00</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              3 produtos com estoque baixo
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contas em Aberto</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ 840,00</div>
            <p className="text-xs text-muted-foreground">
              Crediário a receber
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Realizadas</CardTitle>
            <ShoppingCart className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +4 vendas na última hora
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
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
        
        <Card className="col-span-3 bg-white/50 backdrop-blur-xl border-slate-200/60 dark:bg-slate-900/50">
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
