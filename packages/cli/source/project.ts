import axios from "axios";
import { API_URL } from "./utils/constants";

export const createProject = async (name: string, description: string) => {
  try {
    const response = await axios.post(`${API_URL}/projects`, {
      name,
      description,
      variants: {},
    });
    return response.data;
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

const parseVariantHandle = (handle: string) => {
  const [project, variant] = handle.split(":");
  return { project, variant };
};

export const setVariables = async (handle: string, variables: string[]) => {
  try {
    const { project, variant } = parseVariantHandle(handle);
    const response = await axios.post(
      `${API_URL}/projects/${project}/variants/${variant}`,
      Object.fromEntries(variables.map((variable) => variable.split("=")))
    );
    return response.data;
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export const getVariables = async (
  handle: string,
  format: "pairs" | "json" | "yaml"
) => {
  try {
    const { project, variant } = parseVariantHandle(handle);
    const response = await axios.get(`${API_URL}/projects/${project}`);

    const values = response.data.variants[variant] ?? {};

    switch (format) {
      case "pairs": {
        return Object.entries(values)
          .map((entry) => `${entry[0]}=${entry[1]}`)
          .join("\n");
      }

      case "json": {
        return JSON.stringify(values);
      }

      default: {
        throw new Error(`Unknown format "${format}"`);
      }
    }
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
