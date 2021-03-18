namespace GE {
    /**
     * 
     */
    export class GameObject {
        private _transform: Transform = new Transform();
        private _name: string;
        private _parent: GameObject | undefined;
        private _scene: Scene;
        private _components: Component[] = [];
        private _enabled: boolean = true;
        public constructor(name: string, scene?: Scene) {
            this._transform = new Transform()
            this._name = name;
            this._scene = scene as Scene;
        }
        /**
         * the transform of the object that contains the position, rotation and scale
         */
        public get transform(): Transform {
            return this._transform;
        }
        /**
         * the name of the object
         */
        public get name(): string {
            return this._name;
        }
        /**
         * the parent game object
         */
        public get parent(): GameObject | undefined {
            return this._parent;
        }
        /**
         * the scene that the object is located in
         */
        public get scene(): Scene{
            return this._scene;
        }

        /**
         * add a component to the game object
         * @param component 
         */
        public addComponent(component: Component): void {
            this._components.push(component);
        }

        /**
         * start all of the object's component
         */
        public start(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].start();
            }
        }

        /**
         * updates the components
         */
        public update(): void {
            if (!this.enabled) { return; }
            for (let i = 0; i < this._components.length; i++) {
                this._components[i].update();
            }
        }

        public getComponent(name: string): Component | undefined{
            for(let i =0; i< this._components.length; i++){
                if(this._components[i].name === name){
                    return this._components[i];
                }
            }
            return undefined;
        }


        public get enabled(): boolean{
            return this._enabled;
        }
        public set enabled(state: boolean){
            this._enabled = state;
            for(let i = 0; i< this._components.length; i++){
                this._components[i].onEnable();
            }
        }
    }
}