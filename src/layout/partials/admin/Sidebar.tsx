import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/DropdownMenu";
import { menuAdmin } from "@/configs/menuAdmins";

interface SidebarProps {
  className: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("p-3", className)}>
      <DropdownMenu items={menuAdmin} />
    </div>
  );
}
