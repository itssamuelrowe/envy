import mongoose from "mongoose";

type ObjectId = mongoose.Types.ObjectId;

export interface IExternalListPage<T> {
  totalRecords: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  hasPreviousPage: number;
  hasNextPage: number;
  records: T[];
}

export interface IProject {
  _id: ObjectId;
  name: string;
  description: string;
  variants: Record<string, Record<string, string>>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExternalProject {
  id: string;
  name: string;
  description: string;
  variants: Record<string, Record<string, string>>;
  createdAt: Date;
  updatedAt: Date;
}

export type TProjectPage = IExternalListPage<IExternalProject>;
