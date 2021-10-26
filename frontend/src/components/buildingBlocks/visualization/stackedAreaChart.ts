import * as d3 from "d3"


export interface Stack {
    data: Array<number>
    color: string
    name: string
}

export class StackedAreaChartConfiguration {
    readonly stacks: Array<Stack>
    /** Data (y values) ordered by x axis first and then by the stack */
    readonly transposedData: Array<Array<number>>

    constructor(stacks: Array<Stack>) {
        if (stacks.length === 0 || !stacks.every(stack => stack.data.length === stacks[0].data.length)) {
            throw Error("Stacks data must have the same length.")
        }
        this.stacks = stacks
        this.transposedData = d3.transpose(this.stacks.map(stack => stack.data))
    }
}
