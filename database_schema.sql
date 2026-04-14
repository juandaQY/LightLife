-- Arquitectura: guia 6 punto 1, aqui se adapta el esquema de base de datos relacional.
-- Definición de la estructura para PostgreSQL (equivalente a MySQL solicitado).

-- Tabla de Usuarios
CREATE TABLE "User" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "startHour" FLOAT DEFAULT 6.0,
    "totalHours" FLOAT DEFAULT 16.0,
    "interval" FLOAT DEFAULT 1.0,
    "hasConfigured" BOOLEAN DEFAULT FALSE
);

-- Tabla de Tareas (Garabatos)
CREATE TABLE "Task" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "colIndex" INTEGER NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "rowSpan" INTEGER DEFAULT 1,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "fk_user" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

