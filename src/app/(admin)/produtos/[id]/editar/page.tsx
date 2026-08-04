import { ProdutoForm } from "@/components/produtos/produto-form"
import { buscarProdutoPorId } from "@/app/actions/produtos"
import { notFound } from "next/navigation"

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const produto = await buscarProdutoPorId(params.id)

  if (!produto) {
    notFound()
  }

  return <ProdutoForm initialData={produto} />
}
