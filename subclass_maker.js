import { input, select } from "@inquirer/prompts";
import fs from "node:fs";
import path from "node:path";

const json = fs.readFileSync(
  path.join(import.meta.dirname, "/Tales_of_Lumeeria_Core Update thread.json"),
  "utf8",
  (err, data) => data
);

let homebrew = JSON.parse(json);

let classes = [
  {
    name: "Artificer",
    source: "tce",
  },
  {
    name: "Barbarian",
    source: "phb",
  },
  {
    name: "Bard",
    source: "phb",
  },
  {
    name: "Cleric",
    source: "phb",
  },
  {
    name: "Druid",
    source: "phb",
  },
  {
    name: "Fighter",
    source: "phb",
  },
  {
    name: "Monk",
    source: "phb",
  },
  {
    name: "Paladin",
    source: "phb",
  },
  {
    name: "Ranger",
    source: "phb",
  },
  {
    name: "Rogue",
    source: "phb",
  },
  {
    name: "Sorcerer",
    source: "phb",
  },
  {
    name: "Warlock",
    source: "phb",
  },
  {
    name: "Wizard",
    source: "phb",
  },
];

let homebrewClasses = homebrew.class.map((x) => {
  const object = {
    name: x.name,
    source: x.source,
  };
  return object;
});

const mergeList = (x, y) => {
  y.forEach((element) => {
    x.push(element);
  });
  return x;
};

classes = mergeList(classes, homebrewClasses);

const mainClass = await select({
  message: "What the main class?",
  choices: classes.map((x) => {
    const object = {
      name: x.name,
      value: x,
    };
    return object;
  }),
  loop: false,
});

const subclassName = await input({ message: "Give your subclass a name:" });

const subclassSource = await select({
  message: "What the source of the subclass?",
  choices: homebrew._meta.sources.map((source) => {
    const object = {
      name: source.full,
      value: source.json,
    };
    return object;
  }),
});
console.log(mainClass);
