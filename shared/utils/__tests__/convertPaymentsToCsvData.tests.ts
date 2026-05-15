import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import {
  EPaymentStatus,
  EPaymentType,
  TPayment,
} from "@/shared/redux/rtk-apis/modules/payments/payments.types";
import { EPropertyType } from "@/shared/redux/rtk-apis/modules/properties/properties.types";
import { DeepPartial } from "@/shared/typedefs/common.types";
import { EState } from "@/shared/typedefs/enums";

import { convertPaymentsToCsvData } from "../convertPaymentsToCsvData";

dayjs.extend(utc);

jest.mock("@/shared/utils/finance", () => ({
  formatCurrency: jest.fn((amount: number) => `$${amount.toFixed(2)}`),
}));

jest.mock("@/shared/utils/payments", () => ({
  getPaymentDetails: jest.fn((payment) => ({
    tenantFullName:
      payment.baseContract?.lease?.userProfiles?.[0]?.firstName +
      " " +
      payment.baseContract?.lease?.userProfiles?.[0]?.lastName,
    propertyAddress: payment.baseContract?.lease?.baseProperty?.fullAddress,
    amount: payment.amount,
    paymentStatus: payment.status,
    type: payment.type,
    deadline: dayjs.utc(payment.deadline).startOf("day").format("DD MMM YYYY"),
  })),
}));

describe("convertPaymentsToCsvData", () => {
  it("should correctly convert payment objects into CSV format ", () => {
    const payments: DeepPartial<TPayment>[] = [
      {
        id: 1,
        createdAt: "2024-04-07T21:05:21.908Z",
        updatedAt: "2024-04-07T21:05:21.908Z",
        type: EPaymentType.RENT,
        status: EPaymentStatus.COLLECTED,
        amount: 1000,
        lateFee: 0,
        deadline: "2024-05-29T18:00:00.000Z",
        baseContract: {
          id: 1,

          lease: {
            id: 1,
            createdAt: "2024-04-07T21:04:52.177Z",
            updatedAt: "2024-04-07T21:04:52.177Z",
            state: EState.ACTIVE,
            baseProperty: {
              id: "8a5cf1a8-1933-477d-a654-9c7193745324",
              createdAt: "2024-04-07T21:04:19.140Z",
              updatedAt: "2024-04-07T21:04:19.140Z",
              type: EPropertyType.RESIDENTIAL,
              squareFeet: 12,
              description: "12",
              holdCo: "",
              basicDeposit: 0,
              purchasePrice: 0,
              state: EState.ACTIVE,
              fullAddress: "12 12, 12, MB, 12",
            },
            userProfiles: [
              {
                id: 3,
                createdAt: "2024-04-07T21:04:38.603Z",
                updatedAt: "2024-04-07T21:04:38.603Z",
                firstName: "John",
                lastName: "Doe",
                businessName: "",
                cellPhoneNo: "01202555015",
                role: {
                  id: 3,
                },
              },
            ],
          },
        },
      },
      {
        id: 2,
        createdAt: "2024-04-07T21:05:21.908Z",
        updatedAt: "2024-04-07T21:05:21.908Z",
        type: EPaymentType.DEPOSIT,
        status: EPaymentStatus.RECONCILED,
        amount: 2000,
        lateFee: 0,
        deadline: "2024-05-21T18:00:00.000Z",
        baseContract: {
          id: 2,
          lease: {
            id: 2,
            createdAt: "2024-04-07T21:04:52.177Z",
            updatedAt: "2024-04-07T21:04:52.177Z",
            state: EState.ACTIVE,
            baseProperty: {
              id: "8a5cf1a8-1933-477d-a654-9c7193745324",
              createdAt: "2024-04-07T21:04:19.140Z",
              updatedAt: "2024-04-07T21:04:19.140Z",
              type: EPropertyType.RESIDENTIAL,
              squareFeet: 12,
              description: "12",
              holdCo: "",
              basicDeposit: 0,
              purchasePrice: 0,
              state: EState.ACTIVE,
              fullAddress: "10 10, 10, MB, 10",
            },
            userProfiles: [
              {
                id: 4,
                createdAt: "2024-04-07T21:04:38.603Z",
                updatedAt: "2024-04-07T21:04:38.603Z",
                firstName: "Jane",
                lastName: "Doe",
                businessName: "",
                cellPhoneNo: "01202555015",
                role: {
                  id: 4,
                },
              },
            ],
          },
        },
      },
    ];

    const expectedCsvData = [
      {
        tenantFullName: "John Doe",
        propertyAddress: "12 12, 12, MB, 12",
        amount: "$1000.00",
        paymentStatus: EPaymentStatus.COLLECTED,
        type: EPaymentType.RENT,
        deadline: "29 May 2024",
      },
      {
        tenantFullName: "Jane Doe",
        propertyAddress: "10 10, 10, MB, 10",
        amount: "$2000.00",
        paymentStatus: EPaymentStatus.RECONCILED,
        type: EPaymentType.DEPOSIT,
        deadline: "21 May 2024",
      },
    ];

    const result = convertPaymentsToCsvData(payments);

    expect(result).toEqual(expectedCsvData);
  });
});
