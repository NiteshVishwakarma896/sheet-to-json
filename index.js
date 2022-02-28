const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const parser = require('simple-excel-to-json')
const multer  = require('multer');
const os  = require('os');

const app = express();

//middlewares
const upload = multer({ dest: os.tmpdir() });
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit:50000
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        res.status(200);
    }
    next();
});



//wild card route
app.get('*', (req, res) => {
    res.json({
        message:"The endpoint you are trying to access is not avaliable !"
    }).status(404);
});

app.post('/api/v2/xlsx-to-json',upload.single('file'),async(req,res,next)=>{
    try { 
        const file = req.file;
        if(file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            var doc = parser.parseXls2Json(file.path); 
            if (doc) {
                return res.json({"message":doc,"status":"200"});
            }
            else{
                return res.json({"message":"Something Went Wrong ! Try Contacting App Administrator","status":"404"});
            }
        }
        else{
            return res.json({"message":"Please upload a file with .xlsx extension","status":"403"});
        }
       
    } catch (error) {
        next(error);
    }
});


const port = process.env.PORT || 8080;
app.listen(port, () => { console.log(`Server has been started on ${port} 🔥`) });