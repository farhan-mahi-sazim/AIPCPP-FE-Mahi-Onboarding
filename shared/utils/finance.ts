import { TBaseContract } from "../redux/rtk-apis/modules/contracts/contracts.types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
  }).format(value);
}

export function calculateTotalRentForContract(contract: TBaseContract) {
  const { residentialContract, commercialContract } = contract;
  return (
    (residentialContract?.monthlyBasicRent ?? 0) +
    (residentialContract?.monthlyLockerRent ?? 0) +
    (residentialContract?.monthlyParkingRent ?? 0) +
    (commercialContract?.monthlyRent ?? 0)
  );
}

export function calculateTotalDepositForContract(contract: TBaseContract) {
  const { residentialContract } = contract;
  return (
    contract.basicDeposit +
    (residentialContract?.keyDeposit ?? 0) +
    (residentialContract?.petDeposit ?? 0)
  );
}
