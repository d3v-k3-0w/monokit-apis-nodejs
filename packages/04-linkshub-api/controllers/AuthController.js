export const registerHandler = (req, res) => {
	res.json({ ok: 'register' });
};

export const loginHandler = (req, res) => {
	console.log(req.body);

	res.json({ ok: 'login' });
};
