import express from "express";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

class Text2ImageAPI {
  constructor(url, apiKey, secretKey) {
    this.URL = url;
    this.AUTH_HEADERS = {
      "X-Key": `Key ${apiKey}`,
      "X-Secret": `Secret ${secretKey}`,
    };
  }

  async getModels() {
    const response = await axios.get(`${this.URL}key/api/v1/models`, { headers: this.AUTH_HEADERS });
    return response.data[0].id;
  }

  async generate(prompt, model, images = 1, width = 1024, height = 1024, style = 3) {
    const styles = ["DEFAULT", "KANDINSKY", "UHD", "ANIME"];
    const params = {
      type: "GENERATE",
      numImages: images,
      width,
      height,
      style: styles[style],
      generateParams: {
        query: prompt,
      },
    };

    const formData = new FormData();
    const modelIdData = { value: model, options: { contentType: null } };
    const paramsData = { value: JSON.stringify(params), options: { contentType: "application/json" } };
    formData.append("model_id", modelIdData.value, modelIdData.options);
    formData.append("params", paramsData.value, paramsData.options);

    const response = await axios.post(`${this.URL}key/api/v1/text2image/run`, formData, {
      headers: {
        ...formData.getHeaders(),
        ...this.AUTH_HEADERS,
      },
      "Content-Type": "multipart/form-data",
    });
    const data = response.data;
    return data.uuid;
  }

  async checkGeneration(requestId, attempts = 10, delay = 10) {
    while (attempts > 0) {
      try {
        const response = await axios.get(`${this.URL}key/api/v1/text2image/status/${requestId}`, { headers: this.AUTH_HEADERS });
        const data = response.data;
        if (data.status === "DONE") {
          return data.images;
        }
      } catch (error) {
        console.error(error);
      }
      attempts--;
      await new Promise((resolve) => setTimeout(resolve, delay * 1000));
    }
  }
}

// Создаем приложение Express
const app = express();
const PORT = 3000;
const apiKey = process.env.X_KEY;
const secretKey = process.env.X_SECRET;

// Создаем экземпляр API
const api = new Text2ImageAPI("https://api-key.fusionbrain.ai/", apiKey, secretKey);

// Для обработки JSON в теле запроса
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://webp-gen-image.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  // Если это OPTIONS запрос (предварительный запрос CORS), возвращаем статус 200
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Маршрут для генерации изображения
app.post("/generate-image", async (req, res) => {
  try {
    const { prompt, width, height, style } = req.body;

    const modelId = await api.getModels();

    const uuid = await api.generate(prompt, modelId, 1, width, height, style);

    const images = await api.checkGeneration(uuid);

    const base64String = images[0];

    const imgBuffer = Buffer.from(base64String, "base64");

    const webpBuffer = await sharp(imgBuffer).toFormat("webp").toBuffer();

    const webpBase64 = webpBuffer.toString("base64");

    res.json({ image: webpBase64, status: "done" });
  } catch (error) {
    console.error("Ошибка при генерации изображения:", error);
    res.status(500).json({ error: "Ошибка при генерации изображения" });
  }
});

// // Маршрут для сохранения изображения в файл
// app.post("/save-image", (req, res) => {
//   try {
//     const { base64String } = req.body;

//     // Преобразование строки base64 в бинарные данные
//     const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

//     // Создание буфера из бинарных данных
//     const buffer = Buffer.from(base64Data, "base64");

//     // Запись буфера в файл
//     fs.writeFile("image.webp", buffer, "base64", (err) => {
//       if (err) throw err;
//       res.json({ message: "Файл сохранен!" });
//     });
//   } catch (error) {
//     console.error("Ошибка при сохранении изображения:", error);
//     res.status(500).json({ error: "Ошибка при сохранении изображения" });
//   }
// });

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
