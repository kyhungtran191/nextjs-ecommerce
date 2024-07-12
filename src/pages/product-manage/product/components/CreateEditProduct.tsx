import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { convertBase64, stringToSlug } from "@/utils/helper";
import { toast } from "react-toastify";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
import { Switch } from "@/components/ui/switch";
import {
  createProduct,
  getDetailProductAdmin,
  updateProductAdmin,
} from "@/services/product.services";
import WrapperFileUpload from "@/components/wrapper-react-drop";
import Image from "next/image";

// CKeditor
import { TProductAdd } from "@/@types/product.type";
import { useQueryProductType } from "@/query/useQueryProductType";
import dynamic from "next/dynamic";
const CustomEditor = dynamic(
  () => {
    return import("@/components/CustomEditor");
  },
  {
    loading: () => (
      <div>
        <ComponentsLoading></ComponentsLoading>
      </div>
    ),
    ssr: false,
  }
);
interface TCreateEditProduct {
  open: boolean;
  idProduct?: string;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setEditProduct: React.Dispatch<React.SetStateAction<string | undefined>>;
  refetch: () => void;
}

type TDefaultValue = {
  name: string;
  type: string;
  discount: string;
  price: string;
  description: string;
  slug: string;
  countInStock: string;
  status: number;
  discountEndDate: Date | null;
  discountStartDate: Date | null;
};

export default function EditAddProductDialog({
  open,
  setEditProduct,
  setOpenDialog,
  idProduct,
  refetch,
}: TCreateEditProduct) {
  // Define Schema
  const schema = yup.object().shape({
    name: yup.string().required("Required_field"),
    slug: yup.string().required("Required_field"),
    type: yup.string().required("Required_field"),
    countInStock: yup
      .string()
      .required("Required_field")
      .test("least_count", "least_1_in_count", (value) => {
        return Number(value) >= 1;
      }),
    discount: yup
      .string()
      .test("least_discount", "least_1_in_discount", (value, context: any) => {
        const discountStartDate = context?.parent?.discountStartDate;
        const discountEndDate = context?.parent?.discountEndDate;
        if (value) {
          if (!discountStartDate) {
            setError("discountStartDate", {
              type: "required_start_discount",
              message: "required_start_discount",
            });
          }

          if (!discountEndDate) {
            setError("discountEndDate", {
              type: "required_end_discount",
              message: "required_end_discount",
            });
          }
        } else {
          clearErrors("discountEndDate");
          clearErrors("discountStartDate");
        }

        return !value || Number(value) >= 1;
      }),
    discountStartDate: yup
      .date()
      .notRequired()
      .test(
        "required_start_discount",
        "required_start_discount",
        (value, context: any) => {
          const discount = context?.parent?.discount;

          return (discount && value) || !discount;
        }
      )
      .test(
        "less_end_discount",
        "required_less_end_discount",
        (value, context: any) => {
          const discountEndDate = context?.parent?.discountEndDate;
          if (
            value &&
            discountEndDate &&
            discountEndDate.getTime() > value?.getTime()
          ) {
            clearErrors("discountEndDate");
          }

          return (
            (discountEndDate &&
              value &&
              discountEndDate.getTime() > value?.getTime()) ||
            !discountEndDate
          );
        }
      ),
    discountEndDate: yup
      .date()
      .notRequired()
      .test(
        "required_end_discount",
        "required_end_discount",
        (value, context: any) => {
          const discountStartDate = context?.parent?.discountStartDate;

          return (discountStartDate && value) || !discountStartDate;
        }
      )
      .test(
        "than_start_discount",
        "required_than_start_discount",
        (value, context: any) => {
          const discountStartDate = context?.parent?.discountStartDate;
          if (
            value &&
            discountStartDate &&
            discountStartDate.getTime() < value?.getTime()
          ) {
            clearErrors("discountStartDate");
          }

          return (
            (discountStartDate &&
              value &&
              discountStartDate.getTime() < value?.getTime()) ||
            !discountStartDate
          );
        }
      ),
    status: yup.number().required("Required_field"),
    description: yup.string().required("Required_field"),
    price: yup
      .string()
      .required("Required_field")
      .test("least_count", "least 10", (value) => {
        return Number(value) >= 10;
      }),
  });
  const [imageProduct, setImageProduct] = useState<string>("");
  const [status, setStatus] = useState(1);
  const defaultValues: TDefaultValue = {
    name: "",
    type: "",
    discount: "" as string, // default value is an empty string
    description: "",
    slug: "",
    countInStock: "",
    price: "",
    status: status,
    discountEndDate: null,
    discountStartDate: null,
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
    setError,
    clearErrors,
    setValue,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();
  const productDetailData = useQuery({
    queryKey: ["product_admin_detail", idProduct],
    queryFn: (_) => getDetailProductAdmin(idProduct as string),
    enabled: Boolean(idProduct),
    onSuccess: (data) => {
      const product = data?.data?.data;
      if (product) {
        setImageProduct(product?.image as string);
        reset({
          name: product?.name,
          countInStock: String(product?.countInStock),
          discount: product?.discount,
          description: product?.description,
          price: String(product?.price),
          discountEndDate: product?.discountEndDate,
          discountStartDate: product?.discountStartDate,
          slug: product?.slug,
          type: product?.type,
          status: product?.status,
        });
        setValue("type", product.type);
        setStatus(product?.status as number);
      }
    },
  });
  const createProductMutation = useMutation({
    mutationFn: (body: TProductAdd) => createProduct(body),
  });

  const updateProductMutation = useMutation({
    mutationFn: (body: TProductAdd) =>
      updateProductAdmin(body, idProduct as string),
  });

  console.log("type", getValues("type"));

  const onSubmit = (data: any) => {
    if (!Object.keys(errors).length) {
      if (idProduct) {
        updateProductMutation.mutate(
          {
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            discountEndDate: data.discountEndDate?.toISOString() || null,
            discountStartDate: data.discountStartDate?.toISOString() || null,
            image: imageProduct,
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description,
            status: status,
            countInStock: Number(data.countInStock),
          },
          {
            onSuccess: (data) => {
              const successMsg = data.data.message;
              setOpenDialog(false);
              setEditProduct(undefined);
              setImageProduct("");
              refetch();
              reset(defaultValues);
              toast.success(successMsg);
            },
            onError: (err: any) => {
              const errorMsg = err.response.data.message;
              toast.error(errorMsg);
            },
          }
        );
      } else {
        createProductMutation.mutate(
          {
            name: data.name,
            slug: data.slug,
            price: Number(data.price),
            discountEndDate: data.discountEndDate?.toISOString() || null,
            discountStartDate: data.discountStartDate?.toISOString() || null,
            image: imageProduct,
            type: data.type,
            discount: Number(data.discount) || 0,
            description: data.description,
            status: status,
            countInStock: Number(data.countInStock),
          },
          {
            onSuccess: (data) => {
              const successMsg = data.data.message;
              queryClient.invalidateQueries(["products_admin"]);
              setOpenDialog(false);
              setImageProduct("");
              refetch();
              reset(defaultValues);
              toast.success(successMsg);
            },
            onError: (err: any) => {
              const errorMsg = err.response.data.message;
              toast.error(errorMsg);
            },
          }
        );
      }
    }
  };
  // Handle upload image
  const handleUploadImage = async (file: File) => {
    const base64 = await convertBase64(file);
    setImageProduct(base64 as string);
  };

  const nameValue = watch("name");

  useEffect(() => {
    const parseSlugValue = stringToSlug(nameValue);
    setValue("slug", parseSlugValue);
  }, [nameValue, setValue]);

  const productTypes = useQueryProductType();
  return (
    <div>
      <Dialog defaultOpen={open} open={open} onOpenChange={setOpenDialog}>
        <DialogTrigger>
          <div className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center text-white bg-purple cursor-pointer">
            <Plus></Plus>
          </div>
        </DialogTrigger>
        <DialogContent
          className="max-w-[90vw] xl:max-w-[70vw] min-h-[55vh] max-h-[95vh] xl:max-h-screen p-6 overflow-auto"
          onCloseAutoFocus={() => {
            setEditProduct(undefined);
            setOpenDialog(false);
            setImageProduct("");
            reset(defaultValues);
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center font-bold !text-2xl">
              {idProduct ? "Update Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          {productDetailData.isLoading && idProduct && (
            <ComponentsLoading></ComponentsLoading>
          )}
          {(!productDetailData.isLoading || !idProduct) && (
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-4 gap-3 items-start">
                <div className="col-span-4 xl:col-span-2">
                  <div className="col-span-1 rounded-xl shadow-md p-5">
                    <div className="text-lg font-bold mb-2">Image</div>
                    <WrapperFileUpload
                      uploadFunc={handleUploadImage}
                      objectAcceptFile={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                      className="h-[150px] sm:h-[200px] medium:h-[350px] cursor-pointer flex items-center justify-center"
                    >
                      {imageProduct ? (
                        <div className="w-full h-full relative group">
                          <Image
                            src={imageProduct}
                            width={0}
                            height={0}
                            alt={"product"}
                            className="w-full h-full object-cover rounded-lg"
                          ></Image>
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:visible invisible transition-all duration-300 ease-in-out">
                            <Button
                              variant={"outline"}
                              onClick={(e) => {
                                e.stopPropagation();
                                setImageProduct("");
                              }}
                            >
                              <Trash2 className="text-red-400"></Trash2>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <ImagePlus />
                      )}
                    </WrapperFileUpload>
                  </div>
                </div>
                <div className="col-span-4 xl:col-span-2 gap-x-4 rounded-xl shadow-md p-4 grid grid-cols-2  items-center relative z-10">
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="name">Product name*</Label>
                    <Controller
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <Input
                          className="px-4 py-6 outline-none text-sm"
                          placeholder="Product name*"
                          {...field}
                        ></Input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.name && errors?.name?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="slug">Slug</Label>
                    <Controller
                      control={control}
                      name="slug"
                      render={({ field }) => (
                        <Input
                          className="px-4 py-6 outline-none text-sm bg-slate-300/50"
                          disabled
                          type="text"
                          placeholder="Slug"
                          {...field}
                        ></Input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.slug && errors?.slug?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="price">Price</Label>
                    <Controller
                      control={control}
                      name="price"
                      render={({ field }) => (
                        <Input
                          className="px-4 py-6 outline-none text-sm"
                          type="text"
                          placeholder="Price"
                          {...field}
                          onChange={(e) => {
                            const numValue = e.target.value.replace(/\D/g, "");
                            field.onChange(numValue);
                          }}
                        ></Input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.price && errors?.price?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="countInStock">Quantity</Label>
                    <Controller
                      control={control}
                      name="countInStock"
                      render={({ field }) => (
                        <Input
                          className="px-4 py-6 outline-none text-sm"
                          type="text"
                          placeholder="Quantity"
                          {...field}
                          onChange={(e) => {
                            const numValue = e.target.value.replace(/\D/g, "");
                            field.onChange(numValue);
                          }}
                        ></Input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.countInStock && errors?.countInStock?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      onValueChange={(value) => {
                        setValue("type", value);
                      }}
                      defaultValue={getValues("type")}
                    >
                      <SelectTrigger className="py-6" value={getValues("type")}>
                        <SelectValue placeholder="Select Product Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup defaultValue={getValues("type")}>
                          {productTypes?.map((item) => (
                            <SelectItem value={item._id} key={item._id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.type && errors?.type?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Controller
                      control={control}
                      name="discount"
                      render={({ field }) => (
                        <Input
                          className="px-4 py-6 outline-none text-sm"
                          placeholder="Discount"
                          {...field}
                          // overwrite onChange function
                          onChange={(e) => {
                            const numValue = e.target.value.replace(/\D/g, "");
                            field.onChange(numValue);
                          }}
                        ></Input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.discount && errors?.discount?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="discountStartDate">Start Date</Label>
                    <Controller
                      control={control}
                      name="discountStartDate"
                      render={({ field }) => (
                        // <Popover>
                        //   <PopoverTrigger asChild>
                        //     <Button
                        //       variant={"outline"}
                        //       className={cn(
                        //         "w-full justify-start text-left font-normal",
                        //         !field.value && "text-muted-foreground"
                        //       )}
                        //     >
                        //       <CalendarIcon className="mr-2 h-4 w-4" />
                        //       {field.value ? (
                        //         format(field.value, "PPP")
                        //       ) : (
                        //         <span>Pick a date</span>
                        //       )}
                        //     </Button>
                        //   </PopoverTrigger>
                        //   <PopoverContent className="w-auto p-0 relative">
                        //     <Calendar
                        //       mode="single"
                        //       className="cursor-pointer"
                        //       selected={field?.value as Date}
                        //       disabled={(date) => date < new Date()}
                        //       onDayClick={field.onChange}
                        //       initialFocus
                        //     />
                        //   </PopoverContent>
                        // </Popover>
                        <input
                          type="date"
                          // onChange={field.onChange}
                          className="cursor-pointer border p-2 m-2 rounded-lg shadow-sm relative"
                          {...field}
                          value={moment(field.value).format("YYYY-MM-DD")}
                        ></input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.discountStartDate &&
                        errors?.discountStartDate?.message}
                    </div>
                  </div>
                  <div className="col-span-2 medium:col-span-1">
                    <Label htmlFor="discountEndDate">End Date</Label>
                    <Controller
                      control={control}
                      name="discountEndDate"
                      render={({ field }) => (
                        // <Popover>
                        //   <PopoverTrigger asChild>
                        //     <Button
                        //       variant={"outline"}
                        //       className={cn(
                        //         "w-full justify-start text-left font-normal",
                        //         !field.value && "text-muted-foreground"
                        //       )}
                        //     >
                        //       <CalendarIcon className="mr-2 h-4 w-4" />
                        //       {field.value ? (
                        //         format(field.value, "PPP")
                        //       ) : (
                        //         <span>Pick a date</span>
                        //       )}
                        //     </Button>
                        //   </PopoverTrigger>
                        //   <PopoverContent
                        //     className="w-auto p-0 relative z-[60]"
                        //     onClick={() => {
                        //       console.log("click");
                        //     }}
                        //   >
                        //     <Calendar
                        //       mode="single"
                        //       className="z-[60]"
                        //       selected={field?.value as Date}
                        //       disabled={(date) => date < new Date()}
                        //       onDayClick={field.onChange}
                        //       initialFocus
                        //     />
                        //   </PopoverContent>
                        // </Popover>
                        <input
                          type="date"
                          className="cursor-pointer border p-2 m-2 rounded-lg shadow-sm relative"
                          {...field}
                          value={moment(field.value).format("YYYY-MM-DD")}
                        ></input>
                      )}
                    />
                    <div className=" text-red-500 text-sm font-medium">
                      {errors?.discountEndDate &&
                        errors?.discountEndDate?.message}
                    </div>
                  </div>
                  <div className="col-span-2 my-2">
                    <Label htmlFor="type">Description</Label>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <CustomEditor
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    ></Controller>
                  </div>
                  <div className="my-4">
                    <Label htmlFor="airplane-mode" className="block  mb-1">
                      Status
                    </Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <Label htmlFor="airplane-mode">Private</Label>
                      <Switch
                        id="airplane-mode"
                        checked={status === 1}
                        onCheckedChange={() => {
                          setStatus(status == 1 ? 0 : 1);
                        }}
                      />
                      <Label htmlFor="airplane-mode">Public</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-purple text-white w-full mt-10 p-6 mx-auto text-base font-bold"
                >
                  {idProduct ? "Update " : "Add"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
