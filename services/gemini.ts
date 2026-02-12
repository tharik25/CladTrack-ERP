
import { GoogleGenAI, Type } from "@google/genai";
import { Project, WorkstationCapacity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function simulateQuoteImpact(
  newQuoteDetails: string,
  currentProjects: Project[],
  workstationCapacities: WorkstationCapacity[]
) {
  const prompt = `
    As an Industrial Engineering Simulation expert, analyze the impact of a new fabrication project on our current workshop workload.
    
    Current Workshop State:
    - Active Projects: ${JSON.stringify(currentProjects.map(p => ({ name: p.name, status: p.status })))}
    - Workstations: ${JSON.stringify(workstationCapacities.map(w => ({ name: w.name, capacity: w.dailyCapacityHours })))}
    
    New Project Quote Request:
    ${newQuoteDetails}
    
    Tasks:
    1. Identify potential bottlenecks.
    2. Estimate how this project shifts current project delivery dates (Risk Assessment).
    3. Suggest an optimal slot for start of production.
    
    Return a professional assessment in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            impactSummary: { type: Type.STRING },
            riskLevel: { type: Type.STRING, description: "Low, Medium, High" },
            bottlenecks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            suggestedStartDate: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          },
          required: ["impactSummary", "riskLevel", "bottlenecks", "suggestedStartDate"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Simulation failed:", error);
    return null;
  }
}
