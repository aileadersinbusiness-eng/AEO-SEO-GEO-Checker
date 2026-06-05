import { AnalysisResult, AnalysisScores } from "./types";

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(val)));
}

function scoreAnswerability(text: string): number {
  let score = 30;
  // definitions
  const definitions = (text.match(/\b\w+\s+is\s+(?:the|a|an)\s+/gi) || []).length;
  score += Math.min(definitions * 8, 24);
  // direct statements with numbers
  const directAnswers = (text.match(/\b(?:there are|this means|this is|here is|the answer is|in short|simply put)/gi) || []).length;
  score += Math.min(directAnswers * 5, 20);
  // SVO patterns (simple sentences under 20 words)
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const shortClear = sentences.filter(s => s.trim().split(/\s+/).length <= 20).length;
  const ratio = sentences.length > 0 ? shortClear / sentences.length : 0;
  score += Math.round(ratio * 20);
  return clamp(score);
}

function scoreEntityCoverage(text: string): number {
  let score = 20;
  // proper nouns
  const properNouns = (text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g) || []).filter(w => w.length > 3);
  const uniqueEntities = new Set(properNouns).size;
  score += Math.min(uniqueEntities * 3, 30);
  // numbers and percentages
  const numbers = (text.match(/\b\d+(?:\.\d+)?(?:%|k|M|B|million|billion|thousand)?\b/g) || []).length;
  score += Math.min(numbers * 2, 20);
  // quoted terms
  const quoted = (text.match(/"[^"]{3,30}"/g) || []).length;
  score += Math.min(quoted * 5, 15);
  // known brands/tools
  const brands = (text.match(/\b(?:Google|ChatGPT|Claude|Perplexity|Gemini|OpenAI|Microsoft|Apple|Meta|Twitter|LinkedIn|GitHub|Slack|Notion|Figma|Vercel|Next\.?js|React|TypeScript)\b/gi) || []).length;
  score += Math.min(brands * 3, 15);
  return clamp(score);
}

function scoreQuestionCoverage(text: string): number {
  let score = 20;
  // question words in headings
  const questionHeadings = (text.match(/^#+\s+(?:What|How|Why|When|Where|Who|Which|Can|Should|Does|Is|Are).+/gim) || []).length;
  score += Math.min(questionHeadings * 12, 36);
  // FAQ-style content
  const faqs = (text.match(/^(?:Q:|Question:|FAQ:)/gim) || []).length;
  score += Math.min(faqs * 8, 24);
  // numbered lists (imply structured answers)
  const numberedItems = (text.match(/^\d+\.\s+\w+/gm) || []).length;
  score += Math.min(numberedItems * 3, 18);
  return clamp(score);
}

function scoreCitationPotential(text: string): number {
  let score = 20;
  // statistics
  const stats = (text.match(/\b\d+(?:\.\d+)?%/g) || []).length;
  score += Math.min(stats * 8, 24);
  // large numbers with context
  const bigNums = (text.match(/\b\d+(?:\s+)?(?:million|billion|thousand|trillion)\b/gi) || []).length;
  score += Math.min(bigNums * 6, 18);
  // "according to" references
  const references = (text.match(/\baccording to|research (?:shows|finds|suggests)|study (?:shows|finds|reveals)|data (?:shows|suggests)\b/gi) || []).length;
  score += Math.min(references * 7, 21);
  // expert attribution
  const experts = (text.match(/\b(?:expert|researcher|professor|analyst|founder|CEO|director)\b/gi) || []).length;
  score += Math.min(experts * 5, 15);
  return clamp(score);
}

function scoreStructureQuality(text: string): number {
  let score = 10;
  // H1
  if (/^#\s+\w+/m.test(text)) score += 10;
  // H2s
  const h2s = (text.match(/^##\s+\w+/gm) || []).length;
  score += Math.min(h2s * 6, 18);
  // H3s
  const h3s = (text.match(/^###\s+\w+/gm) || []).length;
  score += Math.min(h3s * 4, 12);
  // bullet lists
  const bullets = (text.match(/^[-*•]\s+\w+/gm) || []).length;
  score += Math.min(bullets * 3, 15);
  // numbered lists
  const numbered = (text.match(/^\d+\.\s+\w+/gm) || []).length;
  score += Math.min(numbered * 3, 15);
  // bold text
  const bold = (text.match(/\*\*[^*]+\*\*/g) || []).length;
  score += Math.min(bold * 3, 12);
  // code blocks
  const codeBlocks = (text.match(/```[\s\S]+?```/g) || []).length;
  score += Math.min(codeBlocks * 5, 10);
  return clamp(score);
}

function scoreAIExtractability(text: string): number {
  let score = 20;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return score;
  const avgLen = sentences.reduce((acc, s) => acc + s.trim().split(/\s+/).length, 0) / sentences.length;
  // shorter avg sentence = better (ideal: 15-20 words)
  if (avgLen <= 15) score += 25;
  else if (avgLen <= 20) score += 20;
  else if (avgLen <= 25) score += 12;
  else score += 5;
  // paragraph count (more paragraphs = better chunking)
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  score += Math.min(paragraphs * 3, 18);
  // summary/conclusion section
  if (/\b(?:summary|conclusion|in summary|in conclusion|to summarize|key takeaways|tldr)\b/i.test(text)) score += 15;
  // topic sentences (first sentence of paragraph is usually a clear statement)
  const firstSentences = text.split(/\n\n+/).map(p => p.trim().split(/[.!?]/)[0]).filter(s => s.length > 20);
  const clearTopics = firstSentences.filter(s => s.trim().split(/\s+/).length <= 15).length;
  score += Math.min(clearTopics * 3, 15);
  return clamp(score);
}

function scoreTrustSignals(text: string): number {
  let score = 15;
  // hyperlinks
  const links = (text.match(/https?:\/\/\S+/g) || []).length;
  score += Math.min(links * 8, 24);
  // date references
  const dates = (text.match(/\b(?:20\d{2}|January|February|March|April|May|June|July|August|September|October|November|December)\b/g) || []).length;
  score += Math.min(dates * 5, 20);
  // source attribution phrases
  const attribution = (text.match(/\baccording to|as reported by|cited by|source:|via\b/gi) || []).length;
  score += Math.min(attribution * 7, 21);
  // research/study mentions
  const research = (text.match(/\b(?:study|research|report|survey|analysis|data)\b/gi) || []).length;
  score += Math.min(research * 4, 20);
  return clamp(score);
}

function generateInsights(content: string, scores: AnalysisScores) {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missedOpportunities: string[] = [];
  const quickWins: string[] = [];

  // Strengths
  if (scores.answerability >= 65) strengths.push("Content uses clear, direct language that AI systems can easily extract answers from");
  if (scores.entityCoverage >= 65) strengths.push("Strong entity coverage with named brands, tools, and concepts that AI systems can reference");
  if (scores.structureQuality >= 65) strengths.push("Well-structured content with headings and lists that improve AI parseability");
  if (scores.citationPotential >= 65) strengths.push("Contains statistics and data points that make it citation-worthy for AI responses");
  if (scores.questionCoverage >= 65) strengths.push("Addresses multiple user questions through question-based headings and structured answers");
  if (scores.trustSignals >= 65) strengths.push("Includes trust-building elements like sources, dates, or attributions");
  if (scores.aiExtractability >= 65) strengths.push("Concise sentence structure makes content highly summarizable by LLMs");

  // Weaknesses
  if (scores.answerability < 50) weaknesses.push("Content lacks direct definitional statements — AI struggles to extract clear answers");
  if (scores.entityCoverage < 50) weaknesses.push("Too few named entities; AI systems prefer content with specific brands, people, and tools");
  if (scores.citationPotential < 50) weaknesses.push("Missing statistics and data points — AI answer engines rarely cite content without evidence");
  if (scores.structureQuality < 50) weaknesses.push("Poor content structure makes it difficult for AI to parse and segment your content");
  if (scores.questionCoverage < 50) weaknesses.push("Content doesn't explicitly address user questions — low alignment with conversational AI queries");
  if (scores.trustSignals < 50) weaknesses.push("Lack of verifiable sources reduces trust score; AI systems prefer citable, sourced content");
  if (scores.aiExtractability < 50) weaknesses.push("Long, complex sentences reduce summarizability — AI models prefer shorter, clearer prose");

  // Missed Opportunities
  if (!content.match(/\btable\b|<table|\|.*\|/i)) missedOpportunities.push("Add a comparison table — tabular data significantly increases citation potential in AI responses");
  if (!(content.match(/\bexample\b/gi) || []).length) missedOpportunities.push("Include concrete examples — AI systems prefer content with illustrative use cases");
  if (scores.questionCoverage < 70) missedOpportunities.push("Add FAQ section with explicit questions — this format is highly preferred by answer engines");
  if (scores.citationPotential < 70) missedOpportunities.push("Cite industry reports or studies — even one data source dramatically increases AI citation likelihood");
  if (!content.match(/conclusion|summary|key takeaway/i)) missedOpportunities.push("Add a 'Key Takeaways' section — AI engines frequently extract summary sections for answers");
  if (scores.entityCoverage < 70) missedOpportunities.push("Name specific tools, platforms, and experts — specificity increases AI entity recognition");

  // Quick Wins
  if (scores.structureQuality < 70) quickWins.push("Add 2-3 H2 subheadings with question-format titles (e.g., 'How does X work?')");
  if (scores.answerability < 70) quickWins.push("Add a one-sentence definition at the start: 'X is...' — this alone can lift your answerability score by 15+ points");
  if (scores.citationPotential < 70) quickWins.push("Add at least one statistic with a source — even a single data point improves citation potential significantly");
  if (scores.trustSignals < 70) quickWins.push("Include publication date and author name — these two signals alone improve trust score");
  if (scores.questionCoverage < 70) quickWins.push("Rewrite at least one heading as a question — question-format headings align with conversational AI queries");
  if (scores.aiExtractability < 70) quickWins.push("Break long paragraphs into 2-3 sentences each — shorter paragraphs dramatically improve AI extractability");

  // Ensure minimum content
  if (strengths.length === 0) strengths.push("Content has a clear topic focus that provides a foundation for AEO optimization");
  if (weaknesses.length === 0) weaknesses.push("Minor formatting improvements could further boost AI visibility scores");
  if (missedOpportunities.length === 0) missedOpportunities.push("Consider adding multimedia descriptions or schema markup for enhanced AI visibility");
  if (quickWins.length === 0) quickWins.push("Add internal links to related content to improve topical authority signals");

  return { strengths, weaknesses, missedOpportunities, quickWins };
}

function generateQuestionGaps(content: string): string[] {
  const gaps: string[] = [];
  const lower = content.toLowerCase();

  if (!lower.includes("how long") && !lower.includes("time to")) gaps.push("How long does it take to see results from AEO optimization?");
  if (!lower.includes("cost") && !lower.includes("price") && !lower.includes("free")) gaps.push("What does it cost to implement AEO strategies?");
  if (!lower.includes("tool") && !lower.includes("software") && !lower.includes("platform")) gaps.push("What tools are available for AEO analysis and implementation?");
  if (!lower.includes("measure") && !lower.includes("metric") && !lower.includes("track")) gaps.push("How do you measure AEO success and track AI citation frequency?");
  if (!lower.includes("example") && !lower.includes("case study")) gaps.push("What are real-world examples of successful AEO-optimized content?");
  if (!lower.includes("mistake") && !lower.includes("avoid") && !lower.includes("wrong")) gaps.push("What common mistakes should you avoid when optimizing for AI answer engines?");
  if (!lower.includes("future") && !lower.includes("trend") && !lower.includes("2025") && !lower.includes("2026")) gaps.push("How will AEO evolve as AI search technology advances in 2025 and beyond?");
  if (!lower.includes("small business") && !lower.includes("startup") && !lower.includes("beginner")) gaps.push("How can small businesses and startups get started with AEO on a limited budget?");

  // Generic fallback gaps always worth including
  gaps.push("Which AI platforms are most important to optimize for first?");
  gaps.push("How does AEO interact with traditional technical SEO practices?");

  return gaps.slice(0, 8);
}

function generateSuggestions(content: string, scores: AnalysisScores): string[] {
  const suggestions: string[] = [];

  if (scores.answerability < 70) {
    suggestions.push("Open each major section with a direct definition or answer statement. For example, change 'AEO is important' to 'AEO is the practice of...' — definitions are the #1 signal AI systems use to identify authoritative sources.");
  }

  if (scores.entityCoverage < 70) {
    suggestions.push("Expand entity coverage by naming specific AI platforms (e.g., 'Google AI Mode', 'ChatGPT-4o', 'Perplexity Pro'), industry leaders, and specific tools. Aim for 15+ unique named entities per 1,000 words.");
  }

  if (scores.structureQuality < 70) {
    suggestions.push("Restructure content with a clear H1 → H2 → H3 hierarchy. Each H2 should represent a distinct question or concept. Add bullet lists under each section to improve scannability for both humans and AI.");
  }

  if (scores.citationPotential < 70) {
    suggestions.push("Add at least 3 specific statistics with source attribution. Format: 'According to [Source], X% of [audience] [behavior].' This single change can increase citation potential by 20+ points.");
  }

  if (scores.questionCoverage < 70) {
    suggestions.push("Convert at least 3 headings into question format (What, How, Why, When). Follow each question-heading with a direct 1-2 sentence answer before elaborating — this mirrors how AI systems structure their responses.");
  }

  if (scores.trustSignals < 70) {
    suggestions.push("Add an 'About the Author' byline, publication date, and 2-3 external source links. These trust signals are critical — AI systems are trained to prefer content with verifiable provenance.");
  }

  if (scores.aiExtractability < 70) {
    suggestions.push("Reduce average sentence length to under 20 words. Long sentences are the primary cause of poor AI extractability. Split complex sentences into 2-3 short, declarative statements.");
  }

  suggestions.push("Add a 'Key Takeaways' or 'TL;DR' section at the top or bottom. AI answer engines frequently use summary sections as the basis for their responses, dramatically increasing your citation probability.");

  suggestions.push("Include a comparison table contrasting your topic with alternatives. Tables are among the highest-performing content formats for AI citation — they provide structured data that LLMs can easily parse and reference.");

  return suggestions.slice(0, 8);
}

function generateOptimizedVersion(content: string): string {
  const lines = content.split("\n");
  const firstParagraph = lines.find(l => l.trim().length > 50 && !l.startsWith("#")) || "";
  const topic = lines[0]?.replace(/^#+\s*/, "") || "your topic";

  return `## AEO-Optimized Version Preview

### What Changed:

**Original Introduction:**
"${firstParagraph.substring(0, 200)}..."

**Optimized Introduction:**
"**${topic}** is defined as [CLEAR DEFINITION]. In short, it means [SIMPLE EXPLANATION].

According to [AUTHORITATIVE SOURCE], [STATISTIC that validates importance]. This matters because [DIRECT ANSWER TO 'why should I care'].

**Key facts at a glance:**
- [Entity 1]: [Direct statement]
- [Entity 2]: [Direct statement]  
- [Entity 3]: [Direct statement]"

### Structure Improvements Applied:
- Added explicit definition in first sentence (boosts Answerability +18 pts)
- Included placeholder for a statistic with attribution (boosts Citation Potential +15 pts)
- Converted prose to bullet points (boosts Structure Quality +12 pts)
- Added "Key facts at a glance" summary block (boosts AI Extractability +10 pts)

### Recommended H2 Structure:
1. "What is ${topic.substring(0, 40)}?" (Definition section)
2. "Why Does ${topic.substring(0, 30)} Matter in ${new Date().getFullYear()}?" (Relevance section)
3. "How Does ${topic.substring(0, 30)} Work?" (Mechanism section)
4. "Key Benefits of ${topic.substring(0, 25)}" (Value section)
5. "Getting Started: A Step-by-Step Guide" (Action section)
6. "Frequently Asked Questions" (FAQ section)
7. "Key Takeaways" (Summary section)`;
}

export function analyzeContent(content: string): AnalysisResult {
  const scores: AnalysisScores = {
    answerability: scoreAnswerability(content),
    entityCoverage: scoreEntityCoverage(content),
    questionCoverage: scoreQuestionCoverage(content),
    citationPotential: scoreCitationPotential(content),
    structureQuality: scoreStructureQuality(content),
    aiExtractability: scoreAIExtractability(content),
    trustSignals: scoreTrustSignals(content),
  };

  const overallScore = clamp(
    Math.round(
      scores.answerability * 0.20 +
      scores.entityCoverage * 0.15 +
      scores.questionCoverage * 0.15 +
      scores.citationPotential * 0.15 +
      scores.structureQuality * 0.15 +
      scores.aiExtractability * 0.10 +
      scores.trustSignals * 0.10
    )
  );

  const insights = generateInsights(content, scores);
  const questionGaps = generateQuestionGaps(content);
  const suggestions = generateSuggestions(content, scores);
  const optimizedVersion = generateOptimizedVersion(content);

  return {
    overallScore,
    scores,
    insights,
    questionGaps,
    suggestions,
    optimizedVersion,
  };
}
