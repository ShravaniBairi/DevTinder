const userAuth=[(req,res, next)=>{
    console.log('First Middleware')
    //Here we dont have a response in this method so it goes to the next route as we have given next() method in this middleware funtion
    //Otherwise it would stuck in an infinite loop
    
    next();
},
(req, res, next)=>{
    console.log('Route Handler');
    res.send('Actual Route handler handlling the route')
    //next()
}]

module.exports = {userAuth}