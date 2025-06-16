export default function (this: { query: { entry: string } }, source: string) {
  return source.replace("virtual:repacked/server", this.query.entry);
}
