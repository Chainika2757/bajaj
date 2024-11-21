const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// File upload setup
const upload = multer();

// Helper functions
const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const analyzeInput = (data) => {
  const numbers = [];
  const alphabets = [];
  let highestLowercase = "";

  data.forEach((item) => {
    if (!isNaN(item)) {
      numbers.push(item);
    } else if (/^[A-Za-z]$/.test(item)) {
      alphabets.push(item);
      if (item === item.toLowerCase() && item > highestLowercase) {
        highestLowercase = item;
      }
    }
  });

  return {
    numbers,
    alphabets,
    highestLowercase: highestLowercase ? [highestLowercase] : [],
    isPrimeFound: numbers.some((num) => isPrime(Number(num))),
  };
};

// POST endpoint
app.post("/bfhl", upload.single("file"), (req, res) => {
  const { data, file_b64 } = req.body;

  if (!data) {
    return res
      .status(400)
      .json({ is_success: false, message: "Invalid input" });
  }

  const user_id = "john_doe_17091999"; // Replace with dynamic logic if needed
  const email = "john@xyz.com"; // Replace with actual value
  const roll_number = "ABCD123"; // Replace with actual value

  const analysis = analyzeInput(data);

  let fileInfo = {
    file_valid: false,
    file_mime_type: null,
    file_size_kb: null,
  };

  if (file_b64) {
    try {
      const buffer = Buffer.from(file_b64, "base64");
      fileInfo = {
        file_valid: true,
        file_mime_type: "application/octet-stream", // Adjust based on input
        file_size_kb: (buffer.length / 1024).toFixed(2),
      };
    } catch {
      fileInfo.file_valid = false;
    }
  }

  res.json({
    is_success: true,
    user_id,
    email,
    roll_number,
    ...analysis,
    ...fileInfo,
  });
});

// GET endpoint
app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
