module.exports = function(question) {
    return new Promise(resolve => {
        var stdin = process.stdin,
            stdout = process.stdout;
    
        stdin.resume();
        stdout.write(question);
    
        stdin.once("data", function (data) {
            resolve(data.toString().trim());
        });
    });
}