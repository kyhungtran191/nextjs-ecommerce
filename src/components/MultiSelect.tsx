import * as React from "react";
import { cn } from "@/lib/utils";

import { Check, X, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

export type OptionType = {
  label: string;
  value: string | number;
};

export type SelectedType = {
  label: string;
  value: string | number;
};

interface MultiSelectProps {
  options: OptionType[] | [];
  selected: SelectedType[] | [];
  onChange: React.Dispatch<React.SetStateAction<SelectedType[]>>;
  className?: string;
  classNameWrapper?: string;
  name: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  name,
  classNameWrapper,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: SelectedType) => {
    onChange(selected?.filter((i) => i.value !== item.value));
  };

  return (
    <Popover open={open} modal={true} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild className={classNameWrapper}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between h-auto px-3 py-2`}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 font-normal">
            {selected?.length > 0
              ? selected?.map((item) => (
                  <Badge
                    variant="secondary"
                    key={item.value}
                    className="mb-1 mr-1"
                    onClick={() => handleUnselect(item)}
                  >
                    {item.label}
                    <div
                      className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUnselect(item);
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      // onClick={() => this.handleUnselect(item)}
                    >
                      <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                    </div>
                  </Badge>
                ))
              : name}
          </div>
          <ChevronsUpDown className="w-3 h-3 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList className="overflow-auto max-h-64">
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected?.some((item) => item.value == option.value)
                        ? selected?.filter(
                            (item) => item.value !== option.value
                          )
                        : [...selected, option]
                    );
                    setOpen(true);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected?.some((item) => item.value == option.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
