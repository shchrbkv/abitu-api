module.exports = async (object, whitelist) => {
	for (const field in object) {
		if (!whitelist.includes(field)) delete object[field];
	}
	return object;
};
