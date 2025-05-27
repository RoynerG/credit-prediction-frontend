import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { predictCredit } from "../services/api";

// Mapeo de opciones en español (mostrar) y su valor (enviar)
const OPTIONS = {
  checkingStatus: {
    label: "Estado de cuenta corriente",
    values: {
      "<0": "Menos de 0",
      "0<=X<200": "Entre 0 y 200",
      ">=200": "Más de 200",
      "no checking": "Sin cuenta",
    },
  },
  creditHistory: {
    label: "Historial crediticio",
    values: {
      "no credits/all paid": "Sin créditos / todo pagado",
      "all paid": "Todo pagado",
      "existing paid": "Créditos existentes pagados",
      "delayed previously": "Pagos retrasados anteriormente",
      "critical/other existing credit": "Crédito existente crítico",
    },
  },
  purpose: {
    label: "Propósito del crédito",
    values: {
      "new car": "Auto nuevo",
      "used car": "Auto usado",
      "furniture/equipment": "Muebles/equipos",
      "radio/tv": "Radio/TV",
      "domestic appliance": "Electrodoméstico",
      repairs: "Reparaciones",
      education: "Educación",
      vacation: "Vacaciones",
      retraining: "Reentrenamiento",
      business: "Negocio",
      other: "Otro",
    },
  },
  savingsStatus: {
    label: "Estado de ahorros",
    values: {
      "<100": "Menos de 100",
      "100<=X<500": "100 a 499",
      "500<=X<1000": "500 a 999",
      ">=1000": "1000 o más",
      "no known savings": "Sin ahorros conocidos",
    },
  },
  employment: {
    label: "Situación laboral",
    values: {
      unemployed: "Desempleado",
      "<1": "Menos de 1 año",
      "1<=X<4": "1 a 3 años",
      "4<=X<7": "4 a 6 años",
      ">=7": "7 o más años",
    },
  },
  personalStatus: {
    label: "Estado civil/personal",
    values: {
      "male div/sep": "Hombre divorciado/separado",
      "female div/dep/mar": "Mujer casada/divorciada/viuda",
      "male single": "Hombre soltero",
      "male mar/wid": "Hombre casado/viudo",
      "female single": "Mujer soltera",
    },
  },
  otherParties: {
    label: "Otros solicitantes",
    values: {
      none: "Ninguno",
      "co applicant": "Co-solicitante",
      guarantor: "Garante",
    },
  },
  propertyMagnitude: {
    label: "Propiedad",
    values: {
      "real estate": "Bienes raíces",
      "life insurance": "Seguro de vida",
      car: "Carro",
      "no known property": "Sin propiedad conocida",
    },
  },
  otherPaymentPlans: {
    label: "Otros planes de pago",
    values: {
      bank: "Banco",
      stores: "Tiendas",
      none: "Ninguno",
    },
  },
  housing: {
    label: "Tipo de vivienda",
    values: {
      rent: "Arriendo",
      own: "Propia",
      "for free": "Sin costo",
    },
  },
  job: {
    label: "Ocupación",
    values: {
      "unemp/unskilled non res": "Desempleado/no calificado",
      "unskilled resident": "No calificado residente",
      skilled: "Calificado",
      "high qualif/self emp/mgmt":
        "Alta calificación / independiente / gestión",
    },
  },
  ownTelephone: {
    label: "¿Tiene teléfono propio?",
    values: {
      none: "No",
      yes: "Sí",
    },
  },
  foreignWorker: {
    label: "¿Es trabajador extranjero?",
    values: {
      yes: "Sí",
      no: "No",
    },
  },
  duration: { label: "Duración del crédito (meses)" },
  creditAmount: { label: "Monto del crédito" },
  installmentCommitment: { label: "Compromiso de cuota" },
  residenceSince: { label: "Años en residencia actual" },
  existingCredits: { label: "Créditos existentes" },
  numDependents: { label: "Número de dependientes" },
};

export default function PredictionForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    checkingStatus: "",
    duration: 1,
    creditHistory: "",
    purpose: "",
    creditAmount: 1,
    savingsStatus: "",
    employment: "",
    installmentCommitment: 1,
    personalStatus: "",
    otherParties: "none",
    residenceSince: 1,
    propertyMagnitude: "",
    otherPaymentPlans: "none",
    housing: "rent",
    existingCredits: 1,
    job: "unemp/unskilled non res",
    numDependents: 1,
    ownTelephone: "none",
    foreignWorker: "yes",
  });
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: typeof form[name] === "number" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPending) return;
    setError("");
    setIsPending(true);
    try {
      const result = await predictCredit(form);
      nav("/result", { state: { result, form } });
    } catch (e) {
      setError(e.response?.data?.message || "Error de predicción");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12 border border-gray-300">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Formulario de Predicción de Crédito
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {Object.entries(form).map(([key, val]) => {
            const field = OPTIONS[key];
            return (
              <div key={key} className="flex flex-col">
                <label htmlFor={key} className="mb-2 font-medium text-gray-700">
                  {field.label}
                </label>
                {field.values ? (
                  <select
                    id={key}
                    name={key}
                    value={val}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Seleccione...
                    </option>
                    {Object.entries(field.values).map(([v, label]) => (
                      <option key={v} value={v}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={val}
                    onChange={handleChange}
                    min={1}
                    required
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </div>
            );
          })}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className={`mt-4 w-full md:w-auto px-8 py-3 font-semibold rounded-full transition ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {isPending ? "Enviando…" : "Predecir Crédito"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
