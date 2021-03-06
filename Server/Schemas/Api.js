var mongoose=require('mongoose');
var User=mongoose.model('User');
var Groups=mongoose.model('Groups');





module.exports.addUser=function(req,res){

    var userData=req.body;
    var allGroupsData=[];
    Groups.find(function(err,data){
        if(err)
            res.send(err)
        else
            allGroupsData.push(data);

    })

    User.findOne({fb_title:userData.userName},function(err,data){

        if(err){
            res.send(err)
        }
        else{
            if(data==null){
                var user_info=new User({
                    fb_id:userData.userId,
                    fb_title:userData.userName
                });
                user_info.save(function(error){
                    if(error){
                        res.send(error);

                    }
                    else

                        res.send(allGroupsData);
                });

            }
            else{
                res.send(allGroupsData[0]);
            }
        }


    })
};


module.exports.addGroup=function(req,res){

    var group_info=req.body;
    Groups.findOne({groupTitle:group_info.groupName},function(err,data){            //To perform a check for similar Team Name
        if(data){
            res.send({message:"Team Name not Available",code:403})
                }

        else
            {
                if(data==null){
                    var groupEntry=new Groups({
                        groupTitle:group_info.groupName,
                        groupDescription:group_info.groupData,
                        groupOwner:group_info.userTitle,
                        groupMembers:group_info.addedMembers,
                        groupProjects:[{projectName:group_info.groupProjectName,projectUrl:group_info.groupProjectUrl}],
                        imageData:{imageName:"",imagePath:group_info.imageData}

                    });
                    groupEntry.save(function(err,data){
                        if(err)
                            res.send(err)
                        else
                        {

                            res.send(data);
                        }
                    })
                }
                else{
                    res.send(false);
                }
            }

    })
};

module.exports.findGroup=function(req,res){

    Groups.find(function(err,data){
        if(err){
            res.send(err)
        }else{

            res.send(data);
        }
    })
};

module.exports.findOneGroup=function(req,res){

    var group_info=req.body;

    Groups.findOne({groupTitle:group_info.groupName},function(err,data){

console.log(group_info.groupName);
        if(data){
            res.send(data);
        }
        else{
            res.send(err);
        }

    })
};

module.exports.addGroupProjects=function(req,res){

    var group_info=req.body;
    Groups.update({groupTitle:req.body.groupName},{$push:{'groupProjects':{'projectName':group_info.groupProjectName,'projectUrl':group_info.groupProjectUrl}}},false,true);
    Groups.findOne({groupTitle:req.body.groupName},function(err,data){

        if(err)
            res.send(err);
        else
        {
            res.send(data.groupProjects)
        }
    })

};

module.exports.findGroupNoImage=function(req,res){

    Groups.find({},{imageData:0},function(err,data){
        if(err){
            res.send(err)
        }else{

            res.send(data);
        }
    })
};

module.exports.getUsers=function(req,res){

    User.find(function(err,data){
        if(err){
            res.send(err)
        }else{

            res.send(data);
        }
    })
};


module.exports.joinGroup=function(req,res){
    var group_info=req.body;
    Groups.update({groupTitle:req.body.groupName},{$push:{'groupMembers':req.body.userName}},false,true);
    Groups.findOne({groupTitle:req.body.groupName},function(err,data){
        if(err)
            res.send(err);
        else
        {
            res.send(data.groupMembers)
        }
    })

};

module.exports.deleteGroup=function(req,res){


    Groups.remove({groupTitle:req.body.groupName},function(err,data){

        if(data){
            res.send(data);
        }
        else{
            res.send(err);
        }
    })

};