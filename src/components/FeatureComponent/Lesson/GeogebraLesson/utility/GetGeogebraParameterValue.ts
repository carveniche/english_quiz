export function getAppletDetails(material_id:string){
    var api_request = {
        request: {
            "-api": "1.0.0",
            login: { "-type": "cookie", "-getuserinfo": "true" },
            task: {
                "-type": "fetch",
                fields: {
                    field: [{ "-name": "width" }, { "-name": "height" }],
                },
                filters: {
                    field: [
                        { "-name": "id", "#text": "" + material_id + "" },
                    ],
                },
                order: { "-by": "id", "-type": "asc" },
                limit: { "-num": "1" },
            },
        },
    }
    return fetch("http://www.geogebra.org/api/json.php", {
        method: "POST",
        body: JSON.stringify(api_request)
    })  
    
}