var http=require('http');
var fs=require('fs');
var path=require('path');
var qs=require('querystring');
var url=require('url');

var server=http.createServer(handleRequest);
server.listen(5000,()=>console.log('Serever listening on port 5000'));

function handleRequest(request,response){
    
    var store="";
    request.on('data',(chunk)=>{
        store=store+chunk;
    });

    request.on('end',()=>{

        var parsedUrl=url.parse(request.url,true);
        var pathname=parsedUrl.pathname;

        console.log(request.url);
        var dirPath=path.join(__dirname,'..');

        if(request.method==='GET' && request.url==='/'){
            response.setHeader('Content-type','text/html');
            response.statusCode=201;
            fs.createReadStream('./index.html').pipe(response);
        }

        else if(request.method==='GET' && request.url==='/about'){
            response.setHeader('Content-type','text/html');
            response.statusCode=201;
            fs.createReadStream('./about.html').pipe(response);
        }

        else if(request.method==='GET' && request.url==='/contact'){
            response.setHeader('Content-type','text/html');
            response.statusCode=201;
            fs.createReadStream('./contact.html').pipe(response);
        }
        
        else if(request.url.split('.').pop()==='css'){
            console.log('CSS Called');
            response.setHeader('Content-type','text/css');
            response.statusCode=201;
            fs.createReadStream(dirPath+request.url).pipe(response);
        }

        else if(request.url.split('.').pop()==='jpeg' || request.url.split('.').pop()==='png'){
            console.log('CSS Called');
            response.setHeader('Content-type','image/jpeg');
            response.statusCode=201;
            fs.createReadStream(dirPath+request.url).pipe(response);
        }
        else if(request.method==='POST' && request.url==='/form'){
            console.log(`${dirPath}/block-BNaaep/contacts${username}.json`);
            var parsedData=qs.parse(store);
            var username=qs.parse(store).username;
            fs.open(`${dirPath}/block-BNaaep/contacts/${username}.json`,'wx',(err,fd)=>{
                if(err){
                    throw err;
                }
                else{
                    fs.writeFile(fd,JSON.stringify(parsedData),(err)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            console.log('File Written');
                            fs.close(fd,(err)=>{
                                response.end(`Contact Saved`);
                            })
                        }
                    })
                }
            })
        }
        else if(pathname==='/users' && request.method==='GET'){
            console.log('from users');
            var userToDisplay=parsedUrl.query.username;
            fs.createReadStream(`${dirPath}/block-BNaaep/contacts/${userToDisplay}.json`).pipe(response);
        }
       
        

    })
}