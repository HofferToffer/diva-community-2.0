import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, type ReactNode, type PointerEvent, type WheelEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Circle, HeartPulse, History, Home, LogOut, Menu, PenLine, Plus, RefreshCcw, Search, ShieldCheck, Trophy, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useCommunityAuth } from "../context/CommunityAuthProvider";
import { useIsAdmin, useNotifications } from "../hooks/queries";
import { ProfileAvatar } from "./StoredImage";
import { getLifePhase, PHASE_LABEL } from "../lib/quotes";


const NAV = [
  { to: "/community", label: "Domov", icon: Home, end: true },
  { to: "/community/pocit", label: "Ako sa dnes cítim?", icon: HeartPulse, end: false },
  { to: "/community/cyklus", label: "Môj cyklus", icon: RefreshCcw, end: false },
  { to: "/community/challenges", label: "Výzvy", icon: Trophy, end: false },
  { to: "/community/pridat", label: "Pridať aktivitu", icon: Plus, end: false },
  { to: "/community/divy", label: "Divy", icon: Search, end: false },
  { to: "/community/diva-kruh", label: "DIVA KRUH", icon: Circle, end: false },
];


export function CommunityShell({ children }: { children: ReactNode }) {
  const { profile, signOut } = useCommunityAuth();
  const { data: notifications } = useNotifications(profile?.id);
  const { data: isAdmin } = useIsAdmin();
  const chapterLabel = PHASE_LABEL[getLifePhase(profile)];
  const baseNav = NAV.map((item) => (item.to === "/community/cyklus" ? { ...item, label: chapterLabel } : item));
  const nav = isAdmin
    ? [...baseNav, { to: "/community/admin", label: "Admin", icon: ShieldCheck, end: false }]
    : baseNav;
  const unread = notifications?.filter((n) => !n.read_at).length ?? 0;
  const location = useLocation();
  const navigate = useNavigate();
  const [pocitMenuOpen, setPocitMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isPocitActive = location.pathname.startsWith("/community/pocit");

  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile?.id) return;
    const channel = supabase
      .channel(`notifications-${profile.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `profile_id=eq.${profile.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["community-notifications", profile.id] });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);


  const dragStartY = useRef<number | null>(null);
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const wheelAccum = useRef(0);
  const [swipeX, setSwipeX] = useState(0);
  const canSwipeBack = location.pathname !== "/community";

  // Own in-app navigation stack, so swipe-back always steps to the actual
  // previous screen — not the browser's history.back() (unreliable in some
  // webviews) and not always Domov.
  const navStack = useRef<string[]>([location.pathname]);
  useEffect(() => {
    const stack = navStack.current;
    const top = stack[stack.length - 1];
    if (top === location.pathname) return;
    if (stack.length > 1 && stack[stack.length - 2] === location.pathname) {
      stack.pop(); // we navigated back to the previous entry
    } else {
      stack.push(location.pathname);
    }
  }, [location.pathname]);

  const goBack = () => {
    const stack = navStack.current;
    if (stack.length > 1) {
      stack.pop();
      navigate(stack[stack.length - 1]);
    } else {
      navigate("/community");
    }
  };

  const triggerRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setPull(0);
    try {
      await queryClient.invalidateQueries();
    } finally {
      setRefreshing(false);
    }
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    if (window.scrollY <= 0) dragStartY.current = e.clientY;
  };


  const onPointerMove = (e: PointerEvent) => {
    if (dragStartY.current === null || refreshing) return;
    if (e.buttons === 0 && e.pointerType === "mouse") {
      dragStartY.current = null;
      setPull(0);
      return;
    }
    if (window.scrollY > 0) {
      dragStartY.current = null;
      setPull(0);
      return;
    }
    const delta = e.clientY - dragStartY.current;
    setPull(delta > 0 ? Math.min(delta / 2, 90) : 0);
  };

  const onPointerEnd = () => {
    const shouldRefresh = pull >= 70;
    dragStartY.current = null;
    setPull(0);
    if (shouldRefresh) void triggerRefresh();
  };

  const onWheel = (e: WheelEvent) => {
    if (refreshing) return;
    if (window.scrollY <= 0 && e.deltaY < 0) {
      wheelAccum.current += -e.deltaY;
      if (wheelAccum.current >= 120) {
        wheelAccum.current = 0;
        void triggerRefresh();
      }
    } else {
      wheelAccum.current = 0;
    }
  };

  // Native touch listeners (pointer events get cancelled by browser overscroll on mobile)
  useEffect(() => {
    let startY: number | null = null;
    let startX: number | null = null;
    let axis: "x" | "y" | null = null;

    const onTouchStart = (e: TouchEvent) => {
      startY = window.scrollY <= 0 ? e.touches[0].clientY : null;
      startX = e.touches[0].clientX;
      axis = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (refreshing || startX === null) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX;
      const dy = startY !== null ? touch.clientY - startY : 0;

      // Swipe right from anywhere on screen goes back, like Instagram —
      // not just from a thin edge strip.
      if (axis === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (axis === "x") {
        if (!canSwipeBack || dx <= 0) return;
        if (e.cancelable) e.preventDefault();
        setSwipeX(Math.min(dx, 120));
      } else if (axis === "y") {
        if (startY === null) return;
        if (window.scrollY > 0) {
          startY = null;
          setPull(0);
          return;
        }
        if (dy > 0) {
          if (e.cancelable) e.preventDefault();
          setPull(Math.min(dy / 2, 90));
        }
      }
    };

    const onTouchEnd = () => {
      if (axis === "x") {
        setSwipeX((current) => {
          if (current >= 80) goBack();
          return 0;
        });
      } else if (startY !== null) {
        setPull((current) => {
          if (current >= 70) void triggerRefresh();
          return 0;
        });
      }
      startY = null;
      startX = null;
      axis = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [refreshing, canSwipeBack, navigate, goBack]);


  return (
    <div
      className="min-h-screen bg-background pt-16"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onWheel={onWheel}
    >
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="relative mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="DIVA Community web">
              <Home className="h-5 w-5 text-foreground" aria-hidden="true" />
              <span className="font-heading text-sm uppercase tracking-[0.2em] text-foreground">Diva</span>
            </Link>
          </div>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center justify-center gap-1 lg:flex" aria-label="Community">
            {nav.map((item) =>
              item.to === "/community/pocit" ? (
                <DropdownMenu key={item.to} open={pocitMenuOpen} onOpenChange={setPocitMenuOpen}>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors outline-none",
                      location.pathname.startsWith(item.to)
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", pocitMenuOpen && "rotate-180")} aria-hidden="true" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem asChild onClick={() => setPocitMenuOpen(false)}>
                      <Link to="/community/pocit" className="cursor-pointer">Zapísať dnešný pocit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild onClick={() => setPocitMenuOpen(false)}>
                      <Link to="/community/pocit/historia" className="cursor-pointer">História môjho prežívania</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "shrink-0 whitespace-nowrap rounded-md px-2 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors",
                      isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>
          <div className="flex items-center justify-end gap-1">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Menu"
                  className="flex rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[260px]">
                <SheetHeader>
                  <SheetTitle className="text-left font-heading">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-8 flex flex-col gap-2" aria-label="Community menu">
                  {nav.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  >
                  {item.to === "/community/pocit" ? (
                      <div className="flex flex-col gap-1">
                        <span
                          className={cn(
                            "flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-3 text-sm uppercase tracking-[0.12em] transition-colors",
                            isPocitActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {item.label}
                        </span>
                        <SheetClose asChild>
                          <Link
                            to="/community/pocit"
                            className={cn(
                              "ml-3 flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                              location.pathname === "/community/pocit"
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <PenLine className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Zapísať dnešný pocit
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            to="/community/pocit/historia"
                            className={cn(
                              "ml-3 flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                              location.pathname === "/community/pocit/historia"
                                ? "bg-secondary text-secondary-foreground"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <History className="h-4 w-4 shrink-0" aria-hidden="true" />
                            História môjho prežívania
                          </Link>
                        </SheetClose>
                      </div>
                    ) : (
                      <SheetClose asChild>
                        <Link
                          to={item.to}
                          onClick={() => setSheetOpen(false)}
                          className={cn(
                            "flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-3 text-sm uppercase tracking-[0.12em] transition-colors",
                            (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to))
                              ? "bg-secondary text-secondary-foreground"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    )}
                  </motion.div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link
              to="/community/notifikacie"
              aria-label={unread > 0 ? `Notifikácie (${unread} nových)` : "Notifikácie"}
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span
                  className="absolute right-1 top-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: "hsl(var(--shop))" }}
                />
              )}
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Účet" className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <ProfileAvatar path={profile?.avatar_url} name={profile?.name ?? "Diva"} size={32} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/community/profil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" aria-hidden="true" />
                    Môj profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void signOut()} className="cursor-pointer text-primary focus:text-primary">
                  <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Odhlásiť sa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {(pull > 0 || refreshing) && (
        <div
          className="pointer-events-none fixed left-1/2 top-20 z-30 flex -translate-x-1/2 items-center justify-center rounded-full border border-border bg-card p-2 shadow-sm transition-opacity"
          style={{ opacity: refreshing ? 1 : Math.min(pull / 70, 1) }}
          aria-hidden="true"
        >
          <RefreshCcw
            className={cn("h-4 w-4 text-muted-foreground", refreshing && "animate-spin")}
            style={!refreshing ? { transform: `rotate(${pull * 2}deg)` } : undefined}
          />
        </div>
      )}

      <main
        key={location.pathname}
        className={cn("mx-auto max-w-2xl px-4 py-6", swipeX === 0 && "transition-transform duration-200")}
        style={swipeX ? { transform: `translateX(${swipeX}px)` } : undefined}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>

    </div>
  );
}
