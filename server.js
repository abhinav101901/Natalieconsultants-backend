// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const shell = require('shelljs');
const cors = require('cors')

// Set up bodyParser for JSON and form data
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pdf = require('pdf-parse');
const fs = require('fs');

const port = 3000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Define the destination directory for uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Endpoint for summing two numbers
app.post('/api/sum', (req, res) => {
  let{ num1, num2 } = req.body;
  let sum = Number(num1) + Number(num2);

  console.log(sum)
  return res.status(200).send({ status: true, SumOfNumber:sum });
});

// Endpoint for appending two strings
app.post('/api/append', (req, res) => {
  let { string1, string2 } = req.body;
  let appendString = string1 + ' ' + string2;
  console.log(appendString)
  return res.status(200).send({ status: true, message: appendString });
});

app.post('/api/upload', upload.single('pdfFile'), (req, res) => {
  // Handle the uploaded PDF file here
  const filePath = req.file.path;
  const dataBuffer = fs.readFileSync(filePath);
  pdf(dataBuffer)
  .then((data) => {
    // Extract text content from the PDF
    const text = data.text;
    // Count words (you can define your own criteria for word separation)
    let wordCount = text.split(/\s+/).length;
    let data1 = wordCount - 2
    console.log(`Word count in the PDF: ${data1}`);
    return res.status(200).send({ status: true, message: data1 });
  })
  .catch((error) => {
    console.error('Error reading the PDF:', error);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
