// =======================================================
// PARENT CONSOLE — a small `window.keeper` helper for managing gold from the
// browser's developer console. This is how a parent runs the real-life economy:
// the keeper earns gold by beating records in the app, and you deduct it here
// when they spend it (screen time, a treat, whatever you've agreed on).
//
//   keeper.gold        → see the current balance
//   keeper.spend(5)    → deduct 5 gold (what they just spent)
//   keeper.add(3)      → add 3 gold by hand (a manual bonus / fix)
//   keeper.reset()     → set gold back to 0
//   keeper.help()      → print this list
// =======================================================

export function installConsole(state, refresh) {
  const keeper = {
    get gold() {
      return state.gold;
    },

    add(amount = 1) {
      const balance = state.addGold(amount);
      refresh();
      return `Added ${amount}. Gold is now ${balance}.`;
    },

    spend(amount = 1) {
      const balance = state.spendGold(amount);
      refresh();
      return `Spent ${amount}. Gold is now ${balance}.`;
    },

    reset() {
      const balance = state.resetGold();
      refresh();
      return `Gold reset. Gold is now ${balance}.`;
    },

    help() {
      console.log([
        "%cKeeper Quest — parent gold console (window.keeper)", "font-weight:bold;color:#caa030",
        "\n  keeper.gold       see the current balance",
        "  keeper.spend(n)   deduct n gold when it's spent in real life",
        "  keeper.add(n)     add n gold by hand",
        "  keeper.reset()    set gold back to 0",
        "\n  Gold is earned automatically each time a record is beaten.",
      ].join("\n"));
      return "see console ↑";
    },
  };

  window.keeper = keeper;
  try {
    console.log("%cKeeper Quest loaded — type keeper.help() to manage gold", "color:#caa030");
  } catch (e) { /* console unavailable */ }
}
