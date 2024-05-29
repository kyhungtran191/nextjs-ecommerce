import { Button } from "@/components/ui/button";
import AdminDashboard from "@/layout/partials/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppContext } from "@/context/app.context";
import GeneralLayout from "@/layout/GeneralLayout";
// const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <GeneralLayout>Home</GeneralLayout>;
}

Home.authGuard = false;
