import dayjs from "dayjs";

import {
  EPaymentStatus,
  EPaymentType,
} from "@/shared/redux/rtk-apis/modules/payments/payments.types";
import { EPropertyType } from "@/shared/redux/rtk-apis/modules/properties/properties.types";
import { EState } from "@/shared/typedefs/enums";

import { getPaymentDetails } from "../payments";

describe("getPaymentDetails", () => {
  it("should accept payment response object and return the correct payment details", () => {
    const payment = {
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
        createdAt: "2024-04-07T21:05:21.881Z",
        updatedAt: "2024-04-07T21:05:32.876Z",
        type: "RESIDENTIAL",
        status: "TERMINATED",
        startDate: "2024-04-30T00:00:00.000Z",
        endDate: "2024-05-04T00:00:00.000Z",
        basicDeposit: 0,
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
    };

    const result = getPaymentDetails(payment);

    expect(result).toEqual({
      paymentStatus: "collected",
      type: EPaymentType.RENT,
      tenantFullName: "John Doe",
      propertyAddress: "12 12, 12, MB, 12",
      amount: 1000,
      deadline: dayjs(payment.deadline).startOf("d").format("DD MMM YYYY"),
    });
  });
});
