const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

const slug = require("limax");

exports.getPost = (req,res) => {
    const {slug} = req.params;
    PostModel.findOne({slug: slug}, (err,data)=>{
        if(err){
            res.sendStatus(500);
        }
        else {
            res.json(data);
        }
    });
}

exports.getMostRecentPosts = (req,res) => {
    const {tag} = req.query;
    // po defaultu je redoslijed uzrokovan vremenom kreiranja
    // most recent ? vracat cu ih sve sortirane po najnovijem
    var recentPosts = []
    PostModel.find({},(err,posts)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            posts.forEach((post)=>{
                if(post.tags.includes(tag)){
                    recentPosts.push(post);
                }
            });
            recentPosts = recentPosts.reverse();
            res.json(recentPosts);
        }
    });
}

exports.createPost = (req,res) => {
    // napravi i za to kad nema required polja
    // sta ako vec postoji isti slug
    // samo zabranit kreiranje ako vec postoji isti naslov
    const {title, description, body, tagList} = req.body.blogPost;
    const postSlug = slug(title);
    console.log(postSlug);
    if(tagList==null){ // ako uopste nije poslano 
        tagList = []
    }
    PostModel.create({slug: postSlug, title: title, description: description, body: body, tagList: tagList}, (err, createdPost) => {
        if(err){
            res.sendStatus(500);
        }
        else res.json(createdPost);
    })
}

exports.updatePost = (req,res) => {
    const {title} = req.body.blogPost;
    const postSlug = slug(title);
    // opcionalna polja jsona, vidjet sta za to
    PostModel.findOneAndUpdate({slug: req.params.slug}, {slug: postSlug, title: title}, (err,data)=>{
        console.log(data);
        if(err){
            res.sendStatus(500);
        }
        else {
            res.json(data);
        }
    });
}

exports.deletePost = (req,res) => {
    const {slug} = req.params;
    PostModel.findOne({slug:slug},(err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            if(!post) {
                res.json({status: "Post not found"});
            }
            else {
                CommentModel.deleteMany({postId: post._id}, (err,data)=>{
                    if(err){
                        res.sendStatus(500);
                    }
                    else{
                        PostModel.deleteOne({_id: post._id}, (err,data)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else{
                                res.json(data);
                            }
                        });
                    }
                });
            }
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
                    console.log(tag);
                    if(tags.indexOf(tag)==-1){
                        tags.push(tag);
                    }
                });
            });
            res.json(tags);
        }
    });
}

exports.addComment = (req,res) => {
    // id ce se svakako kreirat automatski, nema smsila da ga ne izbaucjem
    // mogu ga samo ignorisati, a za sve primjene gdje bi koristili id koristit slug
    const {slug} = req.params;
    console.log(req.body.comment.body);
    PostModel.findOne({slug:slug}, (err,post)=>{
        if(err){
            res.sendStatus(500);
        }
        else if(!post){
            res.json({status: "Specified post doesn't exist"});
        }
        else{
            CommentModel.create({postSlug: slug, body: req.body.comment.body}, (err,data)=>{
                if(err){
                    res.sendStatus(500);
                }
                else{
                    res.json(data);
                }
            });
        }
    });
}

exports.getComments = (req,res) => {
    const {slug} = req.params;
    CommentModel.find({postSlug: slug}, (err,data)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            res.json(data);
        }
    });
}

exports.deleteComment = (req,res) => {
    const {slug, id} = req.params;
    // koja je poenta slug-a kad se uopste ne mora iskoristit?ž
    // mozda da izgled rute bude intuitivniji?
    CommentModel.deleteOne({_id: id}, (err,data)=>{
        if(err){
            res.sendStatus(500);
        }
        else{
            res.json(data);
        }
    });
}