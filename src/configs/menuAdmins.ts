import {
  AppWindow,
  LayoutDashboard,
  Users,
  LayoutTemplate,
  PackageSearch,
  PackageOpen,
  SquareGanttChart,
  MessageSquareMore,
  ReceiptText,
  ScrollText,
  Star,
  Settings,
  MapPin,
  Truck,
  CreditCard,
} from "lucide-react";
export const menuAdmin = [
  { title: "Dashboard", icon: LayoutDashboard, link: "/dashboard" },
  {
    title: "System",
    icon: LayoutTemplate,
    link: "/system",
    children: [
      {
        title: "Users",
        icon: Users,
        link: "/system/users",
      },
      {
        title: "Roles",
        icon: AppWindow,
        link: "/system/role",
      },
    ],
  },
  {
    title: "Product",
    icon: PackageSearch,
    link: "/product-manage",
    children: [
      {
        title: "Products",
        icon: PackageOpen,
        link: "/product-manage/product",
      },
      {
        title: "Product Type",
        icon: SquareGanttChart,
        link: "/product-manage/type",
      },
      {
        title: "Comments",
        icon: MessageSquareMore,
        link: "/product-manage/comment",
      },
    ],
  },
  {
    title: "Order",
    icon: ReceiptText,
    link: "/manage-order",
    children: [
      {
        title: "Order List",
        icon: ScrollText,
        link: "/manage-order/order",
      },
      {
        title: "Reviews",
        icon: Star,
        link: "/manage-order/review",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    link: "/settings",
    children: [
      {
        title: "City",
        icon: MapPin,
        link: "/settings/city",
      },
      {
        title: "Delivery Method",
        icon: Truck,
        link: "/settings/delivery",
      },
      {
        title: "Payment Method",
        icon: CreditCard,
        link: "/settings/payment",
      },
    ],
  },
];
