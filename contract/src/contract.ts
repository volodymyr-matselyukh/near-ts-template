import { NearBindgen, near, call, view, initialize } from 'near-sdk-js';

@NearBindgen({})
class Contract {
    value: number;

    constructor() {
        this.value = 0;
    }

    @view({})
    get_value() {
        return this.value;
    }

    @call({})
    increment() {
        near.log(`incrementing by ${near.predecessorAccountId()}`);
        this.value += 1;
    }

    @call({})
    decrement() {
        near.log(`decrementing by ${near.predecessorAccountId()}`);

        if (this.value <= 0) {
            throw new Error("Nothing to decrement");
        }

        this.value -= 1;
    }

    @call({ payableFunction: true })
    cheat_with_money() {
        near.log(`cheating by ${near.predecessorAccountId()} with ${near.attachedDeposit()}`);
        this.value += 10;
    }

    @call({ privateFunction: true })
    reset_counter() {
        near.log(`resetting counter`);
        this.value = 0;
    }
}