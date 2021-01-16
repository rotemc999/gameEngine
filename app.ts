/// <reference path="core/engine.ts"/>

var engine: GE.Engine;
window.onload = () => {
    engine = new GE.Engine();
    engine.start();
};

window.onresize = () => {
    engine.resize();
}