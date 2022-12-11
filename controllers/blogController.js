const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

const slug = require("limax");

exports.getPost = (req,res) => {
 
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

}

exports.getAllTags = (req,res) => {

}

exports.addComment = (req,res) => {

}

exports.getComments = (req,res) => {

}

exports.deleteComment = (req,res) => {

}