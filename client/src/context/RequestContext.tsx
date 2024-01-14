import { createContext, useContext, useState } from "react";

export const RequestContext = createContext<any>("");

export function useRequests() {
  return useContext(RequestContext);
}
