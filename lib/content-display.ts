export function withoutSources(text: string): string {
  return text.split("\n").filter(line => !/^\s*Источники?\s*:/iu.test(line) && !/^\s*https:\/\/www\.fragpunk\.com\/news\//i.test(line)).join("\n").trim();
}
