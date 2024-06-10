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
export default function FilterUserType({ queryConfig }: TProps) {
  const router = useRouter();
  const [userTypeSelected, setUserTypeSelected] = useState<SelectedType[] | []>(
    []
  );
  const userTypeOptions: OptionType[] = [
    {
      label: "Blocking",
      value: 0,
    },
    {
      label: "Active",
      value: 1,
    },
  ];
  useEffect(() => {
    const parseMultiValue = userTypeSelected
      .map((item) => item.value)
      .join("|");
    if (userTypeSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, status: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["status"]),
      });
    }
  }, [userTypeSelected]);

  return (
    <MultiSelect
      options={userTypeOptions}
      onChange={setUserTypeSelected}
      selected={userTypeSelected}
      name="User Type"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
