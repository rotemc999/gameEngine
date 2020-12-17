/// <reference path="core/engine.ts"/>

var engine: GE.Engine = new GE.Engine();
window.onload = () => {
    engine.start();
};

window.onresize = () => {
    engine.resize();
}