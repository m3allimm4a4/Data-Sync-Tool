const express = require('express');
const fs = require('fs/promises');

const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);
  await fs.writeFile(`${__dirname}/../../data.json`, JSON.stringify(req.body), 'utf8');
  return res.status(201).json({
    status: 'success',
    message: 'Orders created',
  });
});

module.exports = router;
