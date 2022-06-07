import type { IProject, IExternalProject, TProjectPage } from "../types";
import { runAsTransaction, BadRequestError, NotFoundError } from "../utils";
import { ProjectModel } from "../models";
import * as constants from "../utils/constants";

import joi from "joi";
import { Types } from "mongoose";

const createSchema = joi
  .object({
    name: joi.string().min(1).max(128).trim().required(),
    description: joi.string().min(0).max(512).allow("").default(""),
    variants: joi
      .object()
      .pattern(
        /.{1,128}/,
        joi.object().pattern(/.{1,}/, joi.string().allow(""))
      ),
  })
  .unknown(false);

const updateVariantSchema = joi
  .object({
    name: joi.string().min(1).max(128).trim().required(),
    variant: joi.string().min(1).max(128).trim().required(),
    values: joi.object().pattern(/.{1,}/, joi.string().allow("")).default({}),
  })
  .unknown(false);

const toExternal = (project: IProject): IExternalProject => {
  const { _id, name, description, variants, createdAt, updatedAt } = project;

  return {
    id: _id.toString(),
    name,
    description,
    variants,
    createdAt,
    updatedAt,
  };
};

export const create = async (
  context: any,
  attributes: any
): Promise<IExternalProject> => {
  const { error, value } = createSchema.validate(attributes, {
    stripUnknown: true,
  });
  if (error) {
    throw new BadRequestError(error.message);
  }

  const newProject = await runAsTransaction(async (session) => {
    const newProjectId = new Types.ObjectId();

    const existingProject = await ProjectModel.findOne({
      name: value.name,
      status: { $ne: "delete" },
    }).exec();
    if (existingProject) {
      throw new BadRequestError(
        `A project with the name "${value.name}" already exists.`
      );
    }

    const newProject = new ProjectModel({
      ...value,
      _id: newProjectId,
      status: "created",
    });
    await newProject.save({ session });

    return newProject;
  });

  return toExternal(newProject);
};

export const getByName = async (
  context: any,
  name: string
): Promise<IExternalProject> => {
  if (!constants.namePattern.test(name)) {
    throw new BadRequestError(
      `The specified project name "${name}" is invalid.`
    );
  }

  const project = await ProjectModel.findOne(
    {
      name,
      status: { $ne: "deleted" },
    },
    null,
    { lean: true }
  ).exec();

  /* We return a 404 error, if we did not find the entity. */
  if (!project) {
    throw new NotFoundError(
      `Cannot find a project with the specified name "${name}".`
    );
  }

  return toExternal(project);
};

export const updateVariant = async (context: any, attributes: any) => {
  const { error, value } = updateVariantSchema.validate(attributes);
  if (error) {
    throw new BadRequestError(error.message);
  }

  const updatedProject = await runAsTransaction(async () => {
    const patch = Object.fromEntries(
      Object.entries(value.values).map((entry) => [
        `variants.${value.variant}.${entry[0]}`,
        entry[1],
      ])
    );

    const updatedProject = await ProjectModel.findOneAndUpdate(
      {
        name: value.name,
        status: { $ne: "deleted" },
      },
      {
        $set: patch,
      },
      { new: true, lean: true }
    ).exec();

    if (!updatedProject) {
      throw new NotFoundError(
        `Cannot find a project with the specified name "${value.name}".`
      );
    }

    return updatedProject;
  });

  return toExternal(updatedProject);
};
