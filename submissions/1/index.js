const randomOutput = (inArr) => {
    const rnd = Math.random()
    let s = 0
    for (const item of inArr) {
        if (s + item.probability >= rnd) {
            return item
        }
        s = s + item.probability
    }
}

const projects = [
    { id: 1, name: 'Option 1', probability: 0.3 },
    { id: 2, name: 'Option 2', probability: 0.5 },
    { id: 3, name: 'Option 3', probability: 0.15 },
    { id: 4, name: 'Option 4', probability: 0.05 }
]

const len = projects.length
let totalNumbers = new Map();
for (let i = 0; i < 500; i++) {
    const out = randomOutput(projects);
    console.log(out.name)
    const value = totalNumbers.get(out.id);
    if (value) {
        totalNumbers.set(out.id, value + 1)
    } else {
        totalNumbers.set(out.id, 1)
    }
}

let result = ''
for (let i = 0; i < len; i++) {
    if (i > 0) {
        result = result + ', '
    }
    result = result + `ID ${projects[i].id} = ${totalNumbers.get(projects[i].id)}`
}

console.log(result);