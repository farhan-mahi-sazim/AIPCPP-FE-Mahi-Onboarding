import {
  EContractStatus,
  EContractType,
  TBaseContract,
} from "@/shared/redux/rtk-apis/modules/contracts/contracts.types";

import {
  calculateTotalDepositForContract,
  calculateTotalRentForContract,
  formatCurrency,
} from "../finance";

describe("formatCurrency", () => {
  it("formats a number as CAD currency", () => {
    const value = 1000;
    const expected = "CA$1,000.00";

    const result = formatCurrency(value);

    expect(result).toBe(expected);
  });
});

describe("calculateTotalRentForContract", () => {
  it("calculates the total rent for a residential contract", () => {
    const contract: TBaseContract = {
      id: 1,
      basicDeposit: 1000,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
      status: EContractStatus.ACTIVE,
      type: EContractType.RESIDENTIAL,
      lease: {
        id: 1,
      },
      contractDocuments: [],
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      residentialContract: {
        id: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
        monthlyBasicRent: 1000,
        monthlyLockerRent: 100,
        monthlyParkingRent: 50,
        keyDeposit: 1000,
        petDeposit: 500,
      },
    };

    const expected = 1150;

    const result = calculateTotalRentForContract(contract);

    expect(result).toBe(expected);
  });

  it("calculates the total rent for a commercial contract", () => {
    const contract: TBaseContract = {
      id: 1,
      basicDeposit: 1000,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
      status: EContractStatus.ACTIVE,
      type: EContractType.RESIDENTIAL,
      lease: {
        id: 1,
      },
      contractDocuments: [],
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      commercialContract: {
        id: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
        monthlyRent: 1000,
        monthlyMaintenanceCost: 100,
        monthlyPropertyTax: 50,
        monthlyInsurance: 500,
      },
    };

    const expected = 1000;

    const result = calculateTotalRentForContract(contract);

    expect(result).toBe(expected);
  });
});

describe("calculateTotalDepositForContract", () => {
  it("calculates the total deposit for a residential contract", () => {
    const contract: TBaseContract = {
      id: 1,
      basicDeposit: 1000,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
      status: EContractStatus.ACTIVE,
      type: EContractType.RESIDENTIAL,
      lease: {
        id: 1,
      },
      contractDocuments: [],
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      residentialContract: {
        id: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
        monthlyBasicRent: 1000,
        monthlyLockerRent: 100,
        monthlyParkingRent: 50,
        keyDeposit: 1000,
        petDeposit: 500,
      },
    };

    const expected = 2500;

    const result = calculateTotalDepositForContract(contract);

    expect(result).toBe(expected);
  });

  it("calculates the total deposit for a commercial contract", () => {
    const contract: TBaseContract = {
      id: 1,
      basicDeposit: 1000,
      startDate: "2021-01-01",
      endDate: "2021-12-31",
      status: EContractStatus.ACTIVE,
      type: EContractType.RESIDENTIAL,
      lease: {
        id: 1,
      },
      contractDocuments: [],
      createdAt: "2021-01-01",
      updatedAt: "2021-01-01",
      commercialContract: {
        id: 1,
        createdAt: "2021-01-01",
        updatedAt: "2021-01-01",
        monthlyRent: 1000,
        monthlyMaintenanceCost: 100,
        monthlyPropertyTax: 50,
        monthlyInsurance: 500,
      },
    };

    const expected = 1000;

    const result = calculateTotalDepositForContract(contract);

    expect(result).toBe(expected);
  });
});
