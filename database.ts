import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

// Punto 3 guia 5 Arquitectura: Implementación Técnica de la Refactorización de la Capa de Datos
// Se crea esta clase para aplicar el patrón Singleton y abstraer la lógica de conexión.

dotenv.config();

class DatabaseSingleton {
  // Punto 3 guia 5 Arquitectura: El código debe incluir métodos estáticos (static) y un atributo privado para la instancia.
  private static instance: DatabaseSingleton;
  
  // Punto 1 guia 5 Arquitectura: Se centraliza la variable del cliente Prisma para evitar el acoplamiento en otros archivos.
  private prisma: PrismaClient;

  // Punto 3 guia 5 Arquitectura: El constructor debe estar protegido (private) para evitar instanciaciones externas usando "new DatabaseSingleton()".
  private constructor() {
    const connectionString = process.env.DATABASE_URL as string;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  // Punto 3 guia 5 Arquitectura: Método estático público para garantizar que solo exista una instancia en todo el ciclo de vida de la petición.
  public static getInstance(): DatabaseSingleton {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  // Punto 1 guia 5 Arquitectura: Método para exponer la conexión centralizada sin exponer la lógica de inicialización.
  public getClient(): PrismaClient {
    return this.prisma;
  }
}

export default DatabaseSingleton;
