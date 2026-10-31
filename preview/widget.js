/* Preview chat widget (vanilla JS). Mirrors src/components/ChatWidget.tsx. */
(function () {
  var W = window.WSC, C = W.config, F = W.flow;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var el = function (tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  var fab = $("#chat-fab"), panel = $("#chat-panel"), log = $("#chat-log"), quick = $("#chat-quick"), form = $("#chat-form"), input = $("#chat-text");
  var state = { ctx: {}, flow: null, busy: false, service: null };
  var PAGE_ANCHOR = { home: "#top", services: "#services", portfolio: "#portfolio", about: "#about", contact: "#contact", privacy: "#privacy" };

  function scroll() { log.scrollTop = log.scrollHeight; }
  function setQuick(items, wrap) {
    quick.innerHTML = ""; quick.hidden = !items || !items.length; quick.classList.toggle("wrap-q", !!wrap);
    (items || []).forEach(function (q) { var b = el("button", null, q); b.type = "button"; b.onclick = function () { send(q); }; quick.appendChild(b); });
  }
  function waText() {
    if (state.flow && Object.keys(state.flow.data).length > 1) return F.enquiryAsText(state.flow.data);
    var s = W.SERVICES.find(function (x) { return x.slug === state.service; });
    return "Hello Wicliff, I found Wickie Stat Consultancy online" + (s ? " and I'm interested in " + s.name : "") + ". I'd like to discuss a project.";
  }
  function actionsEl(actions) {
    var box = el("div", "msg-actions");
    actions.forEach(function (a) {
      if (a.type === "start_enquiry") { var b = el("button", "primary", a.label); b.type = "button"; b.onclick = function () { if (!state.flow && !state.busy) begin(a.service); }; box.appendChild(b); }
      else if (a.type === "page") { var p = el("button", null, a.label + " →"); p.type = "button"; p.onclick = function () { location.hash = PAGE_ANCHOR[a.page] || "#top"; if (innerWidth < 520) minimise(true); }; box.appendChild(p); }
      else if (a.type === "whatsapp") { C.ACTIVE_WHATSAPP_LINES.forEach(function (l) { var w = el("a", "wa", a.label); w.href = C.whatsappLink(l, waText()); w.target = "_blank"; w.rel = "noopener noreferrer"; box.appendChild(w); }); }
      else if (a.type === "email") { var c = el("button", null, "Copy email address"); c.type = "button"; c.onclick = function () { copy(C.BUSINESS.email, c, "Email copied"); }; box.appendChild(c); }
    });
    return box;
  }
  function add(role, text, opts) {
    opts = opts || {};
    var m = el("div", "msg " + (role === "user" ? "user" : "bot") + (opts.tone ? " " + opts.tone : ""));
    m.appendChild(el("div", "bubble", text));
    if (opts.extra) m.appendChild(opts.extra);
    if (opts.actions && opts.actions.length) m.appendChild(actionsEl(opts.actions));
    log.appendChild(m); scroll(); return m;
  }
  function typing(on) {
    var t = $(".typing", log); if (t) t.remove();
    if (on) { t = el("div", "typing"); t.setAttribute("aria-label", "Assistant is typing"); t.innerHTML = "<i></i><i></i><i></i>"; log.appendChild(t); scroll(); }
  }
  function bot(text, opts, delay) {
    state.busy = true; typing(true); setQuick([]);
    return new Promise(function (res) { setTimeout(function () { typing(false); state.busy = false; var m = add("assistant", text, opts); res(m); }, delay == null ? 520 : delay); });
  }
  function copy(text, btn, done) {
    var old = btn.textContent;
    var ok = function () { btn.textContent = done; setTimeout(function () { btn.textContent = old; }, 1800); };
    try { navigator.clipboard.writeText(text).then(ok, function () { fallback(); }); } catch (e) { fallback(); }
    function fallback() { var ta = el("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) {} ta.remove(); }
  }

  // ── Enquiry flow ──
  function prompt() { var p = F.flowPrompt(state.flow); input.placeholder = p.placeholder || "Type your answer…"; input.setAttribute("inputmode", p.inputMode || "text"); return p; }
  function begin(service) {
    var s = service || (W.SERVICES.find(function (x) { return x.slug === state.service; }) || {}).name;
    state.flow = F.startFlow(s);
    var p = prompt();
    bot(p.text).then(function () { setQuick(p.quickReplies || []); input.focus(); });
  }
  function cancel() {
    state.flow = null; input.disabled = false; input.placeholder = "Type your message…";
    var r = $(".review-card", log); if (r) r.closest(".msg").remove();
    bot("No problem — I've cancelled that enquiry and discarded the details. Is there anything else I can help with?").then(function () { setQuick(W.QUICK_REPLIES); });
  }
  function review() {
    var d = state.flow.data, card = el("div", "review-card"), dl = el("dl");
    F.SUMMARY_FIELDS.forEach(function (f) { dl.appendChild(el("dt", null, f.label)); dl.appendChild(el("dd", null, d[f.key] || (f.key === "budget" ? "Not specified" : "—"))); });
    card.appendChild(dl);
    var lab = el("label", "check"), cb = el("input"); cb.type = "checkbox"; cb.id = "consent-" + Date.now();
    lab.appendChild(cb); var sp = el("span", null, F.CONSENT_TEXT.replace("Privacy notice.", "")); var a = el("a", null, "Privacy notice"); a.href = "#privacy"; sp.appendChild(a); sp.appendChild(document.createTextNode(".")); lab.appendChild(sp);
    card.appendChild(lab);
    var btns = el("div", "btns"), sub = el("button", "primary", "Continue"), over = el("button", null, "Start over"), can = el("button", null, "Cancel");
    [sub, over, can].forEach(function (b) { b.type = "button"; btns.appendChild(b); });
    sub.disabled = true; cb.onchange = function () { sub.disabled = !cb.checked; };
    sub.onclick = function () { card.closest(".msg").remove(); finish(); };
    over.onclick = function () { card.closest(".msg").remove(); begin(state.flow.data.service); };
    can.onclick = cancel;
    card.appendChild(btns);
    input.disabled = true;
    bot(F.flowPrompt(state.flow).text, { extra: card }, 350);
  }
  function finish() {
    // The preview has no server, so it never claims submission: it hands the visitor a pre-filled message to send themselves.
    var text = F.enquiryAsText(state.flow.data), box = el("div", "msg-actions");
    C.ACTIVE_WHATSAPP_LINES.forEach(function (l) { var w = el("a", "primary wa-solid", "Send on WhatsApp"); w.href = C.whatsappLink(l, text); w.target = "_blank"; w.rel = "noopener noreferrer"; box.appendChild(w); });
    var c = el("button", null, "Copy details"); c.type = "button"; c.onclick = function () { copy(text, c, "Copied"); }; box.appendChild(c);
    bot("This preview can't submit enquiries online, so your details have not been sent yet.\n\nTap “Send on WhatsApp” to open a message to Wicliff with everything filled in, or copy the details and email them to " + C.BUSINESS.email + ".", { extra: box }).then(function () {
      state.flow = null; input.disabled = false; input.placeholder = "Type your message…"; setQuick(["Explore Your Services", "Speak to Wicliff"]);
    });
  }
  function flowInput(text) {
    add("user", text);
    if (F.isCancel(text)) return cancel();
    var r = F.flowAnswer(state.flow, text);
    if (r.error) return bot(r.error, { tone: "error" }, 280).then(function () { setQuick(F.flowPrompt(state.flow).quickReplies || []); });
    state.flow = r.state;
    if (state.flow.step === "review") return review();
    var p = prompt();
    bot(p.text, null, 320).then(function () { setQuick(p.quickReplies || [], state.flow && state.flow.step === "service"); });
  }

  function send(raw) {
    var text = (raw || "").trim(); if (!text || state.busy) return;
    input.value = ""; autosize();
    if (state.flow && state.flow.step !== "review") return flowInput(text);
    if (state.flow) return;
    if (/^(request a quotation|get a quote)$/i.test(text)) { add("user", text); return begin(); }
    add("user", text);
    var out = W.demoReply(text, state.ctx); state.ctx = out.ctx;
    if (out.reply.service) state.service = out.reply.service;
    bot(out.reply.text, { actions: out.reply.actions }, 500 + Math.min(out.reply.text.length, 600)).then(function () {
      setQuick(out.reply.quickReplies && out.reply.quickReplies.length ? out.reply.quickReplies : W.QUICK_REPLIES);
    });
  }

  // ── Panel controls ──
  function open() { fab.hidden = true; panel.hidden = false; panel.classList.remove("closing", "minimised"); setTimeout(function () { input.focus(); }, 250); scroll(); }
  function close() { panel.classList.add("closing"); setTimeout(function () { panel.hidden = true; panel.classList.remove("closing"); fab.hidden = false; }, 190); }
  function minimise(force) { var m = force === true ? true : !panel.classList.contains("minimised"); panel.classList.toggle("minimised", m); $("#chat-min").setAttribute("aria-label", m ? "Restore chat" : "Minimise chat"); $("#chat-min").innerHTML = m ? ICON_RESTORE : ICON_MIN; $("#chat-max").hidden = m; }
  function maximise() { var on = panel.classList.toggle("maximised"); $("#chat-max").setAttribute("aria-label", on ? "Restore chat size" : "Maximise chat"); $("#chat-max").innerHTML = on ? ICON_RESTORE : ICON_MAX; }
  var ICON_MIN = $("#chat-min").innerHTML, ICON_MAX = $("#chat-max").innerHTML, ICON_RESTORE = $("#icon-restore").innerHTML;
  function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; }

  fab.onclick = open;
  $("#chat-close").onclick = close;
  $("#chat-min").onclick = minimise;
  $("#chat-max").onclick = maximise;
  $(".chat-head").ondblclick = function (e) { if (e.target.closest("button")) return; minimise(); };
  form.onsubmit = function (e) { e.preventDefault(); send(input.value); };
  input.oninput = autosize;
  input.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input.value); } };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !panel.hidden) close(); });
  document.querySelectorAll("[data-chat]").forEach(function (b) {
    b.addEventListener("click", function () {
      open();
      var msg = b.getAttribute("data-chat"), enq = b.getAttribute("data-enquiry");
      setTimeout(function () { if (enq !== null) { if (!state.flow && !state.busy) { add("user", "I'd like to make an enquiry" + (enq ? " about " + enq : "")); begin(enq || undefined); } } else if (msg) send(msg); }, 300);
    });
  });

  add("assistant", W.WELCOME_MESSAGE);
  setQuick(W.QUICK_REPLIES);
})();
