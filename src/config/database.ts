import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

// guia 5 punto 3 aqui usamos el equivalente de implementar el patrón Singleton para la conexión a la base de datos en Node.js.
// Al exportar "prisma" desde este módulo, Node.js lo cachea en memoria, garantizando que solo exista una instancia en toda la petición.
const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

declare global {
  // Evitamos que TypeScript se queje por la variable global
  var prismaInstance: PrismaClient | undefined;
}

// guia 5 punto 3 aqui usamos el equivalente de getInstance() en PHP.
// Reutilizamos la instancia si ya existe, sino la creamos. Evita saturar el pool en desarrollo.
export const prisma = globalThis.prismaInstance || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaInstance = prisma;
}
