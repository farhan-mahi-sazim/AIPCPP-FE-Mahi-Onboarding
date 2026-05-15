import { ConfigFile } from "@rtk-query/codegen-openapi";

const config: ConfigFile = {
  schemaFile: "http://localhost:3000/swagger-json",
  apiFile: "./shared/redux/rtk-apis/blc/blc.api.ts",
  argSuffix: "Arg",
  apiImport: "blcApi",
  outputFile: "./shared/redux/rtk-apis/blc/blc.types.ts",
  exportName: "blcApi",
  hooks: true,
  responseSuffix: "",
  useEnumType: true,
};

export default config;
