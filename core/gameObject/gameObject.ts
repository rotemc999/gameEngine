namespace GE {
    export class GameObject {
        private _transform: Transform = new Transform();
        private _name: string;
        private _children: GameObject[] = [];
        private _parent: GameObject | undefined;
        private _scene: Scene;
        private _components: Component[];
        public enabled: boolean = true;
        public constructor(name: string, scene?: Scene) {
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

        public addChild(child: GameObject): void {
            // bug: can make a child of 2 parents
            child._parent = this;
            this._children.push(child);
        }
        public removeChild(child: GameObject): void {
            let childIndex = this._children.indexOf(child);
            if (!(childIndex === -1)) {
                child._parent = undefined;
                this._children.splice(childIndex, 1);
            }
        }

        public find(name: string): GameObject | undefined {
            for (let i: number = 0; i < this._children.length; i++) {
                if (this._children[i].name === name) {
                    return this._children[i];
                }
            }
        }

        public start(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].start();
            }
            for (let i = 0; i < this._children.length; i++) {
                this._children[i].start();
            }
        }

        public update(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].update();
            }
            for (let i: number = 0; i < this._children.length; i++) {
                this._children[i].update();
            }
        }

        public render(shader: Shader): void {
            if (!this.enabled) { return; }
            for (let i: number = 0; i < this._children.length; i++) {
                this._children[i].render(shader);
            }
        }
    }
}