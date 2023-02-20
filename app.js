const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
const firstName=req.body.fname;
const lastName=req.body.sname;
const email=req.body.email;

const data = {
    members: [
        //an array of objs
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }
    ]
};

const jsonData = JSON.stringify(data);

const url = "https://us21.api.mailchimp.com/3.0/lists/{Your_Audience_ID}";
    const options = {
        //JS Obj
        method: "POST",
        auth: "puneet:{Your-API_Key}"
    };
    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });
 
    request.write(jsonData);
    request.end();

//console.log(firstName,secondName,email);
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Server is running on 3000 port");
});
