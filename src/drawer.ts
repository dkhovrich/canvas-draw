import { DrawerActionStorage } from "./drawer-action-storage";

function createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";

    return canvas;
}

const enum KeyCodes {
    Save = "KeyS",
    Replay = "KeyR",
    Clear = "KeyC"
}

export class CanvasDrawer {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private isMouseDown = false;
    private lineWidth = 20;

    constructor(private readonly storage: DrawerActionStorage) {
        this.canvas = createCanvas();
        this.ctx = this.canvas.getContext("2d")!;
    }

    render() {
        this.configure();
        document.body.appendChild(this.canvas);
    }

    private configure(): void {
        const { ctx, canvas } = this;

        ctx.lineWidth = this.lineWidth;

        canvas.addEventListener("mousedown", () => {
            this.isMouseDown = true;
        });

        canvas.addEventListener("mouseup", () => {
            this.isMouseDown = false;
            ctx.beginPath();
            this.storage.add({ type: "mouseUp" });
        });

        canvas.addEventListener("mousemove", (e) => {
            if (this.isMouseDown) {
                const { clientX: x, clientY: y } = e;

                this.storage.add({ type: "setCoordinate", x, y });
                this.draw(x, y);
            }
        });

        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case KeyCodes.Save: {
                    this.storage.save();
                    break;
                }
                case KeyCodes.Replay: {
                    this.storage.load();
                    this.clear();
                    this.replay();
                    break;
                }
                case KeyCodes.Clear: {
                    this.clear();
                    break;
                }
                default:
                    break;
            }
        });
    }

    private draw(x: number, y: number): void {
        const { ctx } = this;

        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, this.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    private clear(): void {
        const { ctx, canvas } = this;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.fillStyle = "black";
    }

    private replay(): void {
        const { actions } = this.storage;

        const timer = setInterval(() => {
            if (!actions.length) {
                clearInterval(timer);
                this.ctx.beginPath();
                return;
            }

            const action = actions.shift();
            if (action === undefined) {
                clearInterval(timer);
                return;
            }

            switch (action.type) {
                case "setCoordinate":
                    this.draw(action.x, action.y);
                    break;
                case "mouseUp":
                    this.ctx.beginPath();
                    break;
                default:
                    break;
            }
        }, 30);
    }
}
