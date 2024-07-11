import {
  MultiSelect,
  OptionType,
  SelectedType,
} from "@/components/MultiSelect";
import { ORDER_STATUS } from "@/constants/order";
import { Dictionary, omit } from "lodash";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type TProps = {
  queryConfig: Dictionary<string | number | string[] | undefined>;
};
export default function FilterOrderStatus({ queryConfig }: TProps) {
  const router = useRouter();
  const [orderStatusSelected, setOrderStatusSelected] = useState<
    SelectedType[] | []
  >([]);

  useEffect(() => {
    const parseMultiValue = orderStatusSelected
      .map((item) => item.value)
      .join("|");
    if (orderStatusSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, status: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["status"]),
      });
    }
  }, [orderStatusSelected]);

  return (
    <MultiSelect
      options={ORDER_STATUS}
      onChange={setOrderStatusSelected}
      selected={orderStatusSelected}
      name="Order Status"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
