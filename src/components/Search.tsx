import { Input } from "./ui/input";

type TProps = {
  className: string;
};
export function Search({ className }: TProps) {
  return (
    <Input
      type="search"
      placeholder="Search..."
      className={` lg:w-[300px] ${className}`}
    />
  );
}
