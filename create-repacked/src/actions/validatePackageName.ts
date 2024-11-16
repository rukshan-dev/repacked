import validateProjectName from "validate-npm-package-name";

const validatePackageName = (name: string) => {
  const result = validateProjectName(name);
  if (result.validForNewPackages) {
    return true;
  }
  return [...(result.errors || []), ...(result.warnings || [])].join(", ");
};

export default validatePackageName;
