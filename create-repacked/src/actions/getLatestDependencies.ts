export type Deps = {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
};

const getNpmPluginData = () => {
  return new Promise<Record<string, string>>((resolve) => {
    fetch("https://registry.npmjs.org/repacked")
      .then((response) => response.json())
      .then((data) => {
        const version = data["dist-tags"].latest;
        resolve({
          repacked: version,
          typescript: data.versions[version].dependencies.typescript,
        });
      })
      .catch((error) => resolve({}));
  });
};

const getLatestDependencies = async () => {
  const deps: Deps = {
    dependencies: {},
    devDependencies: {},
  };
  const pluginData = await getNpmPluginData();
  deps.devDependencies = { ...deps.devDependencies, ...pluginData };
  return deps;
};

export default getLatestDependencies;
