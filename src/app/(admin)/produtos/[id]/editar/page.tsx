import { ProdutoForm } from "@/components/produtos/produto-form"
import { buscarProdutoPorId } from "@/app/actions/produtos"
import { notFound } from "next/navigation"

export default async function EditarProdutoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const produto = await buscarProdutoPorId(id)

  if (!produto) {
    notFound()
  }

  return <ProdutoForm initialData={produto} />
}
