from flask import Response, request
from flask_restful import Resource
import json

from platformdirs import user_log_dir
from models import db, Comment, Post, LikeComment
from views import get_authorized_user_ids

class LikeCommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        likeComments = (
            LikeComment.query
            .filter(LikeComment.user_id == self.current_user.id)
            .all()
        )

        likeComments_json = [likeComment.to_dict() for likeComment in likeComments]
        return Response(json.dumps(likeComments_json), mimetype="application/json", status=200)

    
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()
        print(body)


        if not body or not body.get('comment_id'):
            return Response(json.dumps({'message': 'missing parameters'}), mimetype="application/json", status=400)

        try:
            new_comment_id = int(body.get('comment_id'))
        except:
            return Response(json.dumps({'message': 'invalid parameters'}), mimetype="application/json", status=400)

        comment = Comment.query.get(new_comment_id)
        if not comment:
            return Response(json.dumps({'message': 'invalid like comment id'}), mimetype="application/json", status=404)

        authorized_ids = get_authorized_user_ids(self.current_user)
        post = Post.query.get(comment.post_id)

        if not post or post.user_id not in authorized_ids:
            return Response(json.dumps({'message': 'invalid like comment id'}), mimetype="application/json", status=404)

        listLikeComments = (
            LikeComment.query
            .filter(LikeComment.user_id == self.current_user.id)
            .all()
        )

        if comment.id in [listLikeComment.comment_id for listLikeComment in listLikeComments]:
           return Response(json.dumps({'message': 'already liked this comment'}), mimetype="application/json", status=400)


        likeComment = LikeComment(
            user_id= self.current_user.id,
            comment_id=new_comment_id
        )

        db.session.add(likeComment)
        db.session.commit()

        print(body)
        return Response(json.dumps(likeComment.to_dict()), mimetype="application/json", status=201)
        
class LikeCommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        if not id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)
        
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)

        likeComment = LikeComment.query.get(id)

        if not likeComment or not self.current_user.id == likeComment.user_id:
            return Response(json.dumps({'message': 'invalid id={0}'.format(id)}), mimetype="application/json", status=404)

        LikeComment.query.filter_by(id=id).delete()
        db.session.commit()
        print(id)
        return Response(json.dumps({'message': 'LikeComment id={0} was successfully deleted.'.format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        LikeCommentListEndpoint, 
        '/api/likescomments', 
        '/api/likescomments/',
        resource_class_kwargs={'current_user': api.app.current_user}

    )
    api.add_resource(
        LikeCommentDetailEndpoint, 
        '/api/likescomments/<int:id>', 
        '/api/likescomments/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
