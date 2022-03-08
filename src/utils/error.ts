export class Error400 extends Error {
    constructor(message: string) {
        super(message)
        this.name = "Error400";
    }
}
