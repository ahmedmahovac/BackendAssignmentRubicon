const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

exports.getPost = (req,res) => {
 
}

exports.createPost = (req,res) => {
    // napravi i za to kad nema required polja
    const {title, description, body, tagList} = req.body.blogPost;
    console.log(req.body);
    if(tagList==null){ // ako uopste nije poslano 
        tagList = []
    }
    PostModel.create({title: title, description: description, body: body, tagList: tagList}, (err, createdPost) => {
        if(err){
            res.sendStatus(500);
        }
        else res.json(createdPost);
    })
}

exports.updatePost = (req,res) => {
    
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