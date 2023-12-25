export const loadConfig = async (configPath: string) => {
	let isESM = !(typeof module !== 'undefined' && module.exports);
	let isWindows = process.platform === 'win32';
	let hasFilePrefix = configPath.startsWith('file://');
	if (isWindows && isESM && !hasFilePrefix) configPath = `file://${configPath}`;
	let imported = await import(configPath);
	return isESM ? imported.default : imported;
};
