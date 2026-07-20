"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type NavigateOptions = {
  replace?: boolean;
};

type PageTransitionApi = {
  navigate: (href: string, options?: NavigateOptions) => void;
};

const PageTransitionContext = createContext<PageTransitionApi | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  const router = useRouter();

  return useMemo<PageTransitionApi>(
    () =>
      ctx ?? {
        navigate: (href, options) => {
          if (options?.replace) router.replace(href);
          else router.push(href);
        },
      },
    [ctx, router],
  );
}

function maxHole() {
  return Math.hypot(window.innerWidth, window.innerHeight) * 0.55;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resolveInternalHref(anchor: HTMLAnchorElement): string | null {
  if (anchor.target && anchor.target !== "_self") return null;
  if (anchor.hasAttribute("download")) return null;

  const raw = anchor.getAttribute("href");
  if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:")) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(raw, window.location.href);
  } catch {
    return null;
  }

  if (url.origin !== window.location.origin) return null;

  const next = `${url.pathname}${url.search}${url.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return null;

  // Hash-only change — leave to the browser
  if (
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    url.hash
  ) {
    return null;
  }

  return `${url.pathname}${url.search}${url.hash}`;
}

function pathKey(href: string) {
  const url = new URL(href, window.location.href);
  return `${url.pathname}${url.search}`;
}

export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const pendingKeyRef = useRef<string | null>(null);
  const pathWaitRef = useRef<(() => void) | null>(null);
  const firstPathRef = useRef(true);
  const searchRef = useRef(
    typeof window !== "undefined" ? window.location.search : "",
  );

  const waitForPath = useCallback((href: string) => {
    const key = pathKey(href);
    if (`${pathname}${searchRef.current}` === key) {
      return Promise.resolve();
    }

    pendingKeyRef.current = key;
    return new Promise<void>((resolve) => {
      const finish = () => {
        if (pathWaitRef.current !== finish) return;
        pathWaitRef.current = null;
        pendingKeyRef.current = null;
        resolve();
      };
      pathWaitRef.current = finish;
      window.setTimeout(finish, 2000);
    });
  }, [pathname]);

  useEffect(() => {
    searchRef.current = window.location.search;
    const key = `${pathname}${window.location.search}`;

    if (firstPathRef.current) {
      firstPathRef.current = false;
      return;
    }

    if (pendingKeyRef.current === key) {
      pathWaitRef.current?.();
    }
  }, [pathname]);

  const runTransition = useCallback(
    async (href: string, options?: NavigateOptions) => {
      if (busyRef.current) return;
      if (document.documentElement.classList.contains("is-site-loading")) {
        if (options?.replace) router.replace(href);
        else router.push(href);
        return;
      }

      if (prefersReducedMotion()) {
        if (options?.replace) router.replace(href);
        else router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        if (options?.replace) router.replace(href);
        else router.push(href);
        return;
      }

      busyRef.current = true;
      document.documentElement.classList.add("is-page-transitioning");

      const state = { reveal: maxHole() };
      overlay.classList.add("is-active");
      overlay.style.setProperty("--reveal", `${state.reveal}px`);

      try {
        await gsap.to(state, {
          reveal: 0,
          duration: 0.65,
          ease: "power3.inOut",
          onUpdate: () => {
            overlay.style.setProperty("--reveal", `${state.reveal}px`);
          },
        });

        if (options?.replace) router.replace(href);
        else router.push(href);

        window.__lenis?.scrollTo(0, { immediate: true });
        window.scrollTo(0, 0);

        await waitForPath(href);
        // Let the new route paint under the cover
        await new Promise<void>((r) => requestAnimationFrame(() => r()));

        state.reveal = 0;
        overlay.style.setProperty("--reveal", "0px");

        await gsap.to(state, {
          reveal: maxHole(),
          duration: 0.9,
          ease: "power3.inOut",
          onUpdate: () => {
            overlay.style.setProperty("--reveal", `${state.reveal}px`);
          },
        });
      } finally {
        overlay.classList.remove("is-active");
        overlay.style.setProperty("--reveal", "0px");
        document.documentElement.classList.remove("is-page-transitioning");
        busyRef.current = false;
        pendingKeyRef.current = null;
        pathWaitRef.current = null;
      }
    },
    [router, waitForPath],
  );

  const navigate = useCallback(
    (href: string, options?: NavigateOptions) => {
      void runTransition(href, options);
    },
    [runTransition],
  );

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = resolveInternalHref(anchor);
      if (!href) return;

      event.preventDefault();
      void runTransition(href);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [runTransition]);

  // Browser back / forward: open from center over the new page
  useEffect(() => {
    const onPopState = () => {
      if (busyRef.current || prefersReducedMotion()) return;
      if (document.documentElement.classList.contains("is-site-loading")) return;

      const overlay = overlayRef.current;
      if (!overlay) return;

      busyRef.current = true;
      document.documentElement.classList.add("is-page-transitioning");

      const state = { reveal: 0 };
      overlay.classList.add("is-active");
      overlay.style.setProperty("--reveal", "0px");

      void gsap
        .to(state, {
          reveal: maxHole(),
          duration: 0.85,
          ease: "power3.inOut",
          onUpdate: () => {
            overlay.style.setProperty("--reveal", `${state.reveal}px`);
          },
        })
        .then(() => {
          overlay.classList.remove("is-active");
          overlay.style.setProperty("--reveal", "0px");
          document.documentElement.classList.remove("is-page-transitioning");
          busyRef.current = false;
        });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const api = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext.Provider value={api}>
      {children}
      <div
        ref={overlayRef}
        className="page-transition circle-reveal-mask"
        aria-hidden
      />
    </PageTransitionContext.Provider>
  );
}
