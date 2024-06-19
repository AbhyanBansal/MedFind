var express = require("express");
var fileuploader = require("express-fileupload");
var mysql = require("mysql2");
var app = express();


//========APP.USE WALE ===========================

app.use(express.static("public"));
app.use(fileuploader());


//===============FUNCTIONS======================

app.listen(2898, function () {
    console.log("server started");

})
//====================================DB connect=================================
var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "heloab",
    database: "mydatabase",
    dateStrings: true

}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("Connected Successfulllyyy...");
    else
        console.log(jasoos);
})
//====================helo insert plz info========================================
app.get("/insert-info-signup", function (req, resp) {

    dbCon.query("insert into user(email,pwd,type,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchemail, req.query.kuchpwd, req.query.kuchtype,], function (err) {
        if (err == null)
            resp.send("SignUp Successful");
        else
            resp.send(err);
    })
})

//========================helo check email=========================================

app.get("/chk-email", function (req, resp) {

    dbCon.query("select * from user where email=?", [req.query.kuchemail], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length == 1) {
                resp.send("Email id already taken");
            }
            else {

                resp.send("Email Available");
            }
        }
        else {
            resp.send(err);
        }
    })
})
//===================login wala search==================== 
app.get("/search-info-login", function (req, resp) {

    dbCon.query("select * from user where email=? and pwd=?", [req.query.email, req.query.password], function (err, resutltablejason) {

        if (err == null) {
            if (resutltablejason.length == 1) {
                if (resutltablejason[0].status == 0) {
                    resp.send("you have been blocked by the admin");
                }
                else {
                    resp.send(resutltablejason[0].type);
                }
            }
        }
        else
            resp.send(err);
    })
})
//==================update password setting================
app.get("/update-info-settings", function (req, resp) {

    dbCon.query("select * from user where email=?", [req.query.kuchemail], function (err, resultTableJSON) {
        if (err == null) {
            if (resultTableJSON.length == 1) {
                if (req.query.kucholdpwd == req.query.kuchnewpwd) {
                    resp.send("Password unchanged");
                }
                else if (req.query.kuchnewpwd != req.query.kuchconpwd) {
                    resp.send("Passwords do not match");
                }
                else {
                    dbCon.query("update user set pwd=? where email=?", [req.query.kuchnewpwd, req.query.kuchemail], function (er) {
                        if (er == null) {
                            resp.send("record updated");
                        }
                        else {
                            resp.send(er);
                        }
                    })
                }
            }
        }
        else
            resp.send(err);
    })

})
//=====helo email check setting=================================================================================
app.get("/chk-email-update-pwd", function (req, resp) {

    dbCon.query("select * from user where email=?", [req.query.kuchemail], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length == 1) {
                resp.send("Verified");
            }
            else {

                resp.send("Invalid EmailId");
            }
        }
        else {
            resp.send(err);
        }
    })
})

//===========save donor profile=======================
app.post("/save-donor-profile", function (req, resp) {

    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.pPic.mv(path);
    }
    var ahours=req.body.avail1 + " to " + req.body.avail2;

    dbCon.query("insert into donors(email,name,mobile,address,city,proof,pic,ahours) values(?,?,?,?,?,?,?,?)", [req.body.email, req.body.name, req.body.Mobile, req.body.Address, req.body.txtCity, req.body.txtidtype, filename,ahours], function (err) {
        if (err == null) {

            resp.send("saved successfully");
        }
        else {
            resp.send(err);
        }
    })

})

//===========save available medicines=======================
app.get("/save-medicines-avail", function (req, resp) {

    dbCon.query("insert into availmeds(email,med,expdate,packing,qty) values(?,?,?,?,?)", [req.query.email, req.query.medname, req.query.exp, req.query.type, req.query.quan], function(err) {
        if (err == null) {

            resp.send("saved successfully");
        }
        else {
            resp.send(err);
        }
    })

})
//================needy profile==========================
app.post("/save-needy-profile", function (req, resp) {

    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.pPic.name;
        var path = process.cwd() + "/public/uploads/" + filename;
        req.files.pPic.mv(path);
    }
    //var ahours=req.body.avail1 +" " + "to" +" " + req.body.avail2;

    dbCon.query("insert into needy(email,name,mobile,dob,gender,city,address,pic) values(?,?,?,?,?,?,?,?)", [req.body.email, req.body.name, req.body.Mobile, req.body.dob,req.body.txtGender ,req.body.txtCity, req.body.Address, filename], function (err) {
        if (err == null) {

            resp.send("saved successfully");
        }
        else {
            resp.send(err);
        }
    })

})
//========================search donor profile==========================
app.get("/get-json-record-search-donor",function(req,resp){

    dbCon.query("select * from donors where email=?",[req.query.kuemail],function(err,resultTableJSON){

        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//========================search needy profile==========================
app.get("/get-json-record-search-needy",function(req,resp){

    dbCon.query("select * from needy where email=?",[req.query.kuemail],function(err,resultTableJSON){

        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

//===========================UPDATE DONOR profile============================
app.post("/update-donor-profile",function(req,resp)
{

    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }
      
      var ahours= req.body.avail1+" to "+req.body.avail2;

    dbCon.query("update donors set name=?,mobile=?,address=?,city=?,proof=?,pic=?,ahours=? where email=?", [req.body.name, req.body.Mobile, req.body.Address, req.body.txtCity, req.body.txtidtype,idpicname,ahours,req.body.email], function (err) {
        
        if (err == null){
            resp.send("Profile Updated");
        }
        else
        {
            resp.send(err);
        }
    })
})

//=========================update needy profile=========================
app.post("/update-needy-profile",function(req,resp)
{

    var idpicname="nopic.jpg";
    if(req.files!=null)
      {
        idpicname=req.files.pPic.name;
        var path=process.cwd()+"/public/uploads/"+idpicname;
        req.files.pPic.mv(path);        
      }
      

    dbCon.query("update needy set name=?,mobile=?,dob=?,gender=?,city=?,address=?,pic=? where email=?", [req.body.name, req.body.Mobile, req.body.dob, req.body.txtGender, req.body.txtCity,req.body.Address,idpicname,req.body.email], function (err) {
        
        if (err == null){
            resp.send("Profile Updated");
        }
        else
        {
            resp.send(err);
        }
    })
})

//================================================ADMIN WALA KAAMMMMMM===============================================================================================

//====================================================ALL USERSSSSS========================================================================================================
//==================ADMIN FETCH RECORDS============================================================================================================
app.get("/get-angular-all-records",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select * from user",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========BLOCK-PROFILE=========================================================================================================================
app.get("/do-block-account",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("update user set status=0 where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Account Blocked Successfully!!");
          }
            else
          resp.send(err);
    })
})
//===========RESUME-PROFILE=========================================================================================================================
app.get("/do-resume-account",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("update user set status=1 where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Account Resumed Successfully!!");
          }
            else
          resp.send(err);
    })
})

//====================DONORS WALA ADMIN PAGE==============================================================================================================
//=================FETCH-DONOR- RECORDS============================================================================================================
app.get("/fetch-all-donors",function(req,resp)
{ 
        
    dbCon.query("select * from donors",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========DELETE-PROFILE=========================================================================================================================
app.get("/do-dlock-account-donor",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("delete from donors where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Profile Deleted Successfully!!");
          }
            else
          resp.send(err);
    })
})

//====================NEEEDYYYYYYYYYYY WALA ADMIN PAGE==============================================================================================================
//=================FETCH-NEEDY- RECORDS============================================================================================================
app.get("/fetch-all-needy",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select * from needy",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//===========DELETE-PROFILE-needy=========================================================================================================================
app.get("/do-dlock-account-needy",function(req,resp)
{
    var emailk=req.query.emailk;

    dbCon.query("delete from needy where email=?",[emailk], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Inavlid Email id");
          else
          resp.send("Profile Deleted Successfully!!");
          }
            else
          resp.send(err);
    })
})

//=================FETCH-DONOR-AVAIL-MEDS============================================================================================================
app.get("/fetch-avail-meds",function(req,resp)
{ 
        
    dbCon.query("select * from availmeds where email=?",[req.query.email],function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})


//===========DELETE-AVAIL-MEDS===============================================================
app.get("/delete-avail-meds",function(req,resp)
{
    var srno=req.query.srno;

    dbCon.query("delete from availmeds where srno=?",[srno], function (err,result) {
        
        if(err==null)
        {
          if(result.affectedRows==0)
          resp.send("Medicine Not Deleted");
          else
          resp.send("Medicine Deleted Successfully!!");
          }
            else
          resp.send(err);
    })
})
//=======================MEDMANAGER CHECK EMAIL==========================================
app.get("/chk-email-medmanager", function (req, resp) {

    dbCon.query("select * from availmeds where email=?", [req.query.kuchemail], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length >= 1) {
                resp.send("Verified");
            }
            else {

                resp.send("No Meds Available");
            }
        }
        else {
            resp.send(err);
        }
    })
})

//==================FIND MED FETCH CITY RECORDS============================================================================================================
app.get("/get-angular-all-city",function(req,resp)
{ 
         //fixed                             //same seq. as in table
         //console.log(req.query.email);
    dbCon.query("select distinct city from donors",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
//=========================FIND MED FETCH MEDINICES============================================
app.get("/get-angular-all-Med",function(req,resp)
{ 
         //fixed                             //same seq. as in table
    dbCon.query("select distinct med from availmeds",function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})

//========================FIND MED ALL DATA FETCH============================================================================================================
app.get("/get-angular-all-Required-Records",function(req,resp)
{ 

    var med=req.query.medname;
    var city=req.query.cityname;

    dbCon.query("select donors.name,donors.email,donors.ahours,donors.mobile,donors.address,donors.city,donors.proof,donors.pic,availmeds.med from donors inner join availmeds on donors.email=availmeds .email where med=? and city=?",[med,city],function(err,resultTableJSON)
    {
        if(err==null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})