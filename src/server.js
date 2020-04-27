var express = require('express');
var proxy = require('http-proxy-middleware');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey = fs.readFileSync('./secure/server.key', 'utf8');
var certificate = fs.readFileSync('./secure/server.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var httpApp = express();
var app = express();

var httpServer = http.createServer(httpApp);
var httpsServer = https.createServer(credentials, app);

fs.readFile("./env.json", { encoding: 'utf-8' }, function (err, bytesRead) {
    if (err) {
        throw err;
    }
    let config = JSON.parse(bytesRead); 
    let serverCustConfig = {
        absolutePath: process.cwd(),
        serverUrl: config.serverUrl ? config.serverUrl : "http://10.40.143.49:8088",
        httpPort: config.httpPort ? config.httpPort : "8099",
        httpsPort: config.httpsPort ? config.httpsPort : "8443",
        httpRedictPort: config.httpRedictPort
    };
    // let kmsInfo = config.kmsInfo;
    let PORT = serverCustConfig.httpPort;
    let SSLPORT = serverCustConfig.httpsPort;
    let HTTP_REDICT_PORT = serverCustConfig.httpRedictPort;

    httpServer.listen(PORT, function() {
        console.log('HTTP Server is running on: http://localhost:%s', PORT);
    });
    httpsServer.listen(SSLPORT, function() {
        console.log('HTTPS Server is running on: https://localhost:%s', SSLPORT);
    });

    httpApp.get('/*', function(req, res) {
        res.redirect(307, `https://${req.hostname}:${HTTP_REDICT_PORT}${req.url}`);
    });
    app.get('/', function(req, res) {
        res.sendFile(serverCustConfig.absolutePath + "/index.html");
    });
    app.get('/favicon.ico', function(req, res) {
        res.sendFile(serverCustConfig.absolutePath + "/favicon.ico");
    });
    /**
     * 登录KMS
     * @param {*} callback 
     */
    // function loginKMS(callback) {
    //     var bodyString = JSON.stringify({
    //         name: kmsInfo.username,
    //         pwd: kmsInfo.pwd,
    //         requestId: "login_" + new Date().getTime()
    //     });
    //     var loginOptions = {
    //         hostname: kmsInfo.hostname,  
    //         port: kmsInfo.port,
    //         path: '/auth/login',
    //         method: 'POST',
    //         headers: {  
    //             'Content-Type':'application/json; charset=UTF-8',  
    //             'Content-Length': bodyString.length
    //         }
    //     }
    //     var req = http.request(loginOptions, function(res) {  
    //         console.log('Status:', res.statusCode);  
    //         console.log('headers:', JSON.stringify(res.headers));  
    //         res.setEncoding('utf-8');  
    //         res.on('data', function(chun) {
    //             console.log('body分隔线---------------------------------\r\n');  
    //             console.info(chun);
    //             callback(JSON.parse(chun));
    //         }); 
    //         res.on('end', function() {  
    //             console.log('No more data in response.********');  
    //         });
    //     });
    //     req.write(bodyString);
    //     req.end();
    // }
    /**
     * 获取KMS的key
     * @param {*} callback 
     */
    // function getKMSKey(callback) {
    //     loginKMS((data) => {
    //         if (parseInt(data.code) === 200) {
    //             let bodyString = JSON.stringify({
    //                 keyId: kmsInfo.keyname,
    //                 requestId: "getkey_" + new Date().getTime()
    //             });
    //             let loginOptions = {
    //                 hostname: kmsInfo.hostname,  
    //                 port: kmsInfo.port,
    //                 path: '/pki/v1/getkey',
    //                 method: 'POST',
    //                 headers: {  
    //                     'Content-Type':'application/json; charset=UTF-8',  
    //                     'Content-Length': bodyString.length,
    //                     'Authorization': data.token
    //                 }
    //             };
    //             let req = http.request(loginOptions, function(res) {  
    //                 console.log('Status:', res.statusCode);  
    //                 console.log('headers:', JSON.stringify(res.headers));  
    //                 res.setEncoding('utf-8');  
    //                 res.on('data', function(chun) {
    //                     console.log('body分隔线---------------------------------\r\n');  
    //                     console.info(chun);
    //                     let reqObj = JSON.parse(chun);
    //                     callback({
    //                         code: reqObj.code,
    //                         mess: reqObj.message,
    //                         keyId: reqObj.keyId,
    //                         keyMaterial: reqObj.keyMaterial
    //                     });
    //                 }); 
    //                 res.on('end', function() {  
    //                     console.log('No more data in response.********');  
    //                 });
    //             });
    //             req.write(bodyString);
    //             req.end();
    //         } else {
    //             callback({
    //                 code: data.code,
    //                 mess: data.message
    //             });
    //         }
    //     });
    // }
    // app.get('/pki/getKey', function(_req, _res) {
    //     getKMSKey((data) => {
    //         _res.send(data);
    //     });
    // });
    app.use('/dist', express.static(serverCustConfig.absolutePath + "/dist"));
    app.use('/charger/*', proxy({
        target: serverCustConfig.serverUrl,
        secure: false,
        agent: https.Agent({
            hostname: '49.4.5.203',
            port: 8088,
            key: fs.readFileSync('./secure/ca.key'),
            cert: fs.readFileSync('./secure/ca.cert'),
            passphrase: 'LTTRWffMIIXyH6RN',
            // This is necessary only if the server uses the self-signed certificate
            ca: fs.readFileSync('./secure/ca.cert'),
            checkServerIdentity: (servername, cert) => {
                return undefined;
            }
        })
    }));
    // app.listen(serverCustConfig.port);

});
