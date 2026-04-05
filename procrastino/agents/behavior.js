// ── ProcrastiNO · Behavior Analyzer Agent ────────────────────────────────────
// Handles two modes:
//   1. ONBOARDING — interactive conversation to extract a personalized plan
//   2. RUNTIME    — classifies user messages during a session

const BehaviorAgent = (() => {
  // ── Onboarding state ────────────────────────────────────────────────────────
  const onboarding = {
    step: 0,
    data: {
      totalMinutes: null,
      workMinutes: null,
      taskType: null,
      energyLevel: null,
    },

    // Conversation script — each entry may have a `parse` fn to extract data
    script: [
      {
        ask: () => "Hey! 👋 I'm your Behavior Analyzer. Before we start, tell me — how much total time do you have available right now? (e.g. \"3 hours\", \"90 minutes\")",
        parse(text, data) {
          const hours = text.match(/(\d+(?:\.\d+)?)\s*h/i);
          const mins  = text.match(/(\d+)\s*m/i);
          let total = 0;
          if (hours) total += Math.round(parseFloat(hours[1]) * 60);
          if (mins)  total += parseInt(mins[1]);
          if (!total) {
            // try bare number — assume minutes if ≤ 10, hours otherwise
            const bare = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
            if (bare) total = parseFloat(bare[1]) <= 10 ? Math.round(parseFloat(bare[1]) * 60) : parseInt(bare[1]);
          }
          if (total > 0) { data.totalMinutes = total; return true; }
          return false;
        },
        retry: "I didn't catch that — try something like \"2 hours\" or \"90 minutes\".",
      },
      {
        ask: (data) => `Got it — ${data.totalMinutes} minutes total. How much of that do you actually want to work? (e.g. "I need to work for 2 hours", "all of it", "45 minutes")`,
        parse(text, data) {
          const lower = text.toLowerCase();
          if (lower.includes("all") || lower.includes("whole") || lower.includes("entire")) {
            data.workMinutes = data.totalMinutes; return true;
          }
          const hours = text.match(/(\d+(?:\.\d+)?)\s*h/i);
          const mins  = text.match(/(\d+)\s*m/i);
          let work = 0;
          if (hours) work += Math.round(parseFloat(hours[1]) * 60);
          if (mins)  work += parseInt(mins[1]);
          if (!work) {
            const bare = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
            if (bare) work = parseFloat(bare[1]) <= 10 ? Math.round(parseFloat(bare[1]) * 60) : parseInt(bare[1]);
          }
          if (work > 0 && work <= data.totalMinutes) { data.workMinutes = work; return true; }
          if (work > data.totalMinutes) {
            data.workMinutes = data.totalMinutes; return true;
          }
          return false;
        },
        retry: "Hmm, I couldn't figure that out. Try \"2 hours\" or \"45 minutes\".",
      },
      {
        ask: () => "What kind of work is it? (e.g. \"coding\", \"studying\", \"writing\", \"design\", \"reading\")",
        parse(text, data) {
          const t = text.trim();
          if (t.length > 1) { data.taskType = t; return true; }
          return false;
        },
        retry: "Just a word or two — like \"coding\" or \"math homework\".",
      },
      {
        ask: () => "Last one: how's your energy right now? 🔋 (\"high\", \"medium\", or \"low\")",
        parse(text, data) {
          const t = text.toLowerCase();
          if (t.includes("high") || t.includes("great") || t.includes("good") || t.includes("full")) {
            data.energyLevel = "high"; return true;
          }
          if (t.includes("low") || t.includes("tired") || t.includes("exhaust") || t.includes("bad")) {
            data.energyLevel = "low"; return true;
          }
          data.energyLevel = "medium"; return true;
        },
        retry: "Just say high, medium, or low!",
      },
    ],

    // Build a human-readable plan summary + computed session config
    buildPlan(data) {
      const { totalMinutes, workMinutes, taskType, energyLevel } = data;

      // Decide focus / break lengths based on energy & task
      let focusDur, breakDur;
      if (energyLevel === "high") {
        focusDur = 45; breakDur = 10;
      } else if (energyLevel === "low") {
        focusDur = 20; breakDur = 8;
      } else {
        focusDur = 30; breakDur = 7;
      }

      // Clamp so we don't exceed workMinutes per cycle
      const cycleLen = focusDur + breakDur;
      const sessions = Math.max(1, Math.floor(workMinutes / cycleLen));
      const freeMins = totalMinutes - workMinutes;

      const lines = [
        `✅ Here's your personalized plan for ${taskType}:`,
        ``,
        `⏱  Focus block  : ${focusDur} min`,
        `☕  Break        : ${breakDur} min`,
        `🔁  Sessions     : ${sessions} (${sessions * focusDur} min total work)`,
        `🆓  Free time    : ${freeMins} min`,
        ``,
        `Energy is ${energyLevel} → I've tuned block length accordingly.`,
        ``,
        `Does this look good? Type "yes" or tell me what to change!`,
      ];

      return {
        summary: lines.join("\n"),
        config: { focusDur, breakDur, sessions, workMinutes, totalMinutes, taskType, energyLevel },
      };
    },
  };

  // ── Runtime classifier ───────────────────────────────────────────────────────
  function classify(text) {
    const t = text.toLowerCase();
    if (["distract","can't focus","lost focus","wandering","social media","phone","daydream"].some(k => t.includes(k)))
      return { state: "distracted", confidence: 0.88 };
    if (["break","tired","rest","overwhelm","need a minute","step away","exhausted"].some(k => t.includes(k)))
      return { state: "break_request", confidence: 0.90 };
    if (["behind","schedule","late","not enough time","falling behind","worried about time"].some(k => t.includes(k)))
      return { state: "behind", confidence: 0.85 };
    if (["focused","on track","going well","productive","in the zone"].some(k => t.includes(k)))
      return { state: "focused", confidence: 0.92 };
    return { state: "neutral", confidence: 0.70 };
  }

  // ── Public API ────────────────────────────────────────────────────────────────
  return { onboarding, classify };
})();
