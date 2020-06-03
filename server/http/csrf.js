var cookies = response.headers.valueOf("Set-Cookie");
if (cookies) {
    cookies = cookies.split(";");
    var token;
    for (var i = 0; i < cookies.length; i++) {
        var pair = cookies[i].split("=");
        if (pair[0].trim() === "XSRF-TOKEN") {
            token = pair[1].trim();
            break;
        }
    }

    if (token) {
        client.log("XSRF Token: " + token);
        client.global.set("csrf", token);
    } else {
        client.log("No XSRF Token");
    }
}
