import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn } from "drizzle-orm/pg-core";

export const ftsSearch = (
  columns: AnyPgColumn[],
  term: string,
  lang = "spanish",
): SQL => {
  const concatenatedColumns: SQL = sql.join(columns, sql` || ' ' || `);
  const formattedTerm = term
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}:*`)
    .join(" & ");

  return sql`to_tsvector(${lang}, ${concatenatedColumns}) @@ to_tsquery(${lang}, ${formattedTerm})`;
};

/*
Example of final transformation
If the user types: " Node Express "
1. Trim: "Node Express"
2. Split: ["Node", "Express"]
3. Map: ["Node:*", "Express:*"]
4. Join: "Node:* & Express:*"
*/
