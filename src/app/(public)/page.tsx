import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div 
      className="min-h-screen text-amber-50 relative overflow-hidden"
      style={{
        backgroundImage: "url('/bg-orixas.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Camada de sobreposição ajustada: mais transparente para destacar a imagem */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0525]/70 via-[#4a0e4e]/40 to-[#2a0845]/60" />

      {/* Conteúdo principal - precisa ficar acima da sobreposição (z-10) */}
      <div className="relative z-10">
        {/* Navbar simplificada */}
        <nav className="flex items-start justify-between p-6 max-w-7xl mx-auto">
          {/* Spacer esquerdo para centralizar o meio perfeitamente */}
          <div className="hidden md:block w-32"></div>
          
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Império da Rosa 7 Logo" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-[#d4af37]/50 shadow-2xl shadow-[#d4af37]/20 object-cover"
            />
            <div className="text-2xl md:text-3xl font-extrabold tracking-widest text-[#d4af37] drop-shadow-md">
              IMPÉRIO DA ROSA 7
            </div>
          </div>

          <Link href="/login" className="mt-4 md:mt-0 px-6 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#2a0845] font-semibold hover:scale-105 transition-transform whitespace-nowrap shadow-lg shadow-[#d4af37]/20">
            Acesso Restrito
          </Link>
        </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#e0c3fc]">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-sm font-medium tracking-wide">Sistema de Gestão</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Gestão inteligente com o respeito que o <span className="text-[#d4af37] drop-shadow-md">Sagrado</span> merece
          </h1>
          
          <p className="text-xl text-[#e0c3fc] max-w-2xl leading-relaxed">
            Controle total do seu estoque, clientes e fluxo de caixa. A tecnologia a serviço da sua loja, garantindo organização com eficiência e simplicidade.
          </p>

          <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
            <Link href="/login" className="px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#2a0845] font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 shadow-xl shadow-[#d4af37]/20">
              Acessar Painel <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Decorative Element / Mockup area */}
        <div className="flex-1 w-full relative hidden md:block">
          <div className="absolute inset-0 bg-[#d4af37] rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="relative border border-white/10 bg-black/20 backdrop-blur-3xl rounded-3xl p-8 shadow-2xl">
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center">👑</div>
                  <div>
                    <h3 className="font-bold text-lg">Controle de Estoque</h3>
                    <p className="text-sm text-amber-200/60">Nunca deixe faltar o essencial</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center">💻</div>
                  <div>
                    <h3 className="font-bold text-lg">Ponto de Venda Ágil</h3>
                    <p className="text-sm text-amber-200/60">Vendas rápidas e seguras</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">🛡️</div>
                  <div>
                    <h3 className="font-bold text-lg">Dados Protegidos</h3>
                    <p className="text-sm text-amber-200/60">Sua gestão com total segurança</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  )
}
