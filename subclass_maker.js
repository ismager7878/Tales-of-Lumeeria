import { input, select , Separator} from "@inquirer/prompts";
import { getRandomValues } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url';
import types from "./types.js"


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const json = fs.readFileSync(
  path.join(__dirname, "Tales_of_Lumeeria_Core Update thread.json")
);

let homebrew = JSON.parse(json);

const attributesList = [
    {
        name: "Charisma",
        value: "car"
    },
    {
        name: "Strenght",
        value: "str"
    },
    {
        name: "Dexteriy",
        value: "dex"
    },
    {
        name: "Inteligence",
        value: "int"
    },
    {
        name: "Wisdom",
        value: "wis"
    },
    {
        name: "End",
        value: null
    }
]

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

const homebrewClasses = homebrew.class.map((x) => {
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

const getSubclassName = async () => await input({ message: "Give your subclass a name:" });

const getSubclassShortName = async (defaultName) => await input({ 
        message: "Do you need a short name(Name shown in subclass menu)? Leave empty if no:)",
        default: defaultName,
    });

const getSubclassSource = async () => await select({
        message: "What the source of the subclass?",
        choices: homebrew._meta.sources.map((source) => {
          const object = {
            name: source.full,
            value: source.json,
          };
          return object;
        }),
    });

const getTextParagraph = async () => await input({message: "Write or paste your paragraph WITHOUT TABS!!"});

const getNewHeading = async () => {
    return {
        type: types.entries,
        name: await input({message:"Heading title:"}),
        entries: await fillEntries()
    }
}
const fillAttributes = async () => {
    let attributes = []
    while(true) {
        const attribute = await select({
            message: "Select an atribute",
            loop: false,
            choices: attributesList,
        })
        if (!attribute) break;
        attributes.push(attribute);
    }
    return attributes
} 

const getAttackModifier = async () => {
    return {
        type: types.abilityAttackMod,  
        name: await input({message: "Name of the attack modifer:"}),
        attributes: await fillAttributes()
    }
}

const getDCModifier = async () => {
    return {
        type: types.abilityDc,  
        name: await input({message: "Name of the DC modifer:"}),
        attributes: await fillAttributes()
    }
}
const fillEntries = async () => {
    let entries = []
    let done = false;
    while(!done){
        const segment = await select({
            message: "What's your next paragraph?",
            loop: false,
            choices: [
                {
                    name: "Text",
                    value: async () => await getTextParagraph()
                },
                {
                    name: "Heading",
                    value: async () => await getNewHeading()
                },
                {
                    name: "Ability Attack modifer",
                    value: async () => await getAttackModifier()
                },
                {
                    name: "Ability DC modifer",
                    value: async () => await getDCModifier()
                },
                {
                    name: "Done",
                    value: () => {
                        done = true
                    },
                }
            ]
        })
        const result = await segment()

        if (result) entries.push(result)
    }
    return entries;
}

const getNewSubclassFeature = async (isLore) => {
    const name = await input({ message: "What's the name of the feature?"})
    const level = +(await input({ message: "What's the level?"}))
    const entries = await fillEntries();
    return {
      name,
      source: newSubclass.source,
      className: mainClass.name,
      classSource: mainClass.source,
      subclassShortName: newSubclass.shortName,
      subclassSource: newSubclass.source,
      level,
      header: isLore ? 1 : 2,
      entries 
    }
}
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

const subClassName = await getSubclassName()

let newSubclass = {
    name: subClassName,
    shortName: await getSubclassShortName(subClassName),
    source: await getSubclassSource(),
    subclassFeatures:[],
    className: mainClass.name,
    classSource: mainClass.source,
}

newSubclass.subclassFeatures.push(await getNewSubclassFeature(false))

const prettyJson = JSON.stringify(newSubclass, null, 2);
console.log(prettyJson);
