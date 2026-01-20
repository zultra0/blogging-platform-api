import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const ftsSearch = (
  columns: AnyPgColumn[],
  term: string,
  lang = "spanish",
): SQL => {
  const concatenatedColumns = sql.join(columns, sql` || ' ' || `);
  return sql`to_tsvector(${lang}, ${concatenatedColumns}) @@ plainto_tsquery(${lang}, ${term})`;
};