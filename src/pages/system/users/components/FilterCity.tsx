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
  cityOptions: OptionType[] | [];
};
export default function FilterCity({ queryConfig, cityOptions }: TProps) {
  const router = useRouter();
  const [citySelected, setCitySelected] = useState<SelectedType[] | []>([]);
  useEffect(() => {
    const parseMultiValue = citySelected.map((item) => item.value).join("|");
    if (citySelected.length > 0) {
      router.replace({
        query: { ...queryConfig, cityId: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["cityId"]),
      });
    }
  }, [citySelected]);

  return (
    <MultiSelect
      options={cityOptions}
      onChange={setCitySelected}
      selected={citySelected}
      name="City"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
