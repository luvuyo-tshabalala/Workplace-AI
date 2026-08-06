import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, PanelLeftClose, PanelLeftOpen, Bot } from "lucide-react";
import { useState } from "react";
import { TOOLS } from "@/lib/tools";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    { path: "/", name: "Dashboard", short: "Home", icon: LayoutDashboard },
    ...TOOLS,
  ];

  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-300 md:flex",
        collapsed ? "w-[74px]" : "w-[264px]",
      )}
    >
      <div className="flex h-16 items-center gap-3 px-4">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        >
          <Bot className="size-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Workplace AI</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Productivity suite</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {items.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.name}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-sidebar-primary" />
              )}
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => setCollapsed((c) => !c)}
        className="m-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        {collapsed ? (
          <PanelLeftOpen className="size-[18px]" />
        ) : (
          <>
            <PanelLeftClose className="size-[18px]" />
            <span>Collapse</span>
          </>
        )}
      </button>
    </aside>
  );
}

export function MobileNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const items = [{ path: "/", name: "Home", short: "Home", icon: LayoutDashboard }, ...TOOLS];
  return (
    <div className="sticky top-0 z-30 flex gap-1 overflow-x-auto border-b border-border bg-sidebar px-3 py-2 md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70",
            )}
          >
            <Icon className="size-4" />
            {item.short}
          </Link>
        );
      })}
    </div>
  );
}