
export interface ProductAnalysis {
  productName: string;
  isSafe: boolean;
  confidence: 'Alta' | 'Media' | 'Baja' | 'Incierta';
  reasoning: string;
  alternatives: string[];
  warnings: string[];
}

export type HistoryItem = {
  id: string;
  type: 'single' | 'comparison' | 'image';
  query: string;
  data: ProductAnalysis | ProductAnalysis[];
  timestamp: number;
};
