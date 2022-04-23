module.exports = (f) => {
	return function (...args) {
		return new Promise((resolve, reject) => {
			function callback(err, result) {
				if (err) {
					return reject(err);
				} else {
					resolve(result);
				}
			}
			args.push(callback);
			f.call(this, ...args);
		});
	};
};
