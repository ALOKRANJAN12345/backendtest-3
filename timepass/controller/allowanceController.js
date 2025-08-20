import AllowanceRequest from '../models/AllowanceRequest.js';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create request → sends email to HR
export const createRequest = async (req, res) => {
  const { userId, amount, description } = req.body;
  if (!userId || !amount) {
    return res.json({ success: false, msg: 'Missing fields' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ success: false, msg: 'User not found' });

    const newReq = new AllowanceRequest({ user: userId, amount, description });
    await newReq.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.HR_EMAIL,
      subject: `New Allowance Request from ${user.name}`,
      text: `Amount: ${amount}\nDescription: ${description || '-'}\nDate: ${newReq.date.toDateString()}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.log('Email error', err.message);
      else console.log('Email sent:', info.response);
    });

    res.json({ success: true, msg: 'Request created', id: newReq._id });
  } catch (err) {
    console.log('createRequest error', err.message);
    res.json({ success: false, msg: 'Error creating request' });
  }
};

// Get all requests
export const getRequests = async (req, res) => {
  try {
    const data = await AllowanceRequest.find().populate('user');
    res.json({ success: true, requests: data });
  } catch (err) {
    res.json({ success: false, msg: 'Error fetching requests' });
  }
};

// Update request status (Approved/Rejected)
export const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.json({ success: false, msg: 'Invalid status' });
  }
  try {
    await AllowanceRequest.findByIdAndUpdate(id, { status });
    res.json({ success: true, msg: 'Status updated' });
  } catch (err) {
    res.json({ success: false, msg: 'Error updating status' });
  }
};

// Delete request
export const deleteRequest = async (req, res) => {
  const { id } = req.params;
  try {
    await AllowanceRequest.findByIdAndDelete(id);
    res.json({ success: true, msg: 'Request deleted' });
  } catch (err) {
    res.json({ success: false, msg: 'Error deleting request' });
  }
};
