import { invoke } from "@tauri-apps/api/core";

function isTauri(): boolean {
  return "__TAURI_INTERNALS__" in window;
}

/**
 * Shows a native OS notification.
 *
 * Inside the Tauri app this calls the Rust `show_notification` command, which
 * sets the `desktop-entry` hint and keeps the D-Bus connection alive - GNOME
 * deletes app-attributed notifications as soon as the sender disconnects, so
 * going through the JS plugin (one-shot connection) made them vanish before
 * rendering. In a plain browser (`npm run dev` without Tauri) it falls back
 * to the Web Notification API.
 */
export async function showNotification(title: string, body: string, _icon?: string): Promise<void> {
  if (isTauri()) {
    try {
      await invoke<string>("show_notification", { title, body });
    } catch (error) {
      console.error("[notification] failed:", error);
    }
    return;
  }

  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}
