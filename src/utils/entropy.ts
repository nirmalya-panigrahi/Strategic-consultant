import { Framework, Question } from '../types';

const categoryQuestions: Record<string, string> = {
  'Strategic Planning': "Is your organization focused on long-term corporate vision, market positioning, or competitive strategy formulation?",
  'Customer Relationship Management': "Are we looking to analyze consumer behavior, customer acquisition channels, or brand communication journeys?",
  'Product Development': "Are we designing, prioritizing, or iterating on a specific product, feature backlog, or service model?",
  'Risk Assessment': "Is your immediate priority identifying operational risks, safety protocols, or managing public relations crises?",
  'Operations & Project Management': "Are we trying to optimize internal workflows, map process waste, or sequence project tasks and milestones?",
  'Financial Management': "Are we evaluating financial health, pricing strategies, capital efficiency, or budgeting models?",
  'Problem Solving & Decision Making': "Are we trying to isolate the root cause of a complex system defect, or evaluate structured decision criteria?",
  'Innovation': "Is the goal to foster lateral thinking, navigate technology evolution curves, or drive disruptive continuous innovation?",
  'Organizational & Team Dynamics': "Are we evaluating human behavior, psychological profiles, team development stages, or leadership roles?"
};

const tagQuestions: Record<string, string> = {
  'Launch': "Are we preparing a commercial launch, market entry, or product introduction strategy?",
  'Product': "Are we specifically analyzing a physical or digital product's design, lifecycle, or features?",
  'Sales': "Is this challenge focused on the commercial sales pipeline, lead qualification, or pitch mechanics?",
  'Journey': "Are we mapping out the step-by-step experience or touchpoints of a user or customer over time?",
  'Advertising': "Are we establishing advertising copy, media budgets, or marketing communication goals?",
  'Segmentation': "Are we trying to partition a diverse market or audience into distinct, targetable segments?",
  'Positioning': "Are we seeking to define or defend a unique market positioning against competitors?",
  'Planning': "Is this primarily a structured planning cycle, roadmap, or timeline-based exercise?",
  'Communication': "Are we evaluating how information is transmitted, brand messages are delivered, or team feedback loops operate?",
  'Startup': "Is the target of this model a high-growth startup, minimum viable product (MVP), or lean venture?",
  'Lead': "Are we evaluating sales lead qualifications, client conversion rates, or prospect scoring?",
  'Timeline': "Is the visual representation or mapping of milestones over a chronological timeline critical?",
  'Crisis': "Are we managing or preparing for severe public relations, operational, or safety crises?",
  'Value': "Are we defining the core value proposition, customer gains, or cost efficiencies?",
  'Cost': "Are we trying to reduce process overhead, overhead allocation, or product costs?",
  'Goals': "Is this about setting corporate objectives, tracking OKRs, or mapping long-term targets?",
  'Prioritization': "Within this domain, are we looking to prioritize features, rank resources, or manage a task backlog?",
  'Brand': "Is our main focus establishing a cohesive brand identity, brand positioning, or brand equity?",
  'Customer': "Are we seeking to deeply empathize with customer needs, user personas, or target segment behaviors?",
  'Metrics': "Do you need to establish clear performance metrics, growth KPIs, or quantitative measurement targets?",
  'Growth': "Is the core objective accelerating business growth, technology adoption, or market scaling?",
  'Leadership': "Are we evaluating leadership styles, change management, or organizational culture dimensions?",
  'Risks': "Is the primary task assessing potential system failures, safety cases, or operational hazards?",
  'Process': "Are we trying to map, streamline, or eliminate waste from an operational process flow?",
  'Personality': "Is our focus evaluating individual personality traits, cognitive aptitudes, or psychometric indicators?",
  'Decision': "Are we choosing between multiple options or establishing a structured decision-making matrix?",
  'Agile': "Does this challenge involve Agile planning, sprint ceremonies, or team scrum roles?",
  'Quality': "Is the primary goal maximizing process quality, reducing defects, or continuous improvement cycles?",
  'Finance': "Are we evaluating capital assets, pricing, return on investment, or corporate financial health?",
  'Team': "Are we focusing on team dynamics, role accountability, or group development stages?",
  'Innovation': "Are we analyzing design thinking steps, technology lifecycles, or creative brainstorming patterns?",
  'Strategy': "Are we formulating a high-level competitive response, value discipline, or long-term plan?"
};

const visualTypeQuestions: Record<string, string> = {
  'Matrix': "From a workshop design perspective, would a 2x2 grid or quadrant-based matrix serve as the ideal canvas?",
  'Cycle': "For execution, should this be visualized as a recurring feedback loop or continuous cycle?",
  'Funnel': "Would a multi-stage linear funnel work best to represent the sequential conversion of candidates or leads?",
  'Sequential Steps': "Should we lay this out as a step-by-step linear roadmap or chronologically ordered steps?",
  'Flowchart': "Does this require an interactive flowchart, branching decision tree, or node-link structure?",
  'Concentric Circles': "Would a concentric circle or radar-like bullseye diagram help map different layers of priority?",
  'Pyramid': "Would a hierarchical pyramid or stacked structural triangle best show the foundational layers?",
  'Grid': "Would a structured multi-dimensional grid, table, or bento layout be the most effective way to present these parameters?"
};

/**
 * Calculates the best question to ask next from the remaining candidate list.
 * Follows a systematic consulting journey:
 * 1. System: Category of the business domain
 * 2. Purpose: Specific objectives/tags within that domain
 * 3. Type: Visual layout and complexity elements
 */
export function findBestQuestion(
  candidates: Framework[],
  askedKeys: Set<string>
): Question | null {
  if (candidates.length <= 1) {
    return null;
  }

  let bestQuestion: Question | null = null;
  let maxEntropy = -1;

  // Gather unique values from remaining candidates
  const categories = Array.from(new Set(candidates.map((c) => c.category)));
  const visualTypes = Array.from(new Set(candidates.map((c) => c.visualType)));
  const elementCounts = Array.from(new Set(candidates.map((c) => c.elementCount)));
  const tags = Array.from(new Set(candidates.flatMap((c) => c.context)));

  // Determine current active phase
  const unaskedCategories = categories.filter(cat => !askedKeys.has(`category:${cat}`));
  const hasUnaskedCategoryQuestions = unaskedCategories.length > 0;
  
  let activePhase: 'system' | 'purpose' | 'type' = 'system';
  
  if (categories.length > 1 && hasUnaskedCategoryQuestions) {
    activePhase = 'system';
  } else if (candidates.length > 5) {
    const unaskedTags = tags.filter(tag => !askedKeys.has(`tag:${tag}`));
    if (unaskedTags.length > 0) {
      activePhase = 'purpose';
    } else {
      activePhase = 'type';
    }
  } else {
    activePhase = 'type';
  }

  const questionCandidates: Question[] = [];

  if (activePhase === 'system') {
    for (const cat of categories) {
      const key = `category:${cat}`;
      if (!askedKeys.has(key)) {
        questionCandidates.push({
          type: 'category',
          value: cat,
          text: categoryQuestions[cat] || `Is your organization or focus area primarily related to ${cat}?`
        });
      }
    }
  } else if (activePhase === 'purpose') {
    for (const tag of tags) {
      const key = `tag:${tag}`;
      if (!askedKeys.has(key)) {
        questionCandidates.push({
          type: 'tag',
          value: tag,
          text: tagQuestions[tag] || `Is the strategic focus of this challenge centered around tracking, designing, or managing ${tag}?`
        });
      }
    }
  } else {
    // Phase 3: Type
    for (const vt of visualTypes) {
      const key = `visualType:${vt}`;
      if (!askedKeys.has(key)) {
        questionCandidates.push({
          type: 'visualType',
          value: vt,
          text: visualTypeQuestions[vt] || `Would representing this model visually as a ${vt} be most effective?`
        });
      }
    }
    for (const count of elementCounts) {
      const key = `elementCount:${count}`;
      if (!askedKeys.has(key)) {
        questionCandidates.push({
          type: 'elementCount',
          value: count,
          text: `In terms of complexity, does the methodology utilize exactly ${count} distinct steps, segments, or elements?`
        });
      }
    }
    // Include tag questions in Phase 3 as well to break ties and resolve identical-layout models
    for (const tag of tags) {
      const key = `tag:${tag}`;
      if (!askedKeys.has(key)) {
        questionCandidates.push({
          type: 'tag',
          value: tag,
          text: tagQuestions[tag] || `Is the strategic focus of this challenge centered around tracking, designing, or managing ${tag}?`
        });
      }
    }
  }

  // Fallback to preserve survivability if activePhase filtered everything out
  let finalQuestions = [...questionCandidates];
  if (finalQuestions.length === 0) {
    const allPossible: Question[] = [];
    for (const cat of categories) {
      const key = `category:${cat}`;
      if (!askedKeys.has(key)) {
        allPossible.push({
          type: 'category',
          value: cat,
          text: categoryQuestions[cat] || `Is your organization or focus area primarily related to ${cat}?`
        });
      }
    }
    for (const tag of tags) {
      const key = `tag:${tag}`;
      if (!askedKeys.has(key)) {
        allPossible.push({
          type: 'tag',
          value: tag,
          text: tagQuestions[tag] || `Is the strategic focus of this challenge centered around ${tag}?`
        });
      }
    }
    for (const vt of visualTypes) {
      const key = `visualType:${vt}`;
      if (!askedKeys.has(key)) {
        allPossible.push({
          type: 'visualType',
          value: vt,
          text: visualTypeQuestions[vt] || `Is the visual shape of the framework represented as a "${vt}"?`
        });
      }
    }
    for (const count of elementCounts) {
      const key = `elementCount:${count}`;
      if (!askedKeys.has(key)) {
        allPossible.push({
          type: 'elementCount',
          value: count,
          text: `Does the framework consist of exactly ${count} steps, segments, or elements?`
        });
      }
    }
    finalQuestions = allPossible;
  }

  // Calculate entropy for each question candidate and pick the best
  for (const q of finalQuestions) {
    let yesCount = 0;
    let noCount = 0;

    for (const c of candidates) {
      if (matchesQuestion(c, q)) {
        yesCount++;
      } else {
        noCount++;
      }
    }

    if (yesCount === 0 || noCount === 0) {
      continue;
    }

    const pYes = yesCount / candidates.length;
    const pNo = noCount / candidates.length;
    const entropy = -(pYes * Math.log2(pYes) + pNo * Math.log2(pNo));

    if (entropy > maxEntropy) {
      maxEntropy = entropy;
      bestQuestion = q;
    } else if (Math.abs(entropy - maxEntropy) < 0.0001 && bestQuestion) {
      // Prioritize: Category > VisualType > ElementCount > Tag to enforce systematic layout questions first in Phase 3
      const typeWeights: Record<string, number> = { category: 4, visualType: 3, elementCount: 2, tag: 1 };
      if ((typeWeights[q.type] || 0) > (typeWeights[bestQuestion.type] || 0)) {
        bestQuestion = q;
      }
    }
  }

  return bestQuestion;
}

/**
 * Helper to check if a framework matches a given question.
 */
export function matchesQuestion(c: Framework, q: Question): boolean {
  switch (q.type) {
    case 'category':
      return c.category === q.value;
    case 'visualType':
      return c.visualType === q.value;
    case 'elementCount':
      return c.elementCount === Number(q.value);
    case 'tag':
      return c.context.includes(q.value as string);
    default:
      return false;
  }
}

