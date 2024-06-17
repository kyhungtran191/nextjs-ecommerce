import {
  MultiSelect,
  OptionType,
  SelectedType,
} from "@/components/MultiSelect";
import { useQueryProductType } from "@/query/useQueryProductType";
import { Dictionary, omit } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type TProps = {
  queryConfig: Dictionary<string | number | string[] | undefined>;
};
export default function FilterProductType({ queryConfig }: TProps) {
  const router = useRouter();
  const [productTypeSelected, setProductTypeSelected] = useState<
    SelectedType[] | []
  >([]);
  useEffect(() => {
    const parseMultiValue = productTypeSelected
      .map((item) => item.value)
      .join("|");
    if (productTypeSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, productType: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["productType"]),
      });
    }
  }, [productTypeSelected]);
  const productType = useQueryProductType();
  const productOptions: OptionType[] =
    (productType &&
      productType.map((item) => ({
        label: item.name,
        value: item._id,
      }))) ||
    [];
  return (
    <MultiSelect
      options={productOptions}
      onChange={setProductTypeSelected}
      selected={productTypeSelected}
      name="Product Type"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
