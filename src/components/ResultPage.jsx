// src/pages/ResultPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { getRecommendation } from "../services/api";

export default function ResultPage() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { result, form } = state || {};
  const [recommendation, setRecommendation] = useState("");

  useEffect(() => {
    if (!result) {
      nav("/");
      return;
    }

    const prompt =
      `Soy un sistema de análisis de riesgo crediticio. ` +
      `Se ha evaluado el siguiente perfil del solicitante:\n\n${JSON.stringify(
        form,
        null,
        2
      )}\n\nEl modelo ha predicho que su comportamiento crediticio es '${
        result.predictedClass
      }'.\n` +
      (result.predictedClass === "good"
        ? `Dame 3 recomendaciones para mantener su buen desempeño.`
        : `Dame 3 consejos específicos para mejorar su perfil y reducir el riesgo.`);

    setRecommendation("Generando recomendación…");

    getRecommendation(prompt)
      .then((text) => setRecommendation(text))
      .catch((err) => {
        const code = err.response?.data?.error?.code;
        if (code === "insufficient_quota") {
          setRecommendation(
            "Lo siento, he superado mi cuota de Gemini. Por favor revisa tu plan o inténtalo más tarde."
          );
        } else if (err.response?.status === 429) {
          setRecommendation(
            "Demasiadas solicitudes. Espera unos segundos e inténtalo de nuevo."
          );
        } else {
          setRecommendation(
            "Error al generar la recomendación: " +
              (err?.response?.data?.error?.message || err.message)
          );
        }
      });
  }, [result, form, nav]);

  if (!result) return null;

  const data = [
    { name: "Good", value: result.probabilityGood },
    { name: "Bad", value: result.probabilityBad },
  ];

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Resultado de la Predicción
        </h2>

        <div className="w-full h-64">
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="mt-6 text-lg text-center">
          <strong>Clase predicha:</strong> {result.predictedClass}
        </p>

        <div className="mt-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Recomendación
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}
