
const AWS = require('aws-sdk');
const Busboy = require('busboy');
const { LexRuntime } = require('aws-sdk');
let uuid = require("uuid").v4;

const BUCKET_NAME = "constro-images";
const IAM_USER_KEY = "AKIA4EDSFBY337IGTEI3";
const IAM_USER_SECRET = "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";

let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  });


  module.exports = function (router) {

    router.post('/uploadFileToS3', function (req, res) {
  
      try {
        console.log("-------------- Upload_Single_Imgs_To_S3 called ----------------");
  
        if (req.files.url === undefined) {
          res.json({ statuscode: 500, success: true, message: "No image provided to upload" });
        }
        console.log("1");
        var busboy = new Busboy({ headers: req.headers });
        // The file upload has completed
        busboy.on('finish', function () {
          console.log(`-------------- Final loop --- :`)
  
          if (req.files.url.mimetype === undefined) {
            res.json({ statuscode: 500, success: true, message: "No image provided to upload" });
          } else {
            let extension = req.files.url.mimetype.split("/");
            extension = extension[1];
  
            s3bucket.createBucket(function () {
              var params = {
                Bucket: BUCKET_NAME,
                Key: `${uuid()}.${extension}`,
                Body: req.files.url.data,
                ServerSideEncryption: 'AES256',
                ContentType: req.files.url.mimetype,
                ACL: 'public-read'
              };
              console.log("  statuscode: 200 params.Key  : " + "https://constro-images.s3.ap-south-1.amazonaws.com/" + params.Key);
              s3bucket.upload(params, function (err, data) {
                if (err) {
                  console.log('error in callback   :  ' + err);
                  res.json({ statuscode: 500, success: true, message: "Error occured while image Upload .." + err });
                }
                if (data) {
                  console.log("data :   " + data);
                  console.log("data.Location :   " + data.Location);
                  res.json({ statuscode: 200, success: true, message: 'Image uploaded successfully!', Result: data.Location, ext: extension });
                }
              });
  
            });  // createBucket End
          }
  
        }) //Finish Busboy
        req.pipe(busboy);
      }
      catch (err) {
        console.log("err : " + err);
        res.json({ statuscode: 500, success: true, message: err, Result: null });
      }
    });
  
  
    router.post('/RemoveFileFromS3', function (req, res) {
      try {
        var s3ImgLoc = [];
  
        for (const url of req.body.urls) {
          var arr = url.split('/');
          var orignialName = arr[arr.length - 1];
          var params = {
            Bucket: BUCKET_NAME,
            Key: orignialName,
          };
          s3bucket.deleteObject(params, function (err, data) {
            if (data) {
              s3ImgLoc.push(data);
              if (s3ImgLoc.length === req.body.urls.length) {
                res.json({ statuscode: 200, success: true, message: 'File deleted successfully' });
              }
            }
            else {
              res.json({ statuscode: 500, success: true, message: 'Check if you have sufficient permissions' });
            }
          });
        } //loop End
      }
      catch (err) {
        res.json({ statuscode: 500, success: true, message: err, Result: null });
      }
    });
  
    return router;
  };

