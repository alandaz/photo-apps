from flask import Response, request
from flask_restful import Resource
from models import LikePost, db, Post
import json
from views import get_authorized_user_ids

class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # create a new "like_post" based on the data posted in the body 
        body = request.get_json()
        if not body or not body.get('post_id'):
            return Response(json.dumps({'message': 'missing parameters'}), mimetype="application/json", status=400)

        try:
            new_post_id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': 'invalid parameters'}), mimetype="application/json", status=400)

        authorized_ids = get_authorized_user_ids(self.current_user)
        post = Post.query.get(new_post_id)
        if not post or post.user_id not in authorized_ids:
            return Response(json.dumps({'message': 'invalid post id'}), mimetype="application/json", status=404)
        user_likes = LikePost.query.filter_by(user_id=self.current_user.id).all()
       
        if post.id in [like.post_id for like in user_likes]:
            return Response(json.dumps({'message': 'already like this post'}), mimetype="application/json", status=400)


        like = LikePost(
            user_id = self.current_user.id,
            post_id = new_post_id
        )

        db.session.add(like)
        db.session.commit()
        print(body)
        return Response(json.dumps(like.to_dict()), mimetype="application/json", status=201)

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "like_post" where "id"=id

        if not id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)
        
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'invalid id2'}), mimetype="application/json", status=400)

        like = LikePost.query.get(id)

        if not like or not self.current_user.id == like.user_id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        print(id)
        return Response(json.dumps({'message': 'Like id={0} was successfully deleted.'.format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/likes', 
        '/api/posts/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/likes/<int:id>', 
        '/api/posts/likes/<int:id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
