
var express = require("express");
var JWT = require("../service/jwt");
var routes = function(User){
var userRouter = express.Router();
//
    var page_size=20;
    userRouter.route('/')
              .get(function(req, res){
                
                var data ="";
                var query ={};
                var baseQuery="";
                var auth = req.headers['authorization'];
                var token = auth.split(' ');
                console.log(token[1]);
                var page = 0;

                if(JWT.decode(token[1],'secret'))
                {
                    if(req.query.page){
                        page =req.query.page;
                    }

                    User.find(query, function(err, users){
                        if(err){
                            res.status(500).send(err);
                            console.log(err);
                        }
                        else{
                            //res.json(users);                           
                            data = JSON.parse(JSON.stringify(users));
                            console.log(data);
                            baseQuery= data.sort(function(a, b) { return a.Name < b.Name ? 1 : -1; });
                            var totalCount= baseQuery.length;
                            var totalPages=  Math.ceil(totalCount/page_size);
                            var prevUrl= page > 0 ? 'http://localhost:3000/api/user?page='+(page-1):"";
                            var nextUrl= page < (totalPages-1) ? 'http://localhost:3000/api/user?page='+(page+1):"";

                            res.json({
                                user:baseQuery.slice(page_size*page,((page_size*page)+page_size)),
                                totalCount: totalCount,
                                totalPages: totalPages,
                                prevUrl: prevUrl,
                                nextUrl: nextUrl

                            });
                        }
                    
                    });
                }
              })
              .post(function(req, res){
                  var newUser = new User(req.body);

                  var payload = {
                    iss: req.hostname,
                    sub: newUser.Name
                  }
                  
                  var token = JWT.encode(payload,"secret");

                  newUser.save(function(err){
                      res.status(201).send({
                        user: JSON.stringify(newUser),
                        token :token
                      })
                  });
                  
                  
              });
        userRouter.route('/:userId')
              .get(function(req, res){
                  User.findById(req.params.userId, function(err,user){
                      if(err){
                          res.status(500).send(err);
                      }
                      else{
                          res.json(user);
                        //   var data = JSON.parse(users)
                        //   baseQuery= data.sort(function(a, b) { return a.Name < b.Name ? 1 : -1; });
                        //   var totalCount= baseQuery.length;
                        //   var totalPages=  Math.ceil(totalCount/page_size);
                        //   var preUrl= 'http://localost:3000/api/user?page='+
                      }
                  });
              });
      
        return userRouter;
};
module.exports = routes;