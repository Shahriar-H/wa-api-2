
const express = require('express');
const router = new express.Router();
const { startClient, sendMessage } = require("../services/WhatsappClient")
const multer  = require('multer');

const upload = multer()


router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post("/message", upload.single("file"), (req, res) => {
  const file = req.file
  const clientId = req.body.clientId;
  sendMessage1(req.body.phoneNumber, req.body.message);
  res.send();
})

router.get('/:id/start', async (req, res) => {
  startClient(req.params.id,req, res)
  console.log('result');
  res.send()
})

module.exports = router