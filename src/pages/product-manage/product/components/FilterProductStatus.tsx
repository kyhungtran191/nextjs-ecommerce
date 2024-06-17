import {
  MultiSelect,
  OptionType,
  SelectedType,
} from "@/components/MultiSelect";
import { Dictionary, omit } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type TProps = {
  queryConfig: Dictionary<string | number | string[] | undefined>;
};
export default function FilterProductStatus({ queryConfig }: TProps) {
  const router = useRouter();
  const [productStatusSelected, setProductStatusSelected] = useState<
    SelectedType[] | []
  >([]);
  const productStatusOptions: OptionType[] = [
    {
      label: "Private",
      value: 0,
    },
    {
      label: "Active",
      value: 1,
    },
  ];
  useEffect(() => {
    const parseMultiValue = productStatusSelected
      .map((item) => item.value)
      .join("|");
    if (productStatusSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, status: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["status"]),
      });
    }
  }, [productStatusSelected]);

  return (
    <MultiSelect
      options={productStatusOptions}
      onChange={setProductStatusSelected}
      selected={productStatusSelected}
      name="Status"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
