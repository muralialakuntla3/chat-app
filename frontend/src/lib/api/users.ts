import http from "../http";
import { User } from "../../types/index";
import { handleAPIError } from "../errors";

export async function getUsersList() {
  try {
    const res = await http.get<User[]>("/users");
    return res.data;
  } catch (error) {
    handleAPIError(error);
    return [];
  }
}
