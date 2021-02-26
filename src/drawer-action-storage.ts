type DrawerActionCoordinate = {
    type: "setCoordinate";
    x: number;
    y: number;
};

type DrawerActionMouseUp = {
    type: "mouseUp";
};

type DrawerAction = DrawerActionCoordinate | DrawerActionMouseUp;

const KEY = "drawActions";

export class DrawerActionStorage {
    private _actions: DrawerAction[] = [];

    get actions(): DrawerAction[] {
        return [...this._actions];
    }

    add(action: DrawerAction): void {
        this._actions.push(action);
    }

    save(): void {
        localStorage.setItem(KEY, JSON.stringify(this._actions));
    }

    load(): void {
        try {
            const data = localStorage.getItem(KEY);
            this._actions = data === null ? [] : JSON.parse(data);
        } catch {
            this._actions = [];
        }
    }
}
