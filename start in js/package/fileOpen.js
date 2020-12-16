export function open(filePath) {
    const http = new XMLHttpRequest();
    http.open("GET", filePath);
    http.send();

    let data = `
    {
        "gameObjects": [
            {
                "Name": "test",
                "Tags": "",
                "Enabled": true,
                "Transform": {
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "rotation": 0,
                    "scale": {
                        "x": 1,
                        "y": 1
                    }
                },
                "Components": [],
                "Scripts": [],
                "Childs": []
            }
        ],
        "Settings": {
            "Background": "",
            "Resolusion": ""
        }
    }
    `
    return data;
}