import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

import type { IProject } from "../types";
import { projectStatuses } from "../utils";

const projectSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 1,
      maxlength: 128,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      minlength: 0,
      maxlength: 512,
      default: "",
    },
    variants: {
      type: Object,
      default: {},
    },
    createdAt: {
      type: Date,
      immutable: true,
    },
    status: {
      type: String,
      enum: projectStatuses,
      default: "created",
    },
  },
  { timestamps: true }
);

projectSchema.plugin(paginate);

export default model<IProject>("Project", projectSchema);
