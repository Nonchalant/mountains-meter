export class Mountain {
    constructor(private _id: number, private _name: string, private _area: string, private _height: number) {}

    public get id(): number {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get area(): string {
        return this._area;
    }

    public get height(): number {
        return this._height;
    }
}