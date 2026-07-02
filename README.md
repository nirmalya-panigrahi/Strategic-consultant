# Strategic Frameworks Compass 🧭

An interactive directory and **Akinator-style decision engine** for over 200+ standard business, marketing, strategy, operations, project management, finance, and psychometric evaluation frameworks.

## 🌟 Key Features

1. **Strategic Frameworks Consultant (Systematic Diagnostic)**:
   - Think of a framework or pick a suggested test target (e.g., SWOT Analysis, Agile & Scrum, Balanced Scorecard, CCAT).
   - Participate in a **systematic diagnostic interview** guided by a virtual management consultant.
   - **Structured Consulting Journey**: Questions are asked sequentially across three logical phases:
     1. **System & Domain**: Identifying the overall organizational department, corporate system, or business area (e.g., Strategic Planning, Product Development).
     2. **Operational Purpose**: Refining the focus based on concrete business objectives and challenges (e.g., Launch timelines, customer empathy, feature prioritization).
     3. **Visual Representation & Complexity**: Pinpointing the ideal workshop template shape (e.g., Matrices, Pyramids, Funnels) and structural elements.
   - Interactive features: **WIP reduction percentages**, **real-time candidate count**, and a full **Step Undo history**!
2. **Framework Directory (Full Catalog)**:
   - Search, filter, and sort all **215+ verified frameworks and psychometric tests**.
   - Filter dynamically by Category (Strategic Planning, Customer Relationship Management, Product Development, Innovation, Performance Measurement, Risk Assessment, Financial Management, Operations & Project Management, Problem Solving & Decision Making, Organizational & Team Dynamics) and Visual Shape (Matrix, Funnel, Pyramid, Grid, Cycle, Flowchart, Concentric Circles, Sequential Steps).
   - **Strategic Purpose Mapping**: Every single framework is tagged with a distinct, custom-tailored *Strategic Purpose* outlining exactly *why* a team or leader would choose to use that methodology.
   - **Goal-Oriented Full-Text Search**: Users can search by name, tag, core concept description, or action-oriented purpose keywords.
3. **Interactive Visual Previews**:
   - Every framework features a customized **pure-CSS visual schematic diagram** mapping its actual layout (e.g., rendering a real 2x2 grid for Matrices, a pyramid structure for Pyramids, custom flowcharts, radar charts, etc.).
4. **Digital Whiteboard Construction Guides**:
   - Each entry contains a step-by-step practical manual on how to design and facilitate a workshop using this framework on a digital canvas like Miro or Mural.

---

## 🛠️ The Engine: Phased Shannon Entropy Diagnostic

The consultant uses a mathematical search model refined by a structured, systematic journey to guarantee a highly intuitive flow while minimizing steps to isolate any item:

1. **Phase 1: Domain & System Identification**:
   - The consultant isolates the high-level business system or department (Category) to determine the baseline context.
2. **Phase 2: Operational Purpose & Objectives**:
   - The consultant asks targeted questions about your specific operational goals, challenges, and focus-area tags (e.g., Brand Identity, Prioritization, Growth, Agile).
3. **Phase 3: Visual Layout & Structural Complexity**:
   - The consultant confirms the structural shape and step count (Visual Type, Element Count) to finalize the exact recommendation.
4. **Shannon Entropy (Information Gain) Split**:
   - Within each active phase, the algorithm calculates split probabilities ($p_{yes}, p_{no}$) across available questions and picks the one that maximizes Shannon Entropy:
     $$H(Q) = - (p_{yes} \log_2(p_{yes}) + p_{no} \log_2(p_{no}))$$
   - This ensures questions split the candidates as close to 50/50 as possible, optimizing convergence.
5. **Robust Fallbacks & Don't Know Handling**:
   - If a participant clicks "Don't Know", the engine identifies the majority consensus and moves forward. In Phase 3, if visual criteria cannot fully split final candidates (e.g., dual 4-element matrices), it dynamically layers purpose-driven tags to break ties.

---

## 🧪 Automated Testing

We have built a custom automated integration test suite in `/src/test.ts` to verify the accuracy and integrity of both the database and the search engine. It simulates Akinator games for various target frameworks and ensures they are perfectly solvable.

To execute the test suite, run:
```bash
npx tsx src/test.ts
```

All 215 items have been validated and are fully distinguishable by the engine!

---

## 💻 Tech Stack & Setup

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Motion/Animations**: motion (motion/react)
- **Icons**: Lucide React
