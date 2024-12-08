import { Stats } from "webpack";
interface CallbackWebpack<T> {
  (err: null | Error, stats?: T): void;
}
export const logWebpackErrors: CallbackWebpack<Stats> = (
  err: (Error & { details?: unknown }) | null,
  stats
) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    process.exit(1);
  }
  const statsData = stats?.toJson();
  if (stats?.hasErrors()) {
    console.error(statsData?.errors);
    process.exit(1);
  }
  if (stats?.hasWarnings()) {
    console.warn(statsData?.warnings);
  }
};
