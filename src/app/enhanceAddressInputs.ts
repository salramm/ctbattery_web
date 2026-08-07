import { API_BASE } from "@/lib/api";

type Suggestion = { label: string; lat: number; lng: number };

/**
 * Progressive enhancement for the landing's static address forms: attaches a
 * debounced suggestions dropdown (backend /api/lookup/suggest, Photon/CT) to
 * every `.ctbs-addr-input`. Picking a suggestion fills the input and injects
 * hidden lat/lng fields so the GET submit to /get-started carries coordinates.
 * The forms work without this (freeform → Census geocode on submit).
 */
export function enhanceAddressInputs(root: HTMLElement): () => void {
  const inputs = Array.from(root.querySelectorAll<HTMLInputElement>(".ctbs-addr-input"));
  const cleanups: Array<() => void> = [];

  inputs.forEach((input) => {
    const wrap = input.closest<HTMLElement>(".ctbs-addr-wrap");
    if (!wrap) return;
    const form = input.form;

    const list = document.createElement("ul");
    Object.assign(list.style, {
      position: "absolute",
      top: "calc(100% + 4px)",
      left: "0",
      right: "0",
      zIndex: "10050",
      margin: "0",
      padding: "4px",
      listStyle: "none",
      background: "#fff",
      border: "1px solid #d8d6ce",
      borderRadius: "8px",
      boxShadow: "0 12px 32px rgba(26,26,24,.16)",
      maxHeight: "260px",
      overflowY: "auto",
      display: "none",
    } as CSSStyleDeclaration);
    wrap.appendChild(list);

    let items: Suggestion[] = [];
    let active = -1;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const clearCoords = () =>
      form?.querySelectorAll("input[data-coord]").forEach((n) => n.remove());
    const setCoords = (lat: number, lng: number) => {
      clearCoords();
      if (!form) return;
      ([["lat", lat], ["lng", lng]] as const).forEach(([name, val]) => {
        const h = document.createElement("input");
        h.type = "hidden";
        h.name = name;
        h.value = String(val);
        h.setAttribute("data-coord", "1");
        form.appendChild(h);
      });
    };

    const hide = () => {
      list.style.display = "none";
      active = -1;
    };

    const render = () => {
      list.innerHTML = "";
      items.forEach((s, i) => {
        const li = document.createElement("li");
        li.textContent = s.label;
        Object.assign(li.style, {
          padding: "9px 12px",
          fontSize: "14.5px",
          color: "#1a1a1a",
          cursor: "pointer",
          borderRadius: "5px",
          background: i === active ? "#eef3f1" : "#fff",
        } as CSSStyleDeclaration);
        li.addEventListener("mousedown", (e) => {
          e.preventDefault();
          input.value = s.label;
          setCoords(s.lat, s.lng);
          hide();
        });
        li.addEventListener("mouseenter", () => {
          active = i;
          render();
        });
        list.appendChild(li);
      });
      list.style.display = items.length ? "block" : "none";
    };

    const onInput = () => {
      clearCoords(); // typing invalidates a previously picked suggestion's coords
      const q = input.value.trim();
      if (timer) clearTimeout(timer);
      if (q.length < 3) {
        items = [];
        hide();
        return;
      }
      timer = setTimeout(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/lookup/suggest?q=${encodeURIComponent(q)}`);
          const json = await res.json();
          items = json?.data?.suggestions ?? [];
          active = -1;
          render();
        } catch {
          /* freeform submit still works */
        }
      }, 250);
    };

    const onKey = (e: KeyboardEvent) => {
      if (list.style.display === "none" || items.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(active + 1, items.length - 1);
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      } else if (e.key === "Enter") {
        if (active >= 0) {
          e.preventDefault();
          const s = items[active];
          input.value = s.label;
          setCoords(s.lat, s.lng);
          hide();
        }
      } else if (e.key === "Escape") {
        hide();
      }
    };

    const onDoc = (e: MouseEvent) => {
      if (!wrap.contains(e.target as Node)) hide();
    };

    input.addEventListener("input", onInput);
    input.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDoc);
    cleanups.push(() => {
      input.removeEventListener("input", onInput);
      input.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDoc);
      list.remove();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
