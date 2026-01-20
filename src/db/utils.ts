import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const ftsSearch = (
  columns: AnyPgColumn[],
  term: string,
  lang = "spanish",
): SQL => {
  const concatenatedColumns = sql.join(columns, sql` || ' ' || `);
  const formattedTerm = term
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");

  return sql`to_tsvector(${lang}, ${concatenatedColumns}) @@ to_tsquery(${lang}, ${formattedTerm})`;
};