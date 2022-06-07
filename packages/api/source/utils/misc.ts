import mongoose from "mongoose";
import type { ClientSession } from "mongoose";

export type TTransactionCallback<T> = (session: ClientSession) => Promise<T>;

export const runAsTransaction = async <T>(
  callback: TTransactionCallback<T>
): Promise<T> => {
  const session = await mongoose.startSession();
  let result: any;
  await session.withTransaction(async (client: ClientSession) => {
    result = await callback(client);
  });
  return result;
};
