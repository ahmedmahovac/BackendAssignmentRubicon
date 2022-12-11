var express = require('express');
var router = express.Router();

const {getPost, createPost, updatePost, deletePost, getAllTags, addComment, getComments, deleteComment} = require("../controllers/blogController");

router.get('/posts/:slug', getPost);

router.post("/posts", createPost);

router.put("/posts/:slug", updatePost);

router.delete("/posts/:slug", deletePost);

router.get("/tags", getAllTags);

router.post("/posts/:slug/comments", addComment);

router.get("/posts/:slug/comments", getComments);

router.delete("/posts/:slug/comments/:id", deleteComment);

module.exports = router;
