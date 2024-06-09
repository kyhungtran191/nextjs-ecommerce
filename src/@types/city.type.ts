export type City = {
  name: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type TCityAdd = {
  name: string;
};

export type CityDataList = {
  cities: City[];
  totalPage: string;
  totalCount: string;
};
