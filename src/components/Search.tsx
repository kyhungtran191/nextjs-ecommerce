import { Input } from "./ui/input";

type TProps = {
  className: string;
};
export function Search({ className }: TProps) {
  return (
    <div>
      <Input
        type="search"
        placeholder="Search..."
        className={`md:w-[100px] lg:w-[300px] ${className}`}
      />
    </div>
  );
}
