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
  roleOptions: OptionType[] | [];
};
export default function FilterRole({ queryConfig, roleOptions }: TProps) {
  const router = useRouter();
  const [roleSelected, setRoleSelected] = useState<SelectedType[] | []>([]);
  useEffect(() => {
    const parseMultiValue = roleSelected.map((item) => item.value).join("|");
    if (roleSelected.length > 0) {
      router.replace({
        query: { ...queryConfig, roleId: parseMultiValue, page: 1 },
      });
    } else {
      router.replace({
        query: omit(queryConfig, ["roleId"]),
      });
    }
  }, [roleSelected]);

  return (
    <MultiSelect
      options={roleOptions}
      onChange={setRoleSelected}
      selected={roleSelected}
      name="Role"
      classNameWrapper="col-span-3"
    ></MultiSelect>
  );
}
