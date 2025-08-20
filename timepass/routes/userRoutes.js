import express from 'express';


const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email) return res.json({ success: false, msg: 'Missing fields' });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.json({ success: false, msg: 'Email already used' });
    const u = await User.create({ name, email, department });
    res.json({ success: true, user: u });
  } catch (err) {
    console.log('create user err', err.message);
    res.json({ success: false, msg: 'Error creating user' });
  }
});

router.get('/', async (_req, res) => {
  const all = await User.find();
  res.json({ success: true, users: all });
});

export default router;
