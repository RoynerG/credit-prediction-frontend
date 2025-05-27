import axios from "axios";

const BASE_URL = "http://localhost:8080/credit";

export function predictCredit(data) {
  return axios.post(`${BASE_URL}/predict`, data).then((res) => res.data);
}

export function getRecommendation(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`;

  return axios
    .post(
      url,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      return (
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No se generó texto."
      );
    })
    .catch((err) => {
      console.error(
        "❌ Error al generar recomendación con Gemini:",
        err.response?.data || err.message
      );
      throw err;
    });
}
