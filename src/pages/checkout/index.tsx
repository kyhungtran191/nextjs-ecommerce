import { Button } from "@/components/ui/button";
import GeneralLayout from "@/layout/GeneralLayout";
import React, { ReactNode, useEffect, useState } from "react";
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Checkout() {
  const [deliveryType, setDeliveryType] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const { data: deliveryData, isLoading: isDeliveryLoading } =
    useQueryDelivery();

  const [isAddNew, setIsAddNew] = useState<boolean>(false);
  const { data: paymentData, isLoading: isPaymentLoading } = useQueryPayment();

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
                <Dialog>
                  <DialogTrigger asChild>
                    <p className="font-bold underline text-blue-600 cursor-pointer">
                      Edit
                    </p>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
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
                        <RadioGroup defaultValue="comfortable">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="default" id="r1" />
                            <Label htmlFor="r1">Default</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="comfortable" id="r2" />
                            <Label htmlFor="r2">Comfortable</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="compact" id="r3" />
                            <Label htmlFor="r3">Compact</Label>
                          </div>
                        </RadioGroup>
                      )}
                      {isAddNew && <form></form>}
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {isAddNew ? "Add New" : "Save Change"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="text-sm font-bold p-2 rounded-lg bg-purple text-white my-2">
                Tran Ky Hung - 0936911140 - 220 Binh Phu P5 Quan 6
              </div>
            </div>
            <div className="my-2">
              <h3 className="font-semibold">Delivery Type</h3>
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
            <div className="my-2">
              <h3 className="font-semibold">Payment Type</h3>
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
              <span className="text-base font-semibold">{0}$</span>
            </div>
            <div className="flex justify-between items-center pb-5 border-b border-darkGrey">
              <h3 className="text-base font-semibold">Total Delivery Fee:</h3>
              <span className="text-base font-semibold">8,218,000₫</span>
            </div>
            <div className="flex justify-between items-center my-2">
              <h3 className="text-xl font-bold">Total:</h3>
              <span className="text-xl font-bold text-red-600">{0}$</span>
            </div>
            <Button className="w-full py-6">Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
Checkout.getLayout = (page: ReactNode) => <GeneralLayout>{page}</GeneralLayout>;
