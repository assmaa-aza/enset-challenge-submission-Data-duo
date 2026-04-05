// ── ProcrastiNO · Motivation Agent ───────────────────────────────────────────
// Sends contextual encouraging messages during and between sessions.

const MotivationAgent = (() => {
  const messages = {
    start:            ["Session started! Block out the noise — every minute counts.", "Let's go! Focus mode is ON.", "Starting strong. Deep work beats multitasking."],
    distracted:       ["Lost focus? Take a breath and come back.", "Distraction happens — returning fast is what matters.", "5 seconds. Breathe. Refocus."],
    session_complete: ["Session done! You earned that break.", "Another one in the books. Rest up.", "Focus session complete — great momentum!"],
    break_over:       ["Break's up. Back in the zone.", "Recharged? Let's make this next session count.", "Ready to go again!"],
    break_request:    ["Break granted. Step away, come back fresh.", "Rest is part of the process.", "Smart move taking a break."],
    behind:           ["You're behind — but two solid sessions fixes that.", "Don't stress the schedule. Stress the next 25 minutes.", "Adjust and keep moving."],
    inactivity:       ["Still there? Your session is waiting.", "Noticed some inactivity — ready to re-engage?", "Jump back in when you're ready."],
    plan_confirmed:   ["Plan locked in — let's crush it! 🚀", "Perfect. Your customized schedule is ready.", "Love the focus. Starting your personalized session now!"],
  };

  function send(trigger) {
    const opts = messages[trigger] || messages.start;
    const msg = opts[Math.floor(Math.random() * opts.length)];
    window.S.msgCount++;
    if (typeof log === "function") log("motivation", msg);
    if (typeof updateStat === "function")
      updateStat("stat-motivation", `${window.S.msgCount} message${window.S.msgCount > 1 ? "s" : ""} sent`, "stat-green");
    return msg;
  }

  return { send };
})();
