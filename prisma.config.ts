import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Colocamos la URL directamente para asegurar que Prisma la lea 100%
    // ⚠️ IMPORTANTE: Cambia TU_CONTRASEÑA por tu contraseña real de Postgres
    url: "postgresql://postgres:5432@localhost:5432/lightlife_db?schema=public",
  },
});