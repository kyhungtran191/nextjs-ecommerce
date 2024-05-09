import { AppWindow, LayoutDashboard, Users } from "lucide-react";
export const menuAdmin = [
  {
    title: "Manage",
    icon: LayoutDashboard,
    link: "/manage",
    children: [
      {
        title: "Users",
        icon: Users,
        link: "/manage/users",
      },
      {
        title: "Roles",
        icon: AppWindow,
        link: "/manage/roles",
      },
    ],
  },
];
