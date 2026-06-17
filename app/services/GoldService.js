// =======================================================
// GOLD SERVICE — the parent-gated manual gold editor.
// Gold is earned automatically (beating a personal best), but a parent also
// adjusts it by hand when it's spent or awarded in real life.
//
// Editing happens in an inline panel in the Records tab (not browser prompts):
// an amount field + a MASKED password field, so a kid looking over your
// shoulder can't read the password. The gate only exists to stop the kid from
// quietly editing their own balance — it isn't real security.
// =======================================================
import { PARENT_PASSWORD } from "../data/config.js";
import { $ } from "../ui/screens.js";

export class GoldService {
  constructor(state) {
    this.state = state;
    this.mode = null;                 // "add" | "remove" while the editor is open
    this.onChange = function () {};   // set by main: re-render the gold displays
  }

  get balance() {
    return this.state.gold;
  }

  // Reveal the inline editor for the given mode and reset its fields.
  open(mode) {
    this.mode = mode;
    $("gold-editor-title").textContent = mode === "add" ? "Add Gold" : "Remove Gold";
    $("gold-amount").value = "";
    $("gold-pass").value = "";
    this.message("");
    $("gold-editor").classList.add("show");
    $("gold-amount").focus();
  }

  // Hide and reset the editor.
  cancel() {
    this.mode = null;
    $("gold-amount").value = "";
    $("gold-pass").value = "";
    this.message("");
    $("gold-editor").classList.remove("show");
  }

  // Inline feedback (validation errors). `ok` flips it to the success colour.
  message(text, ok) {
    const el = $("gold-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "gold-editor-msg" + (text ? (ok ? " ok" : " err") : "");
  }

  // Validate amount + password, then apply the change.
  apply() {
    if (!this.mode) return;

    const n = Math.floor(Number($("gold-amount").value));
    if (!Number.isFinite(n) || n <= 0) {
      this.message("Enter a whole number greater than 0.");
      $("gold-amount").focus();
      return;
    }
    if ($("gold-pass").value.trim().toLowerCase() !== PARENT_PASSWORD) {
      this.message("Wrong password.");
      $("gold-pass").value = "";
      $("gold-pass").focus();
      return;
    }

    if (this.mode === "add") this.state.addGold(n);
    else this.state.spendGold(n);

    this.cancel();
    this.onChange();
  }
}
