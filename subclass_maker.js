import { input, select , number, Separator} from "@inquirer/prompts";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from 'url';
import types from "./types.js";
import clipboard from "clipboardy";


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
        name: "Done",
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

let subclassFeatures = []

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

const getLevel = async () => await number({message: "What's the first level of your subclass?"}) 

const getTextParagraph = async () => await input({message: "Write or paste your paragraph WITHOUT TABS!!"});

const getNewHeading = async (former) => {
    const name = await input({message:"Heading title:"})
    const entries = await fillEntries(name, former);
    return {
        type: types.entries,
        name,
        entries,
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

const getList = async (former, subcount) => {
    const items = await fillItems(former, subcount)
    return {
        type: types.list,
        items
    }
}

const fillItems = async (former, subcount) => {
    let name = "list"
    for(let i = 0; i < subcount; i++){
        name = "sub-" + name
    }
    subcount++
    const items = []
    let done = false
    while(!done){
        const item = await select({
            message: `What's your ${name} item`,
            choices: [
                {
                    name: "Text",
                    value: async () => await getTextParagraph()
                },
                {
                    name: "Sublist",
                    value: async () => await getList(name, subcount)
                },
                {
                    name: `Back to ${former}`,
                    value: async () => {
                        done = true;
                    }
                }
            ]
        })
        
        const result = await item()

        if(!done) items.push(result)
    }

    return items
}

const getTable = () => {
    console.log("Work overload, please try again...")
    return ""
}

const fillEntries = async (name, former) => {
    let entries = []
    let done = false;
    while(!done){
        const segment = await select({
            message: `Whats the next paragraph for ${name}`,
            loop: false,
            choices: [
                {
                    name: "Text",
                    value: async () => await getTextParagraph()
                },
                {
                    name: "Heading",
                    value: async () => await getNewHeading(name)
                },
                {
                    name: "List",
                    value: async () => await getList(name, 0),
                },
                {
                    name: "Table",
                    value: async () => await getTable()
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
                    name: former ? `Back to ${former}` : "Done",
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
    const name = isLore ? newSubclass.name : await input({ message: "What's the name of the feature?"})
    const level = isLore ? newSubclass.startingLevel : +(await number({ message: "What's the level?"}))
    const entries = await fillEntries(isLore ? "subclass lore" : name);
    const source = newSubclass.source
    const className = mainClass.name
    const classSource = mainClass.source
    const subclassShortName = newSubclass.shortName
    const subclassSource = newSubclass.source
    const header = isLore ? 1 : 2

    newSubclass.subclassFeatures.push(`${name}|${className}|${classSource}|${subclassShortName}|${subclassSource}|${level}`)

    return {
      name,
      source,
      className,
      classSource,
      subclassShortName,
      subclassSource,
      level,
      header,
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
    startingLevel: +(await getLevel()),
    source: await getSubclassSource(),
    subclassFeatures:[],
    className: mainClass.name,
    classSource: mainClass.source,
}

subclassFeatures.push(await getNewSubclassFeature(true))

while(true){
    console.log("Current features:")
    subclassFeatures.forEach( feature => {
        const isLore = subclassFeatures.indexOf(feature) == 0 ? true : false
        console.log(`- ${isLore ? "Lore" : feature.name}${!isLore ? `(Lvl ${feature.level})` : ""}`)
    })
    const isDone = await select({
        message: "Do you need another feature?",
        choices: [
            {
                name: "Yes",
                value: false
            },
            {
                name:"No",
                value: true
            }
        ]
    }) 
    if(isDone) break;
    subclassFeatures.push(await getNewSubclassFeature(false))
}

homebrew.subclass.push(newSubclass)
homebrew.subclassFeature = mergeList(homebrew.subclassFeature, subclassFeatures)

const updatedHomebrew = JSON.stringify(homebrew, null, 2);

clipboard.writeSync(updatedHomebrew)
