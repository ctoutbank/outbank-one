"use client";

export function TerminalsDashboardButton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full mt-4">
      <div className="relative z-0 flex justify-start">{children}</div>
    </div>
  );
}
