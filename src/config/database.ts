import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

// Arquitectura: guia 5 punto 3, aqui se adapta el patrón Singleton para centralizar la instancia de conexión a la base de datos.
// Esto garantiza que solo exista una instancia de conexión en todo el ciclo de vida de la petición.
class Database {
  // Atributo estático para almacenar la única instancia de la clase
  private static instance: Database;
  
  // Propiedad pública para usar los métodos de Prisma
  public prisma: PrismaClient;

  // Arquitectura: guia 5 punto 3, aqui se adapta el requisito de que el constructor debe estar protegido (private) para evitar instanciaciones externas.
  private constructor() {
    const connectionString = process.env.DATABASE_URL as string;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  // Arquitectura: guia 5 punto 3, aqui se adapta el método estático para devolver la única instancia.
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

export default Database;
