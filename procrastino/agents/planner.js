// ── ProcrastiNO · Focus Planner Agent ────────────────────────────────────────
// Manages session/break durations and responds to plan changes.

const PlannerAgent = (() => {
  const config = {
    focusDur: 25,
    breakDur: 5,
    sessions: 0,
  };

  function applyPlan(planConfig) {
    config.focusDur  = planConfig.focusDur;
    config.breakDur  = planConfig.breakDur;
    config.sessions  = planConfig.sessions;
  }

  function getFocusDur() {
    // Shrink focus time if many distractions recorded
    return Math.max(15, config.focusDur - Math.min((window.S?.distractionCount || 0) * 2, 8));
  }

  function getBreakDur() {
    // Long break every 4 sessions
    return ((window.S?.sessionsCompleted || 0) > 0 && (window.S?.sessionsCompleted || 0) % 4 === 0)
      ? Math.max(config.breakDur, 15)
      : config.breakDur;
  }

  function getSessions()  { return config.sessions; }
  function getRawConfig() { return { ...config }; }

  return { applyPlan, getFocusDur, getBreakDur, getSessions, getRawConfig };
})();
