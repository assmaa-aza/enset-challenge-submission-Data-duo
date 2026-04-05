// ── ProcrastiNO · Control Agent ──────────────────────────────────────────────
// Activates / lifts the distraction blocker overlay.

const ControlAgent = (() => {
  function activate() {
    document.getElementById("blocker").classList.add("show");
    window.S.blockAttempts++;
    if (typeof updateStat === "function")
      updateStat("stat-control", `Blocked: ${window.S.blockAttempts} attempt${window.S.blockAttempts > 1 ? "s" : ""}`, "stat-red");
    if (typeof setCardState === "function")
      setCardState("card-control", "alert", "badge-control", "ACTIVE", "badge-alert");
    document.getElementById("arch-control-status").textContent = "blocking active";
    if (typeof log === "function")
      log("control", `App block activated. ${window.S.blockAttempts} total block event(s).`);
  }

  function lift() {
    document.getElementById("blocker").classList.remove("show");
    if (typeof setCardState === "function")
      setCardState("card-control", "", "badge-control", "STANDBY", "badge-standby");
    document.getElementById("arch-control-status").textContent = "standby";
    if (typeof log === "function") log("control", "Block lifted.");
  }

  return { activate, lift };
})();
