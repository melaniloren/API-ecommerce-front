{/* ── HERO (solo en catálogo) ── */}
      {vistaActiva === 'catalogo' && (
<section className="hero">
<div className="hero-content">
<h1 className="hero-title">Descubrí recetas únicas</h1>
<p className="hero-sub">Las mejores recetas artesanales, listas para cocinar en casa.</p>
<button className="hero-cta" onClick={() => navegar('register')}>
              Comenzar ahora →
</button>
</div>
<div className="hero-deco" aria-hidden="true">🫕</div>
</section>
      )}