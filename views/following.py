from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json
from views import get_authorized_user_ids


def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        # return all of the "following" records that the current user is following

        following = (
            Following.query
            .filter(Following.user_id == self.current_user.id)
            .order_by(Following.following_id)
            .all()
        )

        following_json = [follower.to_dict_following() for follower in following]
        return Response(json.dumps(following_json), mimetype="application/json", status=200)

    def post(self):
        # create a new "following" record based on the data posted in the body 
        body = request.get_json()
        print(body)
        print(type(body.get('user_id')))
        if not body.get('user_id') or not type(body.get('user_id')) == int:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)  

        all_ids = [user.id for user in User.query.all()]
        if not body.get('user_id') in all_ids:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)  

        all_following = Following.query.filter(Following.user_id == self.current_user.id).all()
        all_following_ids = [following.following_id for following in all_following]

        if body.get('user_id') in all_following_ids:
            return Response(json.dumps({'message': 'already following this user'}), mimetype="application/json", status=400)

        new_following = Following(
            user_id = self.current_user.id,
            following_id = body.get('user_id')
        )

        db.session.add(new_following)
        db.session.commit()

        return Response(json.dumps(new_following.to_dict_following()), mimetype="application/json", status=201)

class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # delete "following" record where "id"=id
        print(id)
        if not id or not type(id) == int:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        following = Following.query.get(id)
        print(following)
        if not following or not following.user_id == self.current_user.id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()
        
        return Response(json.dumps({'message': 'Following id={0} was successfully deleted.'.format(id)}), mimetype="application/json", status=200)




def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<int:id>', 
        '/api/following/<int:id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
