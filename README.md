# 📓 LightLife

Tu libreta de tareas personal — diseño skeuomórfico estilo cuaderno escolar.

---

## 🚀 Cómo ejecutar el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd lightlife
```

### 2. Instala las dependencias

```bash
npm install
```

> Esto descarga todo lo necesario para que el proyecto funcione. Solo hay que hacerlo una vez.

### 3. Arranca el servidor

```bash
npm run dev
```

### 4. Abre en el navegador

```
http://localhost:3000
```

---

## 📄 Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal — agregar y gestionar tareas |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta nueva |
| `/dashboard` | Panel principal (próximamente) |
| `/dashboard/usuario` | Perfil de usuario (próximamente) |
| `/dashboard/empresa` | Panel de empresa (próximamente) |

---

## 🛠️ Tecnologías usadas

- **Next.js 14** — framework de React para las páginas y rutas
- **Tailwind CSS** — utilidades de estilo
- **CSS puro** — toda la estética de libreta hecha a mano en `globals.css`
- **Google Fonts** — Caveat, Patrick Hand, Indie Flower

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── layout.jsx
│   ├── page.jsx            ← página principal
│   ├── globals.css         ← estilos de la libreta
│   ├── (auth)/
│   │   ├── login/
│   │   └── registro/
│   └── dashboard/
│       ├── usuario/
│       └── empresa/
├── components/
│   ├── Calendario.jsx
│   └── TareaForm.jsx
└── lib/
    ├── db.js
    └── utils.js
```

---

## ⚠️ Notas

- Las tareas se guardan en memoria — al recargar la página se borran. Próximamente se conectará una base de datos.
- La carpeta `node_modules` no está incluida en el repositorio. Ejecuta `npm install` para generarla.

---

*✏️ LightLife — tu cuaderno digital*
