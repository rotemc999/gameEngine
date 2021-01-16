namespace GE {
    export function fileReader(path: string, callback: Function, name: string) {
        let request: XMLHttpRequest = new XMLHttpRequest();
        request.open("GET", path);
        request.addEventListener("load", () => {
            callback(request.responseText, name);
        })
        request.send();
    }
}