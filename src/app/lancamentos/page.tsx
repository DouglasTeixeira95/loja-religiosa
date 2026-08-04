'use client'

import { useState } from "react"
import { ArrowDownRight, ArrowUpRight, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function LancamentosPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lançamentos</h2>
          <p className="text-muted-foreground mt-1">
            Registre compras para reposição de estoque e despesas da loja.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-rose-600 border-rose-200 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:hover:bg-rose-900/50">
            <ArrowDownRight className="mr-2 h-4 w-4" /> Nova Despesa
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
            <Plus className="mr-2 h-4 w-4" /> Compra de Estoque
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Compras de Estoque (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-600">R$ 4.250,00</h3>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Despesas Gerais (Mês)</p>
          <h3 className="text-2xl font-bold mt-2 text-rose-600">R$ 1.840,00</h3>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl p-6 dark:border-slate-800/60 dark:bg-slate-900/50">
          <p className="text-sm font-medium text-slate-500">Total Gasto (Mês)</p>
          <h3 className="text-2xl font-bold mt-2">R$ 6.090,00</h3>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60">
          <div className="relative max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input placeholder="Buscar lançamento..." className="pl-9 bg-transparent" />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Hoje, 10:45</TableCell>
              <TableCell className="font-medium">Compra: Fornecedor Velas Luz</TableCell>
              <TableCell><span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Reposição de Estoque</span></TableCell>
              <TableCell className="text-right text-emerald-600 font-medium">R$ 1.500,00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ontem, 15:30</TableCell>
              <TableCell className="font-medium">Conta de Energia Elétrica</TableCell>
              <TableCell><span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-800 dark:bg-rose-900/30 dark:text-rose-400">Despesa Geral</span></TableCell>
              <TableCell className="text-right text-rose-600 font-medium">R$ 240,00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
