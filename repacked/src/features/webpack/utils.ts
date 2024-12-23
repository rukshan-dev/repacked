import { Stats, StatsError } from "webpack";
interface CallbackWebpack<T> {
  (err: null | Error, stats?: T): void;
}

const filterKnownWarnings = (warnings: StatsError[]) => {
  const knownPackages = ["yargs", "express", "repacked"].map(
    (pkg) => `node_modules/${pkg}`
  );

  const containsAny = (str: string, values: string[]) => {
    return values.some((value) => str.includes(value));
  };

  return warnings.filter((warning) => {
    if (
      warning.message.includes("Critical dependency") &&
      containsAny(warning.moduleName ?? "", knownPackages)
    ) {
      return false;
    }
    return true;
  });
};

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
    const filteredWarnings = filterKnownWarnings(statsData?.warnings ?? []);
    if (filteredWarnings.length > 0) {
      console.warn(filteredWarnings);
    }
  }
};
