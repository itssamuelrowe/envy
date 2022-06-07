import chalk from "chalk";
import { Command } from "commander";

import packageData from "../package.json";

import { createProject, setVariables, getVariables } from "./project";

const create = async (configuration: any): Promise<void> => {
  const result = await createProject(
    configuration.name,
    configuration.template
  );
  console.log(result);
};

const add = async (configuration: any): Promise<void> => {
  const result = await setVariables(
    configuration.handle,
    configuration.variables
  );
  console.log(result);
};

const get = async (configuration: any): Promise<void> => {
  const result = await getVariables(configuration.handle, configuration.format);
  console.log(result);
};

const configureCommands = (): Command => {
  const program = new Command();
  program.version(packageData.version);

  const createCommand = new Command();
  createCommand
    .name("create")
    .alias("c")
    .description("create new project")
    .argument("<name>", "name of the new project")
    .option("-d, --description <text>", "the description of the app", "")
    .action((name) => {
      const configuration = {
        ...program.opts(),
        ...createCommand.opts(),
        name,
      };
      create(configuration);
    });
  program.addCommand(createCommand);

  const setCommand = new Command();
  setCommand
    .name("set")
    .alias("s")
    .description("sets variables in variant")
    .argument(
      "<handle>",
      "handle pointing to variant (for example, hypertool:development)"
    )
    .argument(
      "<variables...>",
      "variables to store (key1=value1 key2=value2 ...)"
    )
    .action((handle, variables) => {
      const configuration = {
        ...program.opts(),
        ...setCommand.opts(),
        handle,
        variables,
      };
      add(configuration);
    });
  program.addCommand(setCommand);

  const getCommand = new Command();
  getCommand
    .name("get")
    .alias("g")
    .description("get variables from variant")
    .argument(
      "<handle>",
      "handle pointing to variant (for example, hypertool:development)"
    )
    .option("-f|--format <pairs|json|yaml>", "format of the output", "pairs")
    .action((handle, variables) => {
      const configuration = {
        ...program.opts(),
        ...getCommand.opts(),
        handle,
        variables,
      };
      get(configuration);
    });
  program.addCommand(getCommand);

  return program;
};

const main = (): void => {
  console.log(
    chalk.bold(
      `envy v${packageData.version} ${chalk.greenBright(
        "(https://github.com/itssamuelrowe/envy)"
      )}\n`
    )
  );
  const program = configureCommands();
  program.parse(process.argv);
};

export { main };
