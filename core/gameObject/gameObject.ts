namespace GE {
    export class GameObject {
        private _transform: Transform = new Transform();
        private _name: string;
        private _parent: GameObject | undefined;
        private _scene: Scene;
        private _components: Component[] = [];
        public enabled: boolean = true;
        public constructor(name: string, scene?: Scene) {
            this._transform = new Transform()
            this._name = name;
            this._scene = scene as Scene;
        }

        public get transform(): Transform {
            return this._transform;
        }

        public get name(): string {
            return this._name;
        }

        public get parent(): GameObject | undefined {
            return this._parent;
        }

        public get scene(): Scene{
            return this._scene;
        }


        public addComponent(component: Component): void {
            this._components.push(component);
        }

        public start(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].start();
            }
        }

        public update(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].update();
            }
        }

        public render(shader: Shader): void {
            if (!this.enabled) { return; }
            this._components[0].render(shader);
        }
    }
}