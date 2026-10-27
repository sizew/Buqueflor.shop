import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { products, type Product } from './catalog'
import './App.css'

const WHATSAPP = '5541996014767'
const categories = ['Todos', 'Rosas', 'Buquês', 'Arranjos', 'Orquídeas', 'Girassóis', 'Lírios', 'Lisianthus', 'Gérberas', 'Tulipas', 'Kits e Presentes', 'Cestas']
const heroImage = '/catalog/assets-v1/988dfb52-78dc-4907-95ce-f4c95870c870/banner-principal.webp'
const secondHeroImage = '/catalog/assets-v1/b76bf1ab-b30b-4546-96c6-b3a4e3956c57/banner-secundario.webp'
const campaignImage = '/catalog/assets-v1/7d9165be-6f24-4d04-bf2d-16af197d0458/banner-campanha.webp'
const logoImage = '/catalog/assets-v1/8778c0fc-5099-449b-bfeb-8fc45d43a500/logo.webp'
const occasions = [
  { id: 'Namorados', label: 'Dia dos Namorados', icon: 'heart' },
  { id: 'Aniversário', label: 'Aniversário', icon: 'gift' },
  { id: 'special', label: 'Datas especiais', icon: 'cake' },
  { id: 'Pedido de desculpas', label: 'Desculpas', icon: 'flower' },
  { id: 'justbecause', label: 'Só porque merece', icon: 'sparkle' },
  { id: 'kits', label: 'Kits completos', icon: 'present' },
]
type CartItem = { product: Product; quantity: number }
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function OccasionIcon({ name }: { name: string }) {
  const common = { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const }
  if (name === 'heart') return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" /></svg>
  if (name === 'gift' || name === 'present') return <svg {...common}><rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8H7.5a2.5 2.5 0 1 1 2.5-2.5V8Zm0 0h4.5a2.5 2.5 0 1 0-2.5-2.5V8Z" /></svg>
  if (name === 'cake') return <svg {...common}><path d="M4 11h16v9H4zM3 20h18M8 11V8m8 3V8M12 11V5m-2 0a2 2 0 1 0 4 0"/><path d="M4 15c1.3 0 1.3 1 2.7 1s1.3-1 2.6-1 1.3 1 2.7 1 1.3-1 2.7-1 1.3 1 2.6 1 1.3-1 2.7-1"/></svg>
  if (name === 'flower') return <svg {...common}><path d="M12 13v8m-3 0h6M12 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 0a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 0a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Zm0 0a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z"/></svg>
  return <svg {...common}><path d="m12 3 2.2 5.4L20 10l-4.3 3.8 1.1 5.8-4.8-3-4.8 3 1.1-5.8L4 10l5.8-1.6L12 3Z"/></svg>
}

function App() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [heroSlide, setHeroSlide] = useState(0)
  const [occasion, setOccasion] = useState('')
  const [locationOpen, setLocationOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const productSlug = location.pathname.startsWith('/produto/') ? location.pathname.slice('/produto/'.length).replace(/\/$/, '') : ''
  const selectedProduct = products.find((product) => product.id === productSlug)
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = category === 'Todos' || product.category === category
    const matchesSearch = `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
    const matchesOccasion = !occasion || (occasion === 'special'
      ? product.occasions.some((item) => ['Dia das Mães', 'Nascimento', 'Corporativo'].includes(item))
      : occasion === 'justbecause'
        ? product.category !== 'Cestas' && product.category !== 'Arranjos'
        : occasion === 'kits'
          ? product.category === 'Kits e Presentes'
          : product.occasions.includes(occasion))
    return matchesCategory && matchesSearch && matchesOccasion
  }), [category, occasion, search])
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // ─── Meta Pixel ────────────────────────────────────────────────────────────
  useEffect(() => {
    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '2346595346169018');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2346595346169018&ev=PageView&noscript=1"/>`
    document.head.appendChild(noscript)
    return () => {
      document.head.removeChild(script)
      document.head.removeChild(noscript)
    }
  }, [])
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlide((slide) => (slide + 1) % 2), 6000)
    return () => window.clearInterval(timer)
  }, [])

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id)
      return existing ? current.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }]
    })
    setNotice(`${product.name} adicionado à sacola`)
    window.setTimeout(() => setNotice(''), 2500)
  }
  function changeQuantity(id: string, change: number) {
    setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: item.quantity + change } : item).filter((item) => item.quantity > 0))
  }
  function finishOrder() {
    if (!cart.length) return
    const lines = cart.map(({ product, quantity }) => `• ${quantity}x ${product.name} — ${money(product.price * quantity)}`).join('\n')
    const message = `Olá! Vim pelo site BuquêFlor e gostaria de fazer um pedido.\n\nMeu pedido:\n${lines}\n\nTotal estimado: ${money(total)}\n\nGostaria de confirmar a disponibilidade e combinar a entrega.`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }
  function goToCatalog() {
    navigate('/'); window.setTimeout(() => document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' }), 100)
  }
  function chooseOccasion(value: string) {
    setOccasion(value)
    setCategory('Todos')
    setSearch('')
    goToCatalog()
  }
  function openSearch() {
    goToCatalog()
    window.setTimeout(() => document.querySelector<HTMLInputElement>('.mobile-search input')?.focus(), 180)
  }
  function ProductCard({ product }: { product: Product }) {
    return <article className="product-card">
      <div className="product-image" role="link" tabIndex={0} aria-label={`Ver detalhes de ${product.name}`} onClick={() => navigate(`/produto/${product.id}`)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate(`/produto/${product.id}`) } }}>
        <img src={product.image} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} />
        {product.oldPrice > product.price && <span className="product-tag">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
        <button className="quick-add" onClick={(event) => { event.stopPropagation(); addToCart(product) }} aria-label={`Adicionar ${product.name} à sacola`}>+</button>
      </div>
      <div className="product-info"><span className="product-category">{product.category}</span><h3><a href={`/produto/${product.id}`} onClick={(event) => { event.preventDefault(); navigate(`/produto/${product.id}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{product.name}</a></h3><p>{product.description}</p><small className="product-rating">★ {product.rating.toFixed(1)} ({product.reviews} avaliações)</small>
        <div className="product-bottom"><strong>{money(product.price)} <del>{money(product.oldPrice)}</del></strong><button onClick={() => addToCart(product)}>Adicionar +</button></div>
      </div>
    </article>
  }

  return <div className="store">
    <div className="announcement">Pagamento via PIX · acompanhe seu pedido em tempo real</div>
    <header className="header">
      <div className="header-main">
        <a className="brand" href="/" aria-label="BuquêFlor, início" onClick={(event) => { event.preventDefault(); navigate('/') }}><img className="brand-logo" src={logoImage} alt="BuquêFlor" /></a>
        <nav className="desktop-nav"><a href="/" onClick={(e) => { e.preventDefault(); navigate('/') }}>Início</a><a href="/#produtos" onClick={(e) => { e.preventDefault(); goToCatalog() }}>Nossos buquês</a><a href="/#sobre" onClick={(e) => { e.preventDefault(); navigate('/'); window.setTimeout(() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Sobre nós</a><a href="/#contato" onClick={(e) => { e.preventDefault(); navigate('/'); window.setTimeout(() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }), 100) }}>Contato</a></nav>
        <div className="header-actions">
          <button className="location-button" aria-label="Consultar região de entrega" onClick={() => setLocationOpen(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></button>
          <button className="cart-button" aria-label={`Sacola, ${itemCount} itens`} onClick={() => setCartOpen(true)}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span className="cart-count">{itemCount}</span></button>
        </div>
      </div>
      <label className="search-box mobile-search"><span>⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setOccasion('') }} placeholder="Buscar buquês, flores, presentes..." aria-label="Buscar produtos" /></label>
    </header>
    <main>{selectedProduct ? <section className="catalog product-detail-page"><button className="continue-button" onClick={() => navigate('/')} style={{ width: 'auto', marginBottom: 28 }}>← Voltar para a loja</button><div className="product-detail"><div className="product-detail-image"><img src={selectedProduct.image} alt={selectedProduct.name} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} /></div><div className="product-detail-info"><span className="eyebrow">{selectedProduct.category}</span><p className="product-tag-detail">★ {selectedProduct.rating.toFixed(1)} · {selectedProduct.reviews} avaliações</p><h1>{selectedProduct.name}</h1><p className="product-detail-description">{selectedProduct.description}</p><strong className="product-detail-price">{money(selectedProduct.price)} <del>{money(selectedProduct.oldPrice)}</del></strong><p className="product-detail-delivery">Preço e disponibilidade podem variar por região. Confirme entrega e disponibilidade pelo WhatsApp.</p><button className="whatsapp-button product-detail-add" onClick={() => addToCart(selectedProduct)}>Adicionar à sacola ♡</button><button className="continue-button" onClick={() => setCartOpen(true)}>Ver minha sacola ({itemCount})</button></div></div><div className="related-products"><h2>Você também pode gostar</h2><div className="product-grid">{products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div></div></section> : productSlug ? <section className="catalog"><h1>Produto não encontrado</h1><p>Este produto não está disponível neste catálogo.</p><button className="primary-button" onClick={() => navigate('/')}>Voltar para a loja</button></section> : <>
      <section className="hero-banner" id="inicio"><a href="#produtos" aria-label="Escolher presente"><img src={heroSlide === 0 ? heroImage : secondHeroImage} alt={heroSlide === 0 ? 'Sentimentos em forma de presente. Surpreenda quem você ama com buquês e presentes especiais.' : 'Você pede, a floricultura parceira prepara e entrega.'} /></a><div className="hero-dots"><button aria-label="Ver banner 1 de 2" aria-current={heroSlide === 0} onClick={() => setHeroSlide(0)} /><button aria-label="Ver banner 2 de 2" aria-current={heroSlide === 1} onClick={() => setHeroSlide(1)} /></div></section>
      <section className="occasion-section" aria-labelledby="occasion-title"><span className="eyebrow">PARA TODAS AS OCASIÕES</span><h2 id="occasion-title">O presente certo para cada momento</h2><div className="occasion-list">{occasions.map((item) => <button key={item.id} className={occasion === item.id ? 'occasion-option active' : 'occasion-option'} onClick={() => chooseOccasion(item.id)}><span className="occasion-icon"><OccasionIcon name={item.icon} /></span><span>{item.label}</span></button>)}</div></section>
      <section className="benefits" id="como-funciona"><div><span>✿</span><p><strong>Entrega no mesmo dia</strong><small>Em capitais e regiões metropolitanas</small></p></div><div><span>♡</span><p><strong>Garantia de frescor</strong><small>Chegou murcho? A gente troca</small></p></div><div><span>✎</span><p><strong>Cartão grátis</strong><small>Mensagem escrita à mão</small></p></div></section>
      <section className="catalog" id="produtos"><div className="section-heading"><div><span className="eyebrow">NOSSA VITRINE</span><h2>{occasion ? occasions.find((item) => item.id === occasion)?.label : 'Presentes que emocionam'}</h2><p>Escolha entre {filteredProducts.length} presentes e flores para cada ocasião.</p></div><label className="search-box catalog-search"><span>⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setOccasion('') }} placeholder="Buscar buquês, flores, presentes..." aria-label="Buscar produtos" /></label></div>
        <div className="categories" aria-label="Categorias de produtos">{categories.map((item) => <button key={item} className={category === item ? 'category active' : 'category'} onClick={() => { setCategory(item); setOccasion('') }}>{item}</button>)}</div>
        <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>{filteredProducts.length === 0 && <div className="empty-search">Não encontramos produtos com esse nome. Tente outra busca.</div>}</section>
      <a className="campaign-banner" href="#produtos" aria-label="Surpreenda hoje"><img src={campaignImage} alt="Surpreenda hoje: faça o dia dela muito mais especial." loading="lazy" /></a><section className="love-banner" id="sobre"><span>UM PRESENTE COM SIGNIFICADO</span><h2>O carinho floresce nos pequenos gestos.</h2><p>Escolha suas flores favoritas e prepare uma surpresa inesquecível.</p><a className="primary-button" href="#produtos">Escolher flores →</a></section>
      <section className="contact-section" id="contato"><div><span className="eyebrow">VAMOS CONVERSAR?</span><h2>Vamos preparar algo especial?</h2><p>Confirme a disponibilidade da sua região com nosso atendimento pelo WhatsApp.</p></div><a className="whatsapp-button" href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de conhecer os buquês disponíveis.')}`} target="_blank" rel="noreferrer">Conversar pelo WhatsApp ↗</a></section>
    </>}</main>
    <footer className="footer" id="rodape">
      <div className="footer-about">
        <a className="footer-brand" href="/" aria-label="BuquêFlor, início" onClick={(event) => { event.preventDefault(); navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><img src={logoImage} alt="BuquêFlor" /></a>
        <p>Marketplace de floriculturas locais. Você escolhe, uma floricultura perto de quem você ama monta e entrega no mesmo dia.</p>
      </div>
      <div className="footer-column"><h2>Ocasiões</h2><a href="#produtos" onClick={(event) => { event.preventDefault(); chooseOccasion('Namorados') }}>Amor e namoro</a><a href="#produtos" onClick={(event) => { event.preventDefault(); chooseOccasion('Aniversário') }}>Aniversário</a><a href="#produtos" onClick={(event) => { event.preventDefault(); chooseOccasion('Pedido de desculpas') }}>Pedido de desculpas</a><a href="#produtos" onClick={(event) => { event.preventDefault(); chooseOccasion('special') }}>Datas corporativas</a></div>
      <div className="footer-column"><h2>Ajuda</h2><a href="#como-funciona" onClick={(event) => { event.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }}>Como funciona a entrega</a><a href="#como-funciona" onClick={(event) => { event.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }) }}>Trocas e garantia da flor</a><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de acompanhar meu pedido.')}`} target="_blank" rel="noreferrer">Acompanhar pedido</a><a href="#contato" onClick={(event) => { event.preventDefault(); document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' }) }}>Fale com a gente</a></div>
      <div className="footer-column footer-payment"><h2>Pagamento</h2><p>Pix com um Ambiente protegido.</p><div className="footer-trust"><span aria-hidden="true">♡</span><span>Mais de 90 mil presentes entregues</span></div></div>
    </footer>
    <nav className="mobile-bottom-nav" aria-label="Navegação principal">
      <button onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}><span className="nav-icon">⌂</span><small>Início</small></button>
      <button onClick={openSearch}><span className="nav-icon">⌕</span><small>Buscar</small></button>
      <button onClick={() => setCartOpen(true)}><span className="nav-icon nav-bag">♧{itemCount > 0 && <b>{itemCount}</b>}</span><small>Sacola</small></button>
      <button onClick={() => window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Gostaria de acompanhar meu pedido.')}`, '_blank', 'noopener,noreferrer')}><span className="nav-icon">▤</span><small>Pedidos</small></button>
    </nav>
    {notice && <div className="toast" role="status">{notice}</div>}
    {locationOpen && <div className="overlay location-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setLocationOpen(false) }}><section className="location-dialog" role="dialog" aria-modal="true" aria-labelledby="location-title"><button className="close-button" onClick={() => setLocationOpen(false)} aria-label="Fechar">×</button><span className="location-dialog-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></span><h2 id="location-title">Entrega perto de você</h2><p>Consulte as flores disponíveis e confirme o prazo de entrega pelo WhatsApp.</p><button className="primary-button" onClick={() => { setLocationOpen(false); goToCatalog() }}>Ver flores disponíveis</button></section></div>}
    {cartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setCartOpen(false) }}><aside className="cart-panel" aria-label="Sua sacola"><div className="cart-header"><div><span className="eyebrow">SEU PEDIDO</span><h2>Sua sacola ♡</h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Fechar sacola">×</button></div>{cart.length === 0 ? <div className="cart-empty"><span>♡</span><h3>Sua sacola está vazia</h3><p>Escolha flores especiais para começar seu pedido.</p><button className="primary-button" onClick={() => { setCartOpen(false); goToCatalog() }}>Ver produtos</button></div> : <><div className="cart-items">{cart.map(({ product, quantity }) => <div className="cart-item" key={product.id}><img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.style.visibility = 'hidden' }} /><div className="cart-item-info"><strong>{product.name}</strong><span>{money(product.price)}</span><div className="quantity"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Diminuir ${product.name}`}>−</button><span>{quantity}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Aumentar ${product.name}`}>+</button></div></div><strong>{money(product.price * quantity)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal estimado</span><strong>{money(total)}</strong></div><p>Disponibilidade, entrega e eventuais taxas serão confirmadas pela floricultura.</p><button className="whatsapp-button checkout-button" onClick={finishOrder}>Finalizar pelo WhatsApp</button><button className="continue-button" onClick={() => setCartOpen(false)}>Continuar comprando</button></div></>}</aside></div>}
  </div>
}

export default App
