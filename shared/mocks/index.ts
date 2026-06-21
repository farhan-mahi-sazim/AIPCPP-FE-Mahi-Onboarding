import { TBaseProperty } from "../index.types";
import {
  ECanadianProvince,
  ECommercialPropertyType,
  EPropertyType,
  EResidentialPropertyType,
} from "../redux/rtk-apis/modules/properties/properties.types";

export const MOCK_ADDRESS = {
  id: 123,
  createdAt: "asd",
  updatedAt: "asd",
  unitNo: "11",
  streetNo: "2567",
  streetName: "Elephant Road",
  city: "Dhaka",
  province: ECanadianProvince.ON,
  postalCode: "L3X4E6",
  baseProperty: { id: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb" },
};

export const MOCK_BASE_RESIDENTIAL_PROPERTY = {
  residentialPropertyType: EResidentialPropertyType.APARTMENT,
  numberOfBedrooms: 1,
  numberOfBathrooms: 1,
  hasLocker: true,
  hasParking: false,
  hasPets: true,
  keyDeposit: 123,
  petDeposit: 123,
  monthlyBasicRent: 456,
  monthlyLockerRent: 456,
  monthlyParkingRent: 456,
};

export const MOCK_BASE_COMMERCIAL_PROPERTY = {
  commercialPropertyType: ECommercialPropertyType.INDUSTRIAL,
};

export const MOCK_PROPERTY_IMAGES = [
  {
    id: 33,
    createdAt: "asd",
    updatedAt: "asd",
    imageUrl: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png",
    baseProperty: { id: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb" },
  },
  {
    id: 44,
    createdAt: "asd",
    updatedAt: "asd",
    imageUrl: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png",
    baseProperty: { id: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb" },
  },
  {
    id: 55,
    createdAt: "asd",
    updatedAt: "asd",
    imageUrl: "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png",
    baseProperty: { id: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb" },
  },
];

export const MOCK_RESIDENTIAL_PROPERTY: TBaseProperty = {
  type: EPropertyType.RESIDENTIAL,
  description:
    'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
  holdCo: "Some Hold Co",
  squareFeet: 1234,
  basicDeposit: 56678,
  monthlyLeaseRate: 0,
  monthlyMaintenanceFee: 0,
  monthlyPropertyTax: 0,
  monthlyInsurance: 0,
  monthlyMortgage: 0,
  purchasePrice: 12312432,
  residentialProperty: MOCK_BASE_RESIDENTIAL_PROPERTY,
};

export const MOCK_COMMERCIAL_PROPERTY = {
  id: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb",
  createdAt: "asd",
  updatedAt: "asd",
  propertyImages: MOCK_PROPERTY_IMAGES,
  propertyNotes: [
    {
      id: 56,
      createdAt: "asd",
      updatedAt: "asd",
      note: "Test Commercial Note",
      basePropertyId: "22d92b34-6d4d-4b01-94c6-ca5b7fe0dadb",
    },
  ],
  type: EPropertyType.COMMERCIAL,
  description:
    "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.",
  holdCo: "Some Hold Co",
  squareFeet: 1234,
  basicDeposit: 56678,
  purchasePrice: 12312432,
  propertyAddress: MOCK_ADDRESS,
  commercialProperty: MOCK_BASE_COMMERCIAL_PROPERTY,
};
