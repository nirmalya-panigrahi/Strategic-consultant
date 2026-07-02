import { frameworks } from './data/frameworks';
import { findBestQuestion, matchesQuestion } from './utils/entropy';
import { Framework } from './types';

function runTestSuite() {
  console.log("=========================================");
  console.log("   RUNNING FRAMEWORKS COMPASS TEST SUITE  ");
  console.log("=========================================");

  let passed = true;

  // Test 1: Data Integrity & Size
  const size = frameworks.length;
  console.log(`Test 1: Frameworks database size check: ${size} items`);
  if (size >= 200) {
    console.log("✅ PASS: Database contains 200+ frameworks.");
  } else {
    console.error(`❌ FAIL: Database has only ${size} items, expected >= 200.`);
    passed = false;
  }

  // Test 2: Shannon Entropy Divergence & Solvability
  console.log("\nTest 2: Simulation of search algorithm for sample targets...");
  const sampleTargets = [
    "SWOT Analysis",
    "The 4 Ps of Marketing",
    "Keller's Brand Equity Model (CBBE)",
    "Fink's Crisis Lifecycle Model",
    "Hoshin Kanri (X-Matrix)",
    "Agile & Scrum",
    "Criteria Cognitive Aptitude Test (CCAT)",
    "MBTI (Myers-Briggs Type Indicator)"
  ];

  for (const name of sampleTargets) {
    const target = frameworks.find(f => f.name === name);
    if (!target) {
      console.error(`❌ FAIL: Target '${name}' not found in database.`);
      passed = false;
      continue;
    }

    const result = simulateSearch(target);
    if (result.success) {
      console.log(`✅ PASS: Found '${name}' in ${result.questionsCount} questions.`);
    } else {
      console.error(`❌ FAIL: Could not isolate '${name}'. Remaining:`, result.remainingNames);
      passed = false;
    }
  }

  // Test 3: Uniqueness & Identical twins check
  console.log("\nTest 3: Checking for duplicate descriptions or identical framework entries...");
  const duplicates = frameworks.filter((f1, index) => 
    frameworks.findIndex(f2 => f2.name === f1.name) !== index
  );
  if (duplicates.length === 0) {
    console.log("✅ PASS: No duplicate framework names found.");
  } else {
    console.error("❌ FAIL: Duplicate framework names found:", duplicates.map(d => d.name));
    passed = false;
  }

  console.log("\n=========================================");
  if (passed) {
    console.log("🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉");
    console.log("=========================================");
    process.exit(0);
  } else {
    console.error("🚨 TEST SUITE ENCOUNTERED FAILURES 🚨");
    console.log("=========================================");
    process.exit(1);
  }
}

interface SimulationResult {
  success: boolean;
  questionsCount: number;
  remainingNames: string[];
}

function simulateSearch(target: Framework): SimulationResult {
  let candidates = [...frameworks];
  const askedKeys = new Set<string>();
  let steps = 0;
  const maxSteps = 30; // Safety threshold

  while (candidates.length > 1 && steps < maxSteps) {
    const q = findBestQuestion(candidates, askedKeys);
    if (!q) {
      break;
    }

    const key = `${q.type}:${q.value}`;
    askedKeys.add(key);

    const match = matchesQuestion(target, q);
    if (match) {
      // Answered Yes
      candidates = candidates.filter(c => matchesQuestion(c, q));
    } else {
      // Answered No
      candidates = candidates.filter(c => !matchesQuestion(c, q));
    }

    steps++;
  }

  return {
    success: candidates.length === 1 && candidates[0].id === target.id,
    questionsCount: steps,
    remainingNames: candidates.map(c => c.name)
  };
}

// Execute the tests
runTestSuite();
