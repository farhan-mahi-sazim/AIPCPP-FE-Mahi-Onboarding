export enum EPropertyTypeDescriptions {
  RESIDENTIAL = "Residential",
  COMMERCIAL = "Commercial",
}

export enum ECommercialPropertyTypeDescriptions {
  OFFICE_BUILDING = "Office Building",
  INDUSTRIAL = "Industrial",
  MANUFACTURING = "Manufacturing",
  RETAIL = "Retail",
  OTHER = "Other",
}

export enum EResidentialPropertyTypeDescriptions {
  APARTMENT = "Apartment",
  ATTACHED_HOUSE = "Attached House",
  CONDO = "Condo",
  DETACHED_HOUSE = "Detached House",
  MULTI_FAMILY = "Multi Family",
  SEMI_DETACHED_HOUSE = "Semi Detached House",
  TOWNHOUSE = "Townhouse",
  OTHER = "Other",
}

export enum ECanadianProvinceName {
  AB = "Alberta",
  BC = "British Columbia",
  MB = "Manitoba",
  NB = "New Brunswick",
  NL = "Newfoundland and Labrador",
  NS = "Nova Scotia",
  ON = "Ontario",
  PE = "Prince Edward Island",
  QC = "Quebec",
  SK = "Saskatchewan",
  NT = "Northwest Territories",
  NU = "Nunavut",
  YT = "Yukon",
}

export enum EPaymentStatus {
  PENDING = "Pending",
  RESCHEDULED = "Rescheduled",
  COLLECTED = "Collected",
  RECONCILED = "Reconciled",
  FAILED = "Failed",
}

export enum EResidentialPropertyExpenseType {
  RENT = "Rent",
  DEPOSIT = "Deposit",
}

export enum ECommercialPropertyExpenseType {
  LEASE = "Lease",
  DEPOSIT = "Deposit",
  TMI = "TMI",
}

export enum EState {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ETaskTypeDescriptions {
  MAINTENANCE = "Maintenance",
  RENOVATION = "Renovation",
}

export enum ETaskStatusDescriptions {
  NEW = "New",
  ASSIGNED = "Assigned",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum EMaintenanceTaskTypeDescriptions {
  APPLIANCE_ISSUE = "Appliance Issue",
  ELECTRICAL_ISSUE = "Electrical Issue",
  DAMAGE_TO_PROPERTY = "Damage to Property",
  AC_OR_HEATING_ISSUE = "AC or Heating Issue",
  PLUMBING_ISSUE = "Plumbing Issue",
  FLOODING_ISSUE = "Flooding Issue",
  OTHER = "Other",
}

export enum EDateFormat {
  LONG = "MMMM DD, YYYY",
  SHORT = "MMM DD, YYYY",
  SHORT_WITH_TIME = "MMM DD, YYYY, h:mm a",
  LONG_WITH_TIME = "MMMM DD, YYYY, h:mm a",
}
