import GeneralLayout from "@/layout/GeneralLayout";
import Image from "next/image";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import CustomBreadCrumb from "@/components/custom-breadcrumb/CustomBreadCrumb";
import {
  EllipsisVertical,
  Eye,
  HeartIcon,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "../(components)/ProductCard";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import {
  getDetailProductPublicBySlug,
  getRelatedProduct,
} from "@/services/product-public.services";
import { TProductPublic } from "@/@types/product.type";
import ProductRating from "../(components)/ProductRating";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteMyReview,
  getAllReview,
  getDetailReview,
  updateMyReview,
} from "@/services/review.services";
import { User } from "@/@types/auth.type";
import { toFullName, transformDate } from "@/utils/helper";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/app.context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import Ratings from "@/pages/me/orders/components/Ratings";
import { useRouter } from "next/router";
import { TReview } from "@/@types/review.type";
import Swal from "sweetalert2";
import ComponentsLoading from "@/components/loading/ComponentsLoading";
type TProps = {
  product: TProductPublic;
  relatedData: TProductPublic[];
};
type TDefaultValue = {
  content: string;
};
export default function ProductDetail(props: TProps) {
  const { product, relatedData } = props;
  const [tabMode, setTabMode] = useState<string>("description");
  const [isClient, setIsClient] = useState(false);
  const [idEdit, setIdEdit] = useState<string | undefined>(undefined);
  const [selectedStar, setSelectedStar] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    data: reviewData,
    refetch,
    isLoading: isLoadingReview,
  } = useQuery({
    queryKey: ["reviews-product"],
    queryFn: () =>
      getAllReview({
        order: "created asc",
        productId: product._id,
      }),
    enabled: Boolean(tabMode === "reviews"),
  });

  const { user } = useAppContext();
  const router = useRouter();

  const schema = yup.object().shape({
    content: yup.string().required("Required_field"),
  });

  const defaultValues: TDefaultValue = {
    content: "",
  };
  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const { mutate: updateReview } = useMutation({
    mutationFn: (data: { body: TReview; id: string }) =>
      updateMyReview(data?.body, data?.id),
  });

  const { data: detailEditData } = useQuery({
    queryKey: ["detail-review", idEdit],
    queryFn: () => getDetailReview(idEdit as string),
    enabled: Boolean(idEdit),
  });

  const editingReviewData = useMemo(() => {
    if (detailEditData?.data.data) {
      setSelectedStar(detailEditData?.data?.data?.star);
      setValue("content", detailEditData?.data?.data?.content);
    }
    return detailEditData?.data.data;
  }, [detailEditData?.data?.data]);
  console.log(detailEditData);

  const handleUpdateReview = (value: TDefaultValue) => {
    if (selectedStar <= 0) {
      toast.error("Please provide rating star");
      return;
    }
    if (user) {
      updateReview(
        {
          body: {
            content: value.content,
            product: editingReviewData?.product as string,
            star: selectedStar,
            user: user._id,
          },
          id: idEdit as string,
        },
        {
          onSuccess: () => {
            setIdEdit(undefined);
            reset({});
            refetch();
            toast.success("Update Review Success !");
            router.replace(`/products/${product.slug}`);
          },
        }
      );
    }
  };

  const handleDeleteReview = (id: string) => {
    Swal.fire({
      title: "Are you sure to delete this review?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I want to delete it",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        await deleteMyReview(id).then(() => {
          toast.success("Delete Review Success !");
          refetch();
        });
      }
    });
  };

  if (!isClient) {
    return null; // Avoid rendering on the server to prevent hydration issues
  }

  return (
    <div className="py-10 min-h-screen">
      <div className="grid grid-cols-12 xl:gap-10 items-start">
        <div className="col-span-12 medium:col-span-7">
          <Zoom>
            <Image
              src={product.image}
              width={0}
              height={0}
              alt="sample"
              className="w-full h-[400px] sm:h-[600px] object-cover"
            />
          </Zoom>
        </div>
        <div className="col-span-12 medium:col-span-5 p-5 medium:p-10">
          <CustomBreadCrumb homeElement="Home"></CustomBreadCrumb>
          <div className="mt-5">
            <h1 className=" text-4xl xl:text-5xl font-medium mb-2">
              {product.name}
            </h1>
            <div className="flex items-center justify-end">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-slate-500 text-base">
                  <p>{product.views}</p>
                  <Eye className="w-5 h-5 mx-1"></Eye>
                </div>
                <div className="flex items-center text-slate-500  text-base">
                  <p>{product.totalLikes}</p>
                  <HeartIcon className="w-5 h-5 mx-1"></HeartIcon>
                </div>
              </div>
              <div></div>
            </div>
            <h3 className="text-xl font-bold mb-2">
              {(product.type as any).name}
            </h3>
            <div className="flex items-center gap-3 my-3">
              <div className="flex items-center">
                <ProductRating rating={product?.averageRating}></ProductRating>
              </div>
              <p className="font-medium text-xl">{product?.averageRating}</p>
              <p className="text-slate-500 font-medium text-sm">
                {product.totalReviews} Reviews
              </p>
              <div className="h-5 bg-slate-500 w-[2px]"></div>
              <p className="text-slate-500 font-medium text-sm">140 Sold</p>
            </div>
            <div className="flex items-center gap-3 my-3">
              <h3 className="text-3xl font-bold my-3">${product.price}</h3>
              <p className="text-xl text-slate-500 line-through ">
                ${product.price}
              </p>
            </div>
            <div className="flex items-center gap-3 my-3">
              <Select defaultValue="1">
                <SelectTrigger className="w-[100px] bg-slate-200 font-bold">
                  <SelectValue placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="font-semibold text-slate-500 text-sm">
                {product.countInStock} Available
              </div>
            </div>
            <div className="flex items-center gap-2 my-10">
              <Button className="px-10 bg-yellow-600">Buy Now</Button>
              <Button className="px-10 bg-green-800">Add To Cart</Button>
            </div>
          </div>
        </div>
      </div>
      <Tabs
        defaultValue={tabMode}
        onValueChange={setTabMode}
        className="w-full medium:mt-5"
      >
        <TabsList className="w-full gap-2">
          <TabsTrigger
            value="description"
            className="w-full py-3 font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8] "
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="w-full  py-3  font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8] "
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="faq"
            className="w-full  py-3  font-semibold data-[state=active]:bg-[#383633] data-[state=active]:text-[#f7eed8]  "
          >
            FAQ
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="description"
          className="px-5 py-6 max-h-[300px] overflow-y-auto"
        >
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </TabsContent>
        <TabsContent value="reviews" className="p-5">
          <Dialog open={Boolean(editingReviewData)}>
            <DialogContent className="">
              <DialogHeader>
                <DialogTitle className="text-base font-bold">
                  Add Your Experience
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit((value) => {
                  return handleUpdateReview(value);
                })}
              >
                <Ratings
                  selectedStar={selectedStar}
                  setSelectedStar={setSelectedStar}
                ></Ratings>
                <div className="my-6">
                  <div className="mb-1 font-bold text-base">Content</div>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <textarea
                        className="px-4 py-6 outline-none text-sm min-h-[200px] border w-full"
                        placeholder="Content"
                        {...field}
                      ></textarea>
                    )}
                  />
                  <div className="my-2 text-red-500 text-sm font-medium">
                    {errors?.content && errors?.content?.message}
                  </div>
                </div>
                <DialogFooter>
                  <Button className="w-full bg-blue-500 text-white font-medium hover:bg-blue-600">
                    Finish
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-3 gap-10">
            {isLoadingReview && (
              <div className="flex items-center justify-center col-span-3 my-10">
                <ComponentsLoading></ComponentsLoading>
              </div>
            )}
            {!isLoadingReview &&
              reviewData?.data?.data?.reviews?.map((item) => (
                <div
                  key={item.user + item.product}
                  className="rounded-lg shadow-md p-5"
                >
                  <div className=" flex justify-between">
                    <div className="flex items-start gap-2">
                      <Image
                        src={(item?.user as User)?.avatar as string}
                        width={0}
                        height={0}
                        alt="user"
                        className="w-12 h-12 rounded-full flex-shrink-0"
                      ></Image>
                      <div>
                        <p className="font-semibold text-sm">
                          {toFullName(
                            (item?.user as User)?.lastName,
                            (item?.user as User)?.firstName,
                            (item?.user as User)?.middleName,
                            ""
                          )}
                          <ProductRating rating={item?.star}></ProductRating>
                        </p>
                      </div>
                    </div>
                    <div>
                      {user && user._id === (item?.user as User)?._id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <EllipsisVertical className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuGroup>
                              <DropdownMenuItem
                                onSelect={() => {
                                  setIdEdit((item as any)?._id);
                                }}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                <span>Edit Comment</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => {
                                  handleDeleteReview((item as any)?._id);
                                }}
                              >
                                <Trash2 className="w-4 h-4 mr-2"></Trash2>
                                <span>Delete Comment</span>
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                  <div className="mt-5 text-ellipsis line-clamp-4 max-h-[300px]">
                    {item?.content}
                  </div>
                  <div className="text-slate-600 text-right font-semibold text-sm">
                    {transformDate((item as any)?.createdAt as any)}
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="faq" className="p-5 max-h-[500px] overflow-y-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger hidden>Is it accessible?</AccordionTrigger>
              <AccordionContent className="py-3">
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="py-3">
              <AccordionTrigger hidden>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other
                components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="py-3">
              <AccordionTrigger hidden>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It animated by default, but you can disable it if you
                prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
      </Tabs>
      <div className="section">
        <h2 className="section-heading">Similarity Product</h2>
        <div className="grid gap-5  sm:grid-cols-2 medium:grid-cols-3 xl:grid-cols-4 medium:gap-10 container-fluid">
          {relatedData.map((item, index) => (
            <ProductCard product={item} key={item._id}></ProductCard>
          ))}
        </div>
      </div>
    </div>
  );
}
/** * Title
 * Price
 * Discount Price(optional)
 * type
 * Total likes
 * views
 * Bottom
 * 1. description
 * 2. Reviews
 * 3. HDBQ

 */
export const getServerSideProps = async (context: any) => {
  // Fetch data from external API
  const { slug } = context.params;
  const detailData = await getDetailProductPublicBySlug(slug);
  const relatedData = await getRelatedProduct({
    slug: detailData?.data?.data?.slug,
    limit: 6,
    page: 1,
    order: "created desc",
  });

  return {
    props: {
      product: detailData.data.data,
      relatedData: relatedData.data.data?.products,
    },
  };
};
ProductDetail.authGuard = false;
ProductDetail.getLayout = (page: ReactNode) => (
  <GeneralLayout>{page}</GeneralLayout>
);
