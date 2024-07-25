
import select, { Separator } from '@inquirer/select'

const classes = [
    "Teddy",
    "Fighter",
    "Darth Vader"
]

const mainClass = await select({
    message: "Choose your Main Class",
    choices: classes.map( x => {
        const temp = {
            name: x,
            value: `${x} value`,
        }
        return temp
    })
})
console.log(mainClass)