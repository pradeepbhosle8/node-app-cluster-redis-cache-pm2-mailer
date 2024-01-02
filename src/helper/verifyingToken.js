import jwt from 'jsonwebtoken';
//secret JWT Token
const SECRET_JWT_TOKEN ='dgfgpspdifgskdfngussj490385jsp8ms';

export const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;
    
    if(!token) {
        res.status(401).send({
            message:'You are not authenticated!'
        })
        
      }
      jwt.verify(token, SECRET_JWT_TOKEN ,(err, user)=>{
        // console.log(user)    
        if (err){
            res.status(403).send({
                message:'Token is not valid!!'
            })
        } 
       
        req.test = user;
        // console.log(req.test)
        // console.log(req.test.id, req.params.id,  req.test.isAdmin === true)
        next();
      })
    
}


export const verifyUser = (req, res, next) => {
  
    verifyToken(req, res, next, ()=>{
     
        if (req.test.id === req.params.id || req.test.isAdmin ) {
           next();
          } else {
            return next(res.status(403).send({
                message:'You are not authenticated! User Access'
            }));
          }
    })
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () =>{
        
        if(req.test.isAdmin) {
            next();
        }else{
            res.status(403).send({
                message:'You are not authorized! Admin user Access!'
            })
        }
    })
}