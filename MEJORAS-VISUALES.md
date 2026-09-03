# Mejoras visuales — seguimiento

Objetivo: mejoras visuales globales de la plataforma, avanzando paso por paso.
Identidad de marca: **blanco + verde** (tema claro) / **negro + verde neón** (tema oscuro).

Leyenda de estado: `[x]` hecho · `[~]` en progreso · `[ ]` pendiente

---

## Paso 1 — Fundación visual  `[x]` COMPLETADO

Archivos: `app/layout.tsx`, `app/globals.css`

- [x] Cargar de verdad la fuente Inter + Geist Mono vía `next/font` (antes caía a fuente del sistema)
- [x] Variables CSS de fuente (`--font-inter`, `--font-geist-mono`) aplicadas en `<html>`
- [x] Eliminar tokens de color duplicados (`--primary`, `--ring` estaban 2 veces)
- [x] Añadir tokens faltantes: `--secondary-foreground`, `--chart-3`
- [x] Escala de sombras coherente por tema (`--shadow-xs/sm/md/lg`, `--elev-shadow`)
- [x] Curva de easing común (`--ease`)
- [x] Tipografía: suavizado, `tracking-tight` + `text-wrap: balance` en h1–h4, `text-wrap: pretty` en `p`
- [x] Color de selección de texto con tinte verde
- [x] Scrollbar fino y temático (claro/oscuro)
- [x] Soporte `prefers-reduced-motion` (accesibilidad)
- [x] Mejor contraste de `--muted-foreground` (AA) en ambos temas
- [x] Hover de tarjetas/botones más sobrio

Pendiente de verificación: no se pudo correr `next build` (sin `node_modules` instalado).

---

## Paso 2 — Navegación (Navbar + ThemeToggle)  `[x]` COMPLETADO

Archivos: `components/landing/navbar.tsx`, `components/theme-toggle.tsx`
Extra: `app/dashboard/layout.tsx` (había un **conflicto de merge sin resolver** que rompía el build — resuelto a favor de `DashboardShell`, igual que admin)

- [x] Menú móvil en el navbar con `Sheet` lateral (enlaces + acciones de acceso)
- [x] En móvil solo se ve marca + botón hamburguesa; las acciones pasan al panel
- [x] Quitar estilos inline hardcodeados del ThemeToggle (`rgba(34,197,94)`, `text-yellow-500`, `text-slate-700`, `border-green-400`)
- [x] ThemeToggle con tokens del tema (`border-border`, `bg-background/80`, `ring-ring`) y glow verde de marca (neón en oscuro)
- [x] Transición sol/luna con rotación + fundido en vez de intercambio brusco
- [x] Foco accesible (`focus-visible:ring-ring`) en toggle y trigger del menú
- [x] Navbar: altura afinada, borde y blur más sutiles, `pr-16` para no chocar con el botón flotante de tema
- [x] `next build` compila correctamente (falla sólo el prerender por falta de BD, no relacionado)

---

## Paso 3 — Landing (Hero / Etapas / Lotes / Footer)  `[x]` COMPLETADO

Archivos: `components/landing/hero-section.tsx`, `stages-section.tsx`, `lots-section.tsx`, `footer.tsx`

- [x] **Hero — bug de tema corregido:** el overlay usaba `bg-foreground/70`, que en modo oscuro se volvía **casi blanco** y tapaba el texto. Ahora es un gradiente oscuro fijo + tinte verde radial, independiente del tema
- [x] Hero: eliminada la lógica `useTheme`/`mounted`/`isDark` (ya no hace falta); ahora es Server Component, texto siempre blanco
- [x] Hero: botones full-width en móvil, jerarquía tipográfica más marcada, tarjetas de stats con hover
- [x] **Footer — bug de tema corregido:** usaba `bg-foreground text-background`, que en oscuro se volvía **fondo blanco con texto negro**. Ahora verde profundo fijo (`#0b3b2b` / `#070d0a` en oscuro)
- [x] Footer: año dinámico (`new Date().getFullYear()`), símbolo ©, jerarquía de enlaces
- [x] Etapas: rail de timeline visible también en móvil, punto "en curso" con pulso animado, estados textuales (En curso / Completada), etiqueta "Proceso", empty state
- [x] Lotes: tarjeta rediseñada (imagen full-bleed con zoom en hover, badge sólido, nº de cuartos, precio destacado, botón sólido), empty state con icono
- [x] `next build` compila correctamente ✅

---

## Paso 4 — Autenticación (Login / Registro / Recuperar / Restablecer / Verificar)  `[x]` COMPLETADO

Archivos: `app/login|registro|recuperar|restablecer|verificar/page.tsx`, `components/auth/*`
Nuevo: `components/auth/auth-layout.tsx`

- [x] **Nuevo `<AuthLayout>` compartido**: fondo de marca (imagen + degradado verde con el color correcto), botón "Inicio" flotante idéntico en las 5 páginas, centrado consistente
- [x] Antes: `login` y `registro` tenían fondo con `style` inline y verde `rgb(6,128,50)` (no es el de marca); `recuperar`/`restablecer`/`verificar` no tenían fondo ni botón "Inicio"
- [x] Eliminado el doble `min-h-screen` anidado (page + form)
- [x] Tarjetas de formulario consistentes (`border-white/10 shadow-2xl`, icono en pastilla, radios unificados)
- [x] Estados de éxito con tokens (`bg-primary/10 text-primary`) en vez de `bg-green-100`/`text-green-600` hardcodeados
- [x] Estados de error con borde + fondo consistentes en todos los formularios
- [x] `verificar`: estado de carga con spinner y mensaje de error diferenciado
- [x] Corregido bug de tipos preexistente en `verify-form.tsx` (`state.success` sobre unión discriminada)
- [x] Tildes/ortografía corregidas en textos visibles
- [x] `tsc` limpio ✅ · `next build` compila ✅

---

## Paso 5 — Paneles (Admin + Dashboard)  `[ ]` PENDIENTE

Archivos: `components/admin/admin-shell.tsx`, `components/admin/sidebar.tsx`, `components/dashboard/dashboard-shell.tsx`, `components/dashboard/sidebar.tsx`, páginas de `app/admin/*` y `app/dashboard/*`

- [ ] Unificar el fondo del admin-shell (imagen `/fondo.jpg` al 70% + `bg-black/30` compite con el contenido)
- [ ] Header de panel: consistencia entre admin y dashboard
- [ ] Sidebar: item activo, hover, densidad, sección de usuario
- [ ] Tablas y tarjetas de datos: densidad, cabeceras, estados vacíos
- [ ] Botón hamburguesa / colapso: comportamiento y foco

---

## Registro de cambios

| Fecha | Paso | Commit | Notas |
|-------|------|--------|-------|
| 2026-09-02 | 1 | 44ce4a6 | Fundación: fuentes + tokens + tipografía + sombras |
| 2026-09-03 | 2 | (sin commit aún) | Navbar con menú móvil + ThemeToggle con tokens; resuelto conflicto de merge en dashboard/layout |
| 2026-09-03 | 3 | (sin commit aún) | Landing: bugs de tema en Hero y Footer, timeline de Etapas, tarjetas de Lote |
| 2026-09-03 | 4 | (sin commit aún) | Auth: AuthLayout compartido, tarjetas y estados consistentes |
