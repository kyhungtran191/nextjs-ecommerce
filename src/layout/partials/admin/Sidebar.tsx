import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DropdownMenu from "@/components/DropdownMenu";
import { menuAdmin } from "@/configs/menuAdmins";
import { PERMISSIONS } from "@/configs/permission";
import { useAppContext } from "@/context/app.context";

interface SidebarProps {
  className: string;
}
function filterMenuByPermissions(menu: any, userPermissions: string[]) {
  // Check if user has 'Admin.Granted' permission
  if (userPermissions.includes(PERMISSIONS.ADMIN)) {
    return menu.map((item: any) => ({ ...item, isHidden: false }));
  }

  return menu.map((item: any) => {
    // Check có children hay k
    if (item?.children?.length > 0) {
      // Check user có permission đó k, hoặc là children đó có cần permission ko
      const visibleChildren = item.children.filter((child: any) => {
        return !child.permission || userPermissions.includes(child.permission);
      });

      item.isHidden = visibleChildren.length === 0;

      // Return the item with the filtered children
      return {
        ...item,
        children: visibleChildren,
      };
    } else {
      // Ko có children thì check có permission ko nếu có thì check user có permission đó ko
      item.isHidden =
        item.permission && !userPermissions.includes(item.permission);
      return item;
    }
  });
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAppContext();
  const userPermissions = user?.role?.permissions
    ? user?.role?.permissions?.includes(PERMISSIONS.BASIC)
      ? [PERMISSIONS.DASHBOARD]
      : user?.role?.permissions
    : [];

  let mappedArr = filterMenuByPermissions(menuAdmin, userPermissions);
  return (
    <div className={cn("p-3", className)}>
      <DropdownMenu items={mappedArr} />
    </div>
  );
}
