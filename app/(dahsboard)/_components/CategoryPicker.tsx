"use client";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TransactionType } from "@/lib/type";
import { Category } from "@prisma/client";
import { Popover } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CreateCategoryDialog from "./CreateCategoryDialog";
// import { Check } from 'lucide-react'
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import { set } from "date-fns";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}
function CategoryPicker({ type, onChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });
  const selectedCategory = categoriesQuery.data?.find(
    (category: Category) => category.name === value
  );
  const successCallback = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen((prev) => !prev);
    },
    [setValue, setOpen]
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Choisir une catégorie"
          )}
          <ChevronsUpDown className="h-4 ml-2 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="Rechercher une catégorie..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandEmpty>
            <p>Categorie not found</p>
            <p className="text-xs text-muted-foreground">
              Tips: creer une nouvelle categorie
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList className="text-sm text-black">
              {categoriesQuery.data &&
                categoriesQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setOpen((prev) => !prev);
                    }}
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
}
