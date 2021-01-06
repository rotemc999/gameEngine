namespace GE {
    export function fileReader(path: string) {
        let xhttp: XMLHttpRequest = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                xhttp.responseText;
            }
        };
        xhttp.open("GET", path, true);
        xhttp.send();


    }
}