from flask import Response, request
from flask_restful import Resource
import json

from platformdirs import user_log_dir
from models import db, Comment, Post
from views import get_authorized_user_ids
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def post(self):
        # create a new "Comment" based on the data posted in the body 
        body = request.get_json()

        if not body or not body.get('post_id') or not body.get('text'):
            return Response(json.dumps({'message': 'missing parameters'}), mimetype="application/json", status=400)

        try:
            new_post_id = int(body.get('post_id'))
            new_body_text = str(body.get('text'))
        except:
            return Response(json.dumps({'message': 'invalid parameters'}), mimetype="application/json", status=400)

        authorized_ids = get_authorized_user_ids(self.current_user)
        post = Post.query.get(new_post_id)
        if not post or post.user_id not in authorized_ids:
            return Response(json.dumps({'message': 'invalid post id'}), mimetype="application/json", status=404)

        comment = Comment(
            text = new_body_text,
            user_id= self.current_user.id,
            post_id = new_post_id
        )

        db.session.add(comment)
        db.session.commit()

        print(body)
        return Response(json.dumps(comment.to_dict()), mimetype="application/json", status=201)
        
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def delete(self, id):
        if not id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)
        
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)

        comment = Comment.query.get(id)

        if not comment or not self.current_user.id == comment.user_id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        print(id)
        return Response(json.dumps({'message': 'Comment id={0} was successfully deleted.'.format(id)}), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<int:id>', 
        '/api/comments/<int:id>/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
