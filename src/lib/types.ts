export interface AnalysisScores {
  answerability: number;
  entityCoverage: number;
  questionCoverage: number;
  citationPotential: number;
  structureQuality: number;
  aiExtractability: number;
  trustSignals: number;
}

export interface AnalysisInsights {
  strengths: string[];
  weaknesses: string[];
  missedOpportunities: string[];
  quickWins: string[];
}

export interface AnalysisResult {
  overallScore: number;
  scores: AnalysisScores;
  insights: AnalysisInsights;
  questionGaps: string[];
  suggestions: string[];
  optimizedVersion: string;
}
