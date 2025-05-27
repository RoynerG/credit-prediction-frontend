import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const nav = useNavigate();
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Predicción de Riesgo Crediticio
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Modelo entrenado con <strong>credit-g.arff</strong> (1000 registros,
          21 atributos) para clasificar riesgo como{" "}
          <span className="font-semibold">good</span> o{" "}
          <span className="font-semibold">bad</span>.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => nav("/form")}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition"
          >
            Ir al Formulario
          </button>
        </div>
      </div>
    </div>
  );
}
