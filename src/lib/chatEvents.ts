/** Open the chat widget from anywhere (optionally with a message or an enquiry). */
export function openChat(detail?: { message?: string; enquiry?: string }) {
  window.dispatchEvent(new CustomEvent("wsc:open-chat", { detail }));
}
