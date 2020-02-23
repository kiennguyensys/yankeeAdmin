const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { Text, Checkbox, Password, Relationship, Float, CloudinaryImage } = require('@keystonejs/fields');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { StaticApp } = require('@keystonejs/app-static');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
const express = require('express');
const session = require('express-session');
var cors = require('cors');
var multer = require('multer');
var bodyParser = require('body-parser');

const secret = "bd69a98acde93bc1d1e9ef337d13c98774acbe0ec05489ef2874afaf9b4f54c3"
const distDir = './dist'


const PROJECT_NAME = "yankeesim";
const { User, Product, ProductCategory, ProductTag, Order, Post, PostCategory, PostTag, Comment, Review, Notification, ContactForm } = require('./schema');

const keystone = new Keystone({
  name: 'yankeesim',
  adapter: new MongooseAdapter(),
});

keystone.createList('User', User);
keystone.createList('Product', Product);
keystone.createList('Post', Post);
keystone.createList('PostCategory', PostCategory);
keystone.createList('PostTag', PostTag);
keystone.createList('ProductCategory', ProductCategory);
keystone.createList('ProductTag', ProductTag);
keystone.createList('ProductReview', Review);
keystone.createList('Order', Order);
keystone.createList('PostComment', Comment);
keystone.createList('Notification', Notification);
keystone.createList('ContactForm', ContactForm);


// keystone.createItems({
//     User: [{name: 'kiennguyensys', email: 'tkien2703@gmail.com', isAdmin: true, password: '123456abc'}]
// });

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
  },
});

const graphQL = new GraphQLApp()

const admin = new AdminUIApp();

const staticApp = new StaticApp({
      path: "/uploader",
      src: './public',
    })

const DBUpload = (list, result) => {
    var new_result = result.map(order => {
        return {data: order}
    })

    let json = JSON.stringify(new_result)
    json = json.replace(/\"([^(\")"]+)\":/g,"$1:");
    const mutation = `
        mutation {
        create` + list + `(data:` + json + `
            ) {
                id,
              }
    }
    `;

    console.log(mutation)

    const url = "https://yankeesim-admin.herokuapp.com/admin/api";
    const opts = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query:mutation })
    };
    fetch(url, opts)
    .then(resp => resp.json())
    .then(lresult => {
        if(lresult.data) {
            console.log('create List successfully!')
        }
    })
    .catch(console.error);

}

const dev = process.env.NODE_ENV !== 'production';
const port = 3000;
const preparations = [graphQL, admin, staticApp].map(app =>
  app.prepareMiddleware({ keystone, distDir, dev })
);

Promise.all(preparations).then(async middlewares => {
    await keystone.connect();
    const server = express();

    server.use(session({
      secret: 'my super secret',
      resave: false,
      saveUninitialized: true,
    }))


    server.use(middlewares).listen(port);   

    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: false }));

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');

    /** API path that will upload the files */
    server.post('/upload', function(req, res) {

        var exceltojson;
        upload(req,res,function(err){
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }

            const listName = req.body.listname

            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and 
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            console.log(req.file.path);
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                }, function(err,result){
                    if(err) {
                        return res.json({error_code:1,err_desc:err, data: null});
                    } 
                    res.json({error_code:0,err_desc:null, data: result});

                    // start uploading to graphql server
                    DBUpload(listName, result)

                 });
            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
       
    });


});

module.exports = {
  keystone,
  apps: [graphQL, admin, staticApp],
};