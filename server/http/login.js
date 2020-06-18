client.test("status 200", function () {
    client.assert(response.status === 200, "status is 200");
});

client.global.set("token", "Bearer " + response.body);
