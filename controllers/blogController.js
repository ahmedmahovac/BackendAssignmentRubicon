const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

const slug = require("limax");

const createNeededJSONPost = (post) => {
    const blogPost = post.toObject();
    delete blogPost._id;
    delete blogPost.__v;
    return blogPost;
}

const createNeededJSONComment = (comment) => {
    return {id: comment._id, createdAt: comment.createdAt, updatedAt: comment.updatedAt, body: comment.body};
}

exports.getPost = (req,res) => {
    const {slug} = req.params;
    PostModel.findOne({slug: slug}, (err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else if(!post){
            res.sendStatus(404); // not found
        }
        else {
            res.json({blogPost: createNeededJSONPost(post)});
        }
    });
}

exports.getMostRecentPosts = (req,res) => {
    const {tag} = req.query;
    // sort by created time
    // most recent ? how many? all by default
    var recentPosts = []
    PostModel.find({}).sort({"createdAt": -1}).exec((err,posts)=>{ // sort posts by createdAt
        if(err){
            res.sendStatus(500);
        }
        else{
            console.log(posts);
            posts.forEach((post)=>{
                if(!tag || tag && post.tagList.includes(tag)){ // if tag query is even sent
                    recentPosts.push(createNeededJSONPost(post));
                }
            });
            res.json({blogPosts: recentPosts});
        }
    });
}

exports.createPost = (req,res) => {
    // sta ako vec postoji isti slug
    // samo zabranit kreiranje ako vec postoji isti naslov
    const {title, description, body} = req.body.blogPost;
    var {tagList} = req.body.blogPost;
    if(title==null || description==null || body==null){ // required fields not present
        res.sendStatus(400);
        return;
    }
    const postSlug = slug(title);
    if(tagList==null){ // ako tagList nije poslano
        tagList = []
    }
    PostModel.findOne({slug:postSlug}, (err,data)=>{
        if(err){
            res.sendStatus(500);
        }
        else if(data!=null){ //already exists
            res.statusCode = 409;
            res.json(data); // return post which is already created
        }
        else{
            PostModel.create({slug: postSlug, title: title, description: description, body: body, tagList: tagList, createdAt: Date.now(), updatedAt: Date.now()}, (err, createdPost) => {
                if(err){
                    res.sendStatus(500);
                }
                else{
                    res.json({blogPost: createNeededJSONPost(createdPost)});
                }
            })
        }
    })
}

exports.updatePost = (req,res) => {
    const {title, description, body} = req.body.blogPost;
    PostModel.findOne({slug: req.params.slug}, (err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            if(!post){
                res.sendStatus(404); // post not found
            }
            var change = false;
            if(title!=null){
                post.title = title;
                post.slug = slug(title);
                change=true;
            }
            if(description!=null){
                post.description = description;
                change=true;
            }
            if(body!=null){
                post.body=body;
                change=true;
            }
            if(change){
                post.updatedAt = Date.now(); // saving updated time
                post.save(function(err,updatedPost){
                    if(err){
                        res.sendStatus(500);
                    }
                    else{
                        res.json({blogPost: createNeededJSONPost(updatedPost)});
                    }
                });
            }
        } 
    })
}

exports.deletePost = (req,res) => {
    const {slug} = req.params;
    PostModel.findOne({slug:slug},(err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            if(!post) {
                res.statusCode(404);
                res.json({status: "Post not found"});
            }
            else {
                    PostModel.deleteOne({slug:slug}, (err,data)=>{
                        if(err){
                            res.sendStatus(500);
                        }
                        else{
                            CommentModel.deleteMany({_postId: post._id}, (err,comments)=>{ // deleting comments of post
                                if(err){
                                    res.sendStatus(500);
                                }
                                else{
                                    res.json(data); // not specified
                                }
                            });
                        }
                    });
            };
        }
    });
}

exports.getAllTags = (req,res) => {
    var tags = []
    PostModel.find({}, (err,posts)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            posts.forEach(post => {
                post.tagList.forEach(tag => {
                    if(!tags.include(tag)){
                        tags.push(tag);
                    }
                });
            });
            res.json({tags: tags});
        }
    });
}

exports.addComment = (req,res) => {
    // due to url structure of this route, it is reasonable to hold comments as array attribute in post 
    const {slug} = req.params;
    if(!req.body.comment){
        res.sendStatus(400); // bad request
    }
    const body = req.body.comment.body;
    if(!body){
        res.sendStatus(400); // bad request
    }
    PostModel.findOne({slug:slug}, (err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else if(!post){
            res.statusCode(404); // not found
            res.json({status: "Specified post doesn't exist"});
        }
        else{
            CommentModel.create({_postId: post._id, body: body}, (err,comment)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    console.log(comment);
                    res.json({comment: createNeededJSONComment(comment)});
                }
            });
        }
    });
}

exports.getComments = (req,res) => {
    const {slug} = req.params;
    CommentModel.find({postSlug: slug}, (err,comments)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            comments.map((comment)=>{
                createNeededJSONComment(comment);
            })
            res.json({comments: comments});
        }
    });
}

exports.deleteComment = (req,res) => {
    const {slug, id} = req.params;
    // koja je poenta slug-a kad se uopste ne mora iskoristit?ž
    // mozda da izgled rute bude intuitivniji?
    CommentModel.deleteOne({_id: id}, (err,comment)=>{
        if(err){
            res.sendStatus(500);
        }
        else{ 
            res.json(comment); 
        }
    });
}