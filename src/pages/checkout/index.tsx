import { Button } from "@/components/ui/button";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import ProductTable from "./product-table";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useQueryDelivery } from "@/query/useQueryDelivery";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryPayment } from "@/query/useQueryPayment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { TUserAddress } from "@/@types/user.type";
import { cloneDeep, separationFullName, toFullName } from "@/utils/helper";
import * as yup from "yup";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe } from "@/services/auth.services";
import { useQueryCities } from "@/query/useQueryCity";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/app.context";
import { useCartStore } from "@/stores/cart.store";

type TDefaultValue = {
  fullName: string;
  phoneNumber: string;
  city: string;
  address: string;
};
export default function Checkout() {
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [isCurrentDefault, setCurrentDefault] = useState<TUserAddress | null>(
    null
  );

  const { data: deliveryData, isLoading: isDeliveryLoading } =
    useQueryDelivery();

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const { data: paymentData, isLoading: isPaymentLoading } = useQueryPayment();

  const schema = yup.object().shape({
    fullName: yup.string().required("Required_field"),
    phoneNumber: yup
      .string()
      .required("Required_field")
      .min(9, "The phone number is min 9 number"),
    city: yup.string().required("Must choose shipping city"),
    address: yup.string().required("Must have address for shipping"),
  });

  const defaultValues: TDefaultValue = {
    fullName: "",
    phoneNumber: "",
    city: "",
    address: "",
  };

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { data } = useQueryCities();
  const queryClient = useQueryClient();
  const { user } = useAppContext();
  const { cart } = useCartStore();
  const cityOptions = useMemo(() => {
    return data?.data?.data?.cities;
  }, [data?.data?.data?.cities]);

  const deliveryTypes = React.useMemo(
    () => deliveryData?.data?.data?.deliveryTypes || [],
    [deliveryData]
  );

  const paymentTypes = React.useMemo(
    () => paymentData?.data?.data?.paymentTypes || [],
    [paymentData]
  );

  useEffect(() => {
    if (deliveryTypes.length > 0) {
      setDeliveryType(deliveryTypes[0]._id);
    }
    if (paymentTypes.length > 0) {
      setPaymentType(paymentTypes[0]._id);
    }
  }, [deliveryTypes, paymentTypes]);

  const totalProductPrice = useMemo(() => {
    const price = cart.reduce((total, current) => {
      return total + current.price * current.amount;
    }, 0);
    return price;
  }, [cart]);

  const updateMeMutation = useMutation({
    mutationFn: (body: any) => updateMe(body),
  });

  const onSubmit = (data: any) => {
    if (isAddNew) {
      let newAddress: TUserAddress[] = cloneDeep(user?.addresses || []);
      const { firstName, middleName, lastName } = separationFullName(
        data.fullName,
        "en"
      );

      newAddress = newAddress.map((item) => ({
        ...item,
        isDefault: false,
      }));

      let address: TUserAddress = {
        middleName,
        lastName,
        firstName,
        address: data?.address,
        city: data.city,
        isDefault: true,
        phoneNumber: data.phoneNumber,
      };
      newAddress.push(address);
      updateMeMutation.mutate(
        { addresses: newAddress },
        {
          onSuccess: (data) => {
            toast.success("Add new address successfully!");
            queryClient.invalidateQueries(["me"]);
            setCurrentDefault(data?.data?.data as any);
            setIsAddNew(false);
            reset(defaultValues);
          },
        }
      );
    }
  };

  const returnCityName = (cityId: string) => {
    return cityOptions?.find((item) => item._id === cityId)?.name || "";
  };

  useEffect(() => {
    if (user?.addresses) {
      let isDefaultItem = user.addresses.find((item) => item.isDefault);
      setCurrentDefault(isDefaultItem as TUserAddress);
    }
  }, [user?.addresses]);

  const handleChangeDefault = () => {
    const cloneAddressesArr: TUserAddress[] = cloneDeep(user?.addresses || []);
    const newAddresses: TUserAddress[] = cloneAddressesArr.map((item) => {
      if (item._id === isCurrentDefault?._id) {
        return { ...item, isDefault: true };
      }
      return { ...item, isDefault: false };
    });
    updateMeMutation.mutate(
      { addresses: newAddresses },
      {
        onSuccess: () => {
          toast.success("Update new Default Address successfully");
          setOpenDialog(false);
        },
      }
    );
  };

  const { currentDeliveryPrice, totalPriceWithDelivery } = useMemo(() => {
    const currentDeliveryPrice = deliveryTypes.find(
      (item) => item._id === deliveryType
    )?.price;
    const totalPriceWithDelivery = currentDeliveryPrice
      ? totalProductPrice + currentDeliveryPrice
      : totalProductPrice;
    return { currentDeliveryPrice, totalPriceWithDelivery };
  }, [deliveryType, cart]);

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold">Checkout</h2>
      {(isDeliveryLoading || isPaymentLoading) && (
        <div className="grid grid-cols-3 gap-16 min-h-[60vh]">
          <div className="col-span-1">
            <Skeleton className="w-full h-full"></Skeleton>
          </div>
          <div className="col-span-2">
            <Skeleton className="w-full h-full"></Skeleton>
          </div>
        </div>
      )}
      {!isDeliveryLoading && !isPaymentLoading && (
        <div className="grid grid-cols-1 medium:grid-cols-3 medium:gap-16">
          <div className="p-4 rounded-lg bg-slate-100/50 min-h-[300px] shadow-sm col-span-1 w-full">
            <div className="my-2">
              <div className="flex items-center gap-x-2">
                <h3 className="font-semibold">Shipping Address</h3>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <p className="font-bold underline text-blue-600 cursor-pointer">
                      Edit
                    </p>
                  </DialogTrigger>
                  <DialogContent
                    className="sm:max-w-[425px]"
                    onCloseAutoFocus={() => {
                      setIsAddNew(false);
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle className="font-bold">
                        <div className="flex items-center gap-x-3">
                          Update Address
                          {}
                          <div
                            className="text-sm underline cursor-pointer text-blue-600"
                            onClick={() => setIsAddNew(!isAddNew)}
                          >
                            {isAddNew ? "Select Address" : "Add New"}
                          </div>
                        </div>
                      </DialogTitle>
                    </DialogHeader>
                    <div className="">
                      {!isAddNew && (
                        <RadioGroup
                          defaultValue={isCurrentDefault?._id}
                          value={isCurrentDefault?._id}
                          onValueChange={(value) => {
                            const isChooseItem = user?.addresses.find(
                              (item) => item._id == value
                            );
                            setCurrentDefault(isChooseItem as TUserAddress);
                          }}
                        >
                          {user?.addresses &&
                            user.addresses.map((item) => (
                              <div
                                className="flex items-center space-x-2 my-3"
                                key={item._id}
                              >
                                <RadioGroupItem
                                  value={item._id as string}
                                  id={item._id}
                                  className="flex-shrink-0"
                                />
                                <Label htmlFor={item._id}>
                                  {toFullName(
                                    item.lastName,
                                    item.middleName,
                                    item.firstName,
                                    ""
                                  )}
                                  - {item.phoneNumber} - {item.address}(
                                  {returnCityName(item.city)})
                                </Label>
                              </div>
                            ))}
                        </RadioGroup>
                      )}
                      {isAddNew && (
                        <form
                          className="grid items-center  grid-cols-1 max-w-5xl mx-auto"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          <div className="">
                            <Label className="font-semibold text-md">
                              Full Name
                            </Label>
                            <Controller
                              control={control}
                              name="fullName"
                              render={({ field }) => (
                                <Input
                                  className="px-4 py-6 outline-none text-sm"
                                  placeholder="Full Name"
                                  {...field}
                                ></Input>
                              )}
                            />
                            <div className="h-5  text-base font-semibold text-red-500">
                              {errors.fullName && errors.fullName.message}
                            </div>
                          </div>

                          <div className="">
                            <Label className="font-semibold text-md">
                              Phone
                            </Label>
                            <Controller
                              control={control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <Input
                                  className="px-4 py-6 outline-none text-sm"
                                  placeholder="Phone"
                                  {...field}
                                ></Input>
                              )}
                            />
                            <div className="h-5 text-base font-semibold text-red-500">
                              {errors.phoneNumber && errors.phoneNumber.message}
                            </div>
                          </div>

                          <div className="">
                            <Label className="font-semibold text-md">
                              Address
                            </Label>
                            <Controller
                              control={control}
                              name="address"
                              render={({ field }) => (
                                <Input
                                  className="px-4 py-6 outline-none text-sm"
                                  placeholder="Address"
                                  {...field}
                                ></Input>
                              )}
                            />
                            <div className="h-5 text-base font-semibold text-red-500">
                              {errors.address && errors.address.message}
                            </div>
                          </div>
                          <div className="my-3">
                            <Label className="font-semibold text-md">
                              City
                            </Label>

                            <Controller
                              control={control}
                              name="city"
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  value={field.value}
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select City" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      {cityOptions?.map((city) => {
                                        return (
                                          <SelectItem
                                            value={city._id}
                                            key={city._id}
                                          >
                                            {city.name}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            ></Controller>
                            <div className="h-5 text-base font-semibold text-red-500">
                              {errors.city && errors.city.message}
                            </div>
                          </div>

                          <Button
                            type="submit"
                            className=" py-3 bg-blend-darken max-w-[80vw] mt-5  "
                          >
                            Add
                          </Button>
                        </form>
                      )}
                    </div>
                    <DialogFooter>
                      {!isAddNew && (
                        <Button type="submit" onClick={handleChangeDefault}>
                          Save Change
                        </Button>
                      )}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-sm font-bold p-2 rounded-lg bg-purple text-white my-2">
                {toFullName(
                  isCurrentDefault?.lastName as string,
                  isCurrentDefault?.middleName as string,
                  isCurrentDefault?.firstName as string,
                  ""
                )}
                - {isCurrentDefault?.phoneNumber} - {isCurrentDefault?.address}(
                {returnCityName(isCurrentDefault?.city as string)})
              </div>
            </div>
            <div className="my-4">
              <h3 className="font-semibold mb-2">Delivery Type</h3>
              <RadioGroup
                defaultValue={deliveryType}
                onValueChange={(value) => {
                  setDeliveryType(value);
                }}
              >
                {deliveryTypes &&
                  deliveryTypes.map((item) => (
                    <div className="flex items-center space-x-2" key={item._id}>
                      <RadioGroupItem
                        value={item._id}
                        id={item._id}
                        checked={item._id === deliveryType}
                      />
                      <Label htmlFor={item._id}>{item.name}</Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
            <div className="my-4">
              <h3 className="font-semibold mb-2">Payment Type</h3>
              <RadioGroup
                defaultValue={paymentType}
                onValueChange={(value) => {
                  setPaymentType(value);
                }}
              >
                {paymentTypes &&
                  paymentTypes.map((item) => (
                    <div className="flex items-center space-x-2" key={item._id}>
                      <RadioGroupItem
                        value={item._id}
                        id={item._id}
                        checked={item._id === paymentType}
                      />
                      <Label htmlFor={item._id}>{item.name}</Label>
                    </div>
                  ))}
              </RadioGroup>
            </div>
          </div>
          <div className="col-span-2">
            <h2 className="font-medium text-lg">Your Orders</h2>
            <div className="my-2 max-h-[500px] overflow-y-hidden ">
              <ProductTable></ProductTable>
            </div>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-semibold">Total Product Value:</h3>
              <span className="text-base font-semibold">
                {totalProductPrice}$
              </span>
            </div>
            <div className="flex justify-between items-center pb-5 border-b border-darkGrey">
              <h3 className="text-base font-semibold">Total Delivery Fee:</h3>
              <span className="text-base font-semibold">
                {currentDeliveryPrice}$
              </span>
            </div>
            <div className="flex justify-between items-center my-2">
              <h3 className="text-xl font-bold">Total:</h3>
              <span className="text-xl font-bold text-red-600">
                {totalPriceWithDelivery}$
              </span>
            </div>
            <Button className="w-full py-6">Order</Button>
          </div>
        </div>
      )}
    </div>
  );
}
Checkout.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
