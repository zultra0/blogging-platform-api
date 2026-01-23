Welcome to the repository of my Blogging Platform API!

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
git clone https://github.com/zultra0/blogging-platform-api.git
```

2. Navigate to the project directory:

```bash
cd blogging-platform-api
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
    'Introduction to TypeScript in the Backend',
    'Learning TypeScript is essential for building robust APIs with Node.js and Express. It improves type safety and facilitates long-term maintenance.',
    'Programming',
    ARRAY['typescript', 'node', 'backend', 'web']
),
(
    'Optimizing Queries with Drizzle ORM',
    'Drizzle ORM is a lightweight and efficient tool for handling SQL databases. In this post we will see how to use the Query Builder to improve performance.',
    'Databases',
    ARRAY['drizzle', 'orm', 'sql', 'postgres']
),
(
    'The Future of Development with NextJS',
    'NextJS has established itself as the leading framework for React. We will discuss the advantages of Server Components and the new Server Actions.',
    'Web Development',
    ARRAY['nextjs', 'react', 'frontend', 'javascript']
),
(
    'Intelligent Search in PostgreSQL',
    'PostgreSQL offers powerful tools for full-text search (FTS). Implementing an intelligent engine with to_tsvector and tsquery is easier than it seems.',
    'Databases',
    ARRAY['postgres', 'fts', 'search', 'backend']
),
(
    'Microservices Architecture with Express',
    'How to scale a blogging platform using microservices written in Node.js and communicated through message queues or REST APIs.',
    'Architecture',
    ARRAY['microservices', 'express', 'node', 'scalability']
);
```

5. Run the app:

```bash
npm run dev
```

That's it, you're done🥳! 

## Using the API endpoints

### Create Blog Post ###

Create a new blog post using the POST method.

```bash
POST /posts
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"]
}
```

The endpoint will validate the request body and return a 201 Created status code with the newly created blog post i.e.

```bash
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"],
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z"
}
```

or a 400 Bad Request status code with error messages in case of validation errors.

### Update Blog Post ###

Update an existing blog post using the PUT method.

```bash
PUT /posts/1
{
  "title": "My Updated Blog Post",
  "content": "This is the updated content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"]
}
```

The endpoint will validate the request body and return a 200 OK status code with the updated blog post i.e.

```bash
{
  "id": 1,
  "title": "My Updated Blog Post",
  "content": "This is the updated content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"],
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:30:00Z"
}
```

or a 400 Bad Request status code with error messages in case of validation errors. It will return a 404 Not Found status code if the blog post was not found.

### Delete Blog Post ###

Delete an existing blog post using the DELETE method.

```bash
DELETE /posts/1
```

The endpoint will return a 204 No Content status code if the blog post was successfully deleted or a 404 Not Found status code if the blog post was not found.

### Get Blog Post ###

Get a single blog post using the GET method.

```bash
GET /posts/1
```

The endpoint will return a 200 OK status code with the blog post i.e.

```bash
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post.",
  "category": "Technology",
  "tags": ["Tech", "Programming"],
  "createdAt": "2021-09-01T12:00:00Z",
  "updatedAt": "2021-09-01T12:00:00Z"
}
```

or a 404 Not Found status code if the blog post was not found.

### Get All Blog Posts ###

Get all blog posts using the GET method.

```bash
GET /posts
```

The endpoint will return a 200 OK status code with an array of blog posts i.e.

```bash
[
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post.",
    "category": "Technology",
    "tags": ["Tech", "Programming"],
    "createdAt": "2021-09-01T12:00:00Z",
    "updatedAt": "2021-09-01T12:00:00Z"
  },
  {
    "id": 2,
    "title": "My Second Blog Post",
    "content": "This is the content of my second blog post.",
    "category": "Technology",
    "tags": ["Tech", "Programming"],
    "createdAt": "2021-09-01T12:30:00Z",
    "updatedAt": "2021-09-01T12:30:00Z"
  }
]
```

You can also filter posts by a keyword. The application will perform a full-text (FTS) search on the title, content, and category fields of blog posts. For example:

```bash
GET /posts?term=typescript
```

This will return all blog posts that have the term "typescript" in their title, content or category.

## Author

- [@mkco](https://github.com/mkco17)
