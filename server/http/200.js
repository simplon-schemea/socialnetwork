client.test("should return status 200", function () {
    client.assert(response.status === 200, "expected status to be 200 but was " + response.status);
});
