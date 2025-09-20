
import { GoogleGenAI, Type } from "@google/genai";
import type { ProductAnalysis } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const productAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "El nombre del producto analizado, tal como lo interpreta la IA.",
    },
    isSafe: {
      type: Type.BOOLEAN,
      description: "Verdadero si el producto es apto para celíacos, falso si no lo es o si hay dudas.",
    },
    confidence: {
      type: Type.STRING,
      description: "Nivel de confianza en la respuesta: 'Alta', 'Media', 'Baja', o 'Incierta'.",
    },
    reasoning: {
      type: Type.STRING,
      description: "Explicación detallada de por qué el producto es o no es apto. Mencionar ingredientes clave y si está en listas oficiales como la de ANMAT.",
    },
    warnings: {
      type: Type.ARRAY,
      description: "Posibles advertencias, como contaminación cruzada, o ingredientes dudosos a verificar.",
      items: {
        type: Type.STRING,
      },
    },
    alternatives: {
      type: Type.ARRAY,
      description: "Lista de 2 a 3 productos alternativos que sí son aptos y se consiguen en Argentina.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["productName", "isSafe", "confidence", "reasoning", "warnings", "alternatives"],
};

const systemInstruction = `Eres 'Celia-IA', un asistente experto en celiaquía enfocado exclusivamente en el mercado argentino. Tu misión es analizar productos y determinar si son 'Sin TACC' (Trigo, Avena, Cebada, Centeno).
- Si recibes un solo producto, analiza ese. Si recibes una lista de productos (separados por comas o en líneas diferentes), analiza CADA UNO por separado y devuelve un resultado para cada uno en un array JSON.
- Basa tus respuestas en el listado oficial de Alimentos Libres de Gluten de la ANMAT (Administración Nacional de Medicamentos, Alimentos y Tecnología Médica) de Argentina.
- Si un producto no está explícitamente en la lista, pero sus ingredientes parecen seguros, indícalo con un nivel de confianza 'Medio' o 'Bajo' y advierte sobre la contaminación cruzada.
- Siempre busca el logo oficial 'Sin TACC' en tu base de conocimientos sobre empaques de productos argentinos.
- Proporciona una respuesta clara, concisa y útil. Ofrece alternativas seguras y disponibles en Argentina.
- Tu tono debe ser tranquilizador, experto y amigable. Eres un recurso de confianza para la comunidad celíaca.`;

export const analyzeProduct = async (productQuery: string): Promise<ProductAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza el siguiente producto o lista de ingredientes para determinar si es apto para celíacos en Argentina: "${productQuery}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: productAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("La respuesta de la IA estaba vacía.");
    }
    
    return JSON.parse(jsonText) as ProductAnalysis;
  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    throw new Error("No se pudo obtener una respuesta del asistente de IA.");
  }
};

export const analyzeMultipleProducts = async (productsQuery: string): Promise<ProductAnalysis[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analiza CADA UNO de los siguientes productos en la lista y determina si son aptos para celíacos en Argentina. Devuelve un array de resultados, uno para cada producto: "${productsQuery}"`,
      config: {
        systemInstruction,
        temperature: 0.2,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: productAnalysisSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("La respuesta de la IA estaba vacía.");
    }
    
    return JSON.parse(jsonText) as ProductAnalysis[];
  } catch (error) {
    console.error("Error al llamar a la API de Gemini para comparación:", error);
    throw new Error("No se pudo obtener una respuesta del asistente de IA para la comparación.");
  }
};

export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<ProductAnalysis> => {
  try {
    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType,
      },
    };

    const prompt = `Analiza la imagen de este producto o su lista de ingredientes para determinar si es apto para celíacos en Argentina. Si ves un nombre de producto, úsalo.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        systemInstruction,
        temperature: 0.2,
        topP: 0.9,
        responseMimeType: "application/json",
        responseSchema: productAnalysisSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("La respuesta de la IA estaba vacía.");
    }
    
    return JSON.parse(jsonText) as ProductAnalysis;
  } catch (error) {
    console.error("Error al llamar a la API de Gemini con imagen:", error);
    throw new Error("No se pudo obtener una respuesta del asistente de IA para la imagen.");
  }
};
