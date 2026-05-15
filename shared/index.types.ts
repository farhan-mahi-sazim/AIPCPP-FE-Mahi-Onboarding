import {
  ECommercialPropertyType,
  EPropertyType,
  EResidentialPropertyType,
} from "./redux/rtk-apis/modules/properties/properties.types";

export type TApiResponse<TData> = {
  statusCode: number;
  message: string;
  data: TData;
};

export type TApiErrorResponse = {
  status: number;
  data: {
    statusCode: number;
    message: string[] | string;
    error: string;
  };
};

export type TBaseProperty = {
  type: EPropertyType;
  description: string;
  holdCo: string;
  squareFeet: number;
  basicDeposit: number;
  monthlyLeaseRate: number;
  monthlyMaintenanceFee: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyMortgage: number;
  purchasePrice: number;
  residentialProperty?: TResidentialProperty;
  commercialProperty?: TCommercialProperty;
};

export type TResidentialProperty = {
  residentialPropertyType: EResidentialPropertyType;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  hasLocker: boolean;
  hasParking: boolean;
  hasPets: boolean;
  keyDeposit: number;
  petDeposit: number;
  monthlyBasicRent: number;
  monthlyLockerRent: number;
  monthlyParkingRent: number;
};

export type TCommercialProperty = {
  commercialPropertyType: ECommercialPropertyType;
};

export type TNullable<T> = { [K in keyof T]: T[K] | null };
