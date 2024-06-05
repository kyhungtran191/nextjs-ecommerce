import { Metadata } from "next";
import { Sidebar } from "./Sidebar";
import Header from "./Header";

export const metadata: Metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export interface IProps {
  children?: React.ReactNode;
}

export default function AdminDashboard({ children }: IProps) {
  return (
    <div>
      {/* Header */}
      <Header></Header>
      <div className="border-t">
        <div className="bg-background">
          <div className="grid grid-cols-5 min-h-[calc(100vh-70px)]">
            {/* Sidebar */}
            <Sidebar className="hidden medium:block medium:col-span-1" />
            <div className="col-span-5 medium:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8 w-full overflow-hidden">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
