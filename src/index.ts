import { CanvasDrawer } from "./drawer";
import { DrawerActionStorage } from "./drawer-action-storage";

const drawer = new CanvasDrawer(new DrawerActionStorage());
drawer.render();
