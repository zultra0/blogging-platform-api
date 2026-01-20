<p style="text-align: center;">¡Welcome to the repository of my Blogging Platform API!</p>

## Features

### Core Technologies

- Express (Backend framework)
- TypeScript (For compile-time type checking)
- PostgreSQL (Database engine)
- Drizzle (ORM)
- Zod (For runtime data validation)

### API Features

- Create a new blog post.
- Update an existing blog post.
- Delete an existing blog post.
- Get a single blog post.
- Get all blog posts.
- Filter blog posts by a keyword.
- Strict validation of the request body using Zod.
- Centralized handling of all types of errors with global error handler.

## Getting Started

### Prerequisites

- NodeJS
- npm
- PostgreSQL
- Visual Studio Code (or any IDE of your choice)
- Yaak (or any REST Client of your choice)

## Development

To run this project locally, you need to set up the development environment.

### Setup

1. Clone the repository:

```bash
git clone https://github.com/zultra0/Blogging-Platform-API.git
```

2. Navigate to the project directory:

```bash
cd Blogging-Platform-API
```

3. Install dependencies using npm:

```bash
npm install
```

### Environment Setup

1. Create a `.env` file.

2. Within the .env file, define the URL of your Postgres database and the port where the server will run. For example:

```bash
DATABASE_URL=postgresql://postgres:123@localhost:5432/blogging-platform-db
PORT=3000
```
3. In your database, create a new table called posts:

```bash
CREATE TABLE public.posts
(
    id serial NOT NULL,
    title character varying(255) NOT NULL,
    content character varying(10000) NOT NULL,
    category character varying(255) NOT NULL,
    tags text[] NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);
```

4. Populate the database:

```bash
INSERT INTO public.posts (title, content, category, tags) VALUES
(
    'Introducción a TypeScript en el Backend',
    'Aprender TypeScript es fundamental para construir APIs robustas con Node.js y Express. Mejora la seguridad de tipos y facilita el mantenimiento a largo plazo.',
    'Programación',
    ARRAY['typescript', 'node', 'backend', 'web']
),
(
    'Optimizando Consultas con Drizzle ORM',
    'Drizzle ORM es una herramienta ligera y eficiente para manejar bases de datos SQL. En este post veremos cómo usar el Query Builder para mejorar el rendimiento.',
    'Bases de Datos',
    ARRAY['drizzle', 'orm', 'sql', 'postgres']
),
(
    'El futuro del desarrollo con NextJS',
    'NextJS se ha consolidado como el framework líder para React. Discutiremos las ventajas de los Server Components y las nuevas Server Actions.',
    'Desarrollo Web',
    ARRAY['nextjs', 'react', 'frontend', 'javascript']
),
(
    'Búsqueda Inteligente en PostgreSQL',
    'PostgreSQL ofrece potentes herramientas para búsqueda de texto completo (FTS). Implementar un motor inteligente con to_tsvector y tsquery es más sencillo de lo que parece.',
    'Bases de Datos',
    ARRAY['postgres', 'fts', 'search', 'backend']
),
(
    'Arquitectura de Microservicios con Express',
    'Cómo escalar una plataforma de blogging utilizando microservicios escritos en Node.js y comunicados mediante colas de mensajes o APIs REST.',
    'Arquitectura',
    ARRAY['microservicios', 'express', 'node', 'escalabilidad']
);
```

5. Run the app:

```bash
npm run dev
```

## Author

- [@zultra0](https://github.com/zultra0)
