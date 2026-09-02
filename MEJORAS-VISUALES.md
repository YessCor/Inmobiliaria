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

## Paso 2 — Navegación (Navbar + ThemeToggle)  `[ ]` PENDIENTE

Archivos: `components/landing/navbar.tsx`, `components/theme-toggle.tsx`

- [ ] Menú móvil en el navbar (hoy no existe; los enlaces desaparecen en móvil)
- [ ] Quitar estilos inline hardcodeados del ThemeToggle (`rgba(34,197,94)` no es el verde de marca)
- [ ] ThemeToggle usando tokens del tema y transición coherente
- [ ] Estados de foco accesibles en ambos
- [ ] Navbar: afinar altura, contraste del blur, activo del enlace

---

## Paso 3 — Landing (Hero / Etapas / Lotes / Footer)  `[ ]` PENDIENTE

Archivos: `components/landing/hero-section.tsx`, `stages-section.tsx`, `lots-section.tsx`, `footer.tsx`

- [ ] Hero: mejorar contraste del texto sobre la imagen (overlay/gradiente), jerarquía tipográfica
- [ ] Hero: simplificar lógica de color de texto según tema
- [ ] Tarjetas de estadísticas del hero más pulidas
- [ ] Sección Etapas: timeline más claro, estados (pasada/activa/futura)
- [ ] Tarjetas de lote: imagen, badge, precio, jerarquía y hover
- [ ] Footer: espaciado, jerarquía de enlaces, año dinámico

---

## Paso 4 — Autenticación (Login / Registro / Recuperar / Restablecer / Verificar)  `[ ]` PENDIENTE

Archivos: `app/login/page.tsx`, `app/registro/page.tsx`, `app/recuperar/page.tsx`, `app/restablecer/page.tsx`, `app/verificar/page.tsx`, `components/auth/*`

- [ ] Unificar el fondo (hoy con `style` inline y colores distintos por página)
- [ ] Tarjeta de formulario consistente (padding, sombra, radio)
- [ ] Botón "Inicio" flotante consistente entre páginas
- [ ] Estados de error / carga de formularios
- [ ] Consistencia de inputs y labels

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
| 2026-09-02 | 1 | (pendiente de commit) | Fundación: fuentes + tokens + tipografía + sombras |
