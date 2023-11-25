export enum ENUM_USER_ROLE {
  SUPER_ADMIN = "superAdmin",
  ADMIN = "admin",
}

export const userFilterableFields: string[] = ["search", "role"];

export const userSearchableFields: string[] = ["name", "email", "contact"];
