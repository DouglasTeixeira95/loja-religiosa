'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PackagePlus, Loader2, X } from "lucide-react"
import { criarLancamento } from "@/app/actions/lancamentos"
import { useRouter } from "next/navigation"

type RestockProductProps = {
  product: {
    id: string
    code: string
    description: string
    size?: string
    stock_quantity: number
    cost_price?: number
  }
}

export function RestockProductButton({ product }: RestockProductProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [quantity, setQuantity] = useState("1")
  const [unitPrice, setUnitPrice] = useState(
    product.cost_price && Number(product.cost_price) > 0
      ? Number(product.cost_price).toFixed(2)
      : ""
  )
  const [amount, setAmount] = useState(
    product.cost_price && Number(product.cost_price) > 0
      ? Number(product.cost_price).toFixed(2)
      : ""
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpen = () => {
    const defaultCost =
      product.cost_price && Number(product.cost_price) > 0
        ? Number(product.cost_price).toFixed(2)
        : ""
    setQuantity("1")
    setUnitPrice(defaultCost)
    setAmount(defaultCost)
    setIsOpen(true)
  }

  const handleQuantityOrUnitChange = (newQty: string, newUnit: string) => {
    setQuantity(newQty)
    setUnitPrice(newUnit)
    const q = parseFloat(newQty.replace(",", "."))
    const u = parseFloat(newUnit.replace(",", "."))
    if (!isNaN(q) && !isNaN(u) && q > 0 && u >= 0) {
      setAmount((q * u).toFixed(2))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const q = parseInt(quantity, 10)
    const u = parseFloat(unitPrice.replace(",", "."))
    const total = parseFloat(amount.replace(",", "."))

    if (!q || q <= 0 || isNaN(total) || total < 0) {
      alert("Preencha uma quantidade e valor válidos.")
      return
    }

    setIsSubmitting(true)
    const descBase = product.size
      ? `Reposição: ${product.description} (${product.size})`
      : `Reposição: ${product.description}`

    const finalDescription =
      !isNaN(u) && u > 0
        ? `${descBase} (${q} un. x R$ ${u.toFixed(2)})`
        : `${descBase} (+${q} un.)`

    const res = await criarLancamento({
      description: finalDescription,
      amount: total,
      type: "COMPRA_ESTOQUE",
      productId: product.id,
      addedQuantity: q,
      newCostPrice: !isNaN(u) && u > 0 ? u : undefined,
    })

    setIsSubmitting(false)

    if (res.success) {
      setIsOpen(false)
      router.refresh()
      alert(
        `Estoque atualizado! Agora "${product.description}" possui ${
          Number(product.stock_quantity || 0) + q
        } unidades e a compra de R$ ${total.toFixed(2)} foi registrada em Lançamentos.`
      )
    } else {
      alert("Erro ao repor estoque: " + res.error)
    }
  }

  const qNum = parseInt(quantity, 10) || 0
  const novoEstoque = Number(product.stock_quantity || 0) + (qNum > 0 ? qNum : 0)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpen}
        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20"
        title="Repor Estoque (Soma quantidade e lança compra automaticamente)"
      >
        <PackagePlus className="h-4 w-4 mr-1" /> Repor
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white text-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-6 text-white bg-[#4a0e4e]">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Repor Estoque do Produto</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">
                [{product.code}] {product.description}{" "}
                {product.size ? `(${product.size})` : ""}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="rounded-lg bg-slate-100 p-3 flex justify-between items-center text-sm">
                <span className="text-slate-600 font-medium">
                  Estoque atual: <strong className="text-slate-900">{product.stock_quantity} un.</strong>
                </span>
                <span className="text-emerald-700 font-bold">
                  Novo estoque: {novoEstoque} un.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restockQty" className="text-slate-800 font-semibold">
                    Qtd. Comprada (+)
                  </Label>
                  <Input
                    id="restockQty"
                    type="number"
                    min="1"
                    step="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityOrUnitChange(e.target.value, unitPrice)
                    }
                    className="bg-white text-slate-900 border-slate-300"
                    required
                    autoFocus
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="restockUnit" className="text-slate-800 font-semibold">
                    Custo Pago Un. (R$)
                  </Label>
                  <Input
                    id="restockUnit"
                    type="number"
                    step="0.01"
                    placeholder="Ex: 20,00"
                    value={unitPrice}
                    onChange={(e) =>
                      handleQuantityOrUnitChange(quantity, e.target.value)
                    }
                    className="bg-white text-slate-900 border-slate-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="restockTotal" className="text-slate-800 font-semibold">
                  Valor Total Investido nesta Compra (R$)
                </Label>
                <Input
                  id="restockTotal"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-white text-slate-900 border-slate-300 font-bold"
                  required
                />
                {unitPrice && quantity && (
                  <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    ✓ Soma +{quantity} un. no estoque e registra R$ {amount || "0.00"} na tela de Lançamentos.
                  </p>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Somar Estoque e Lançar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
