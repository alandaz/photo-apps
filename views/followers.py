from flask import Response, request
from flask_restful import Resource
from models import db, Following, user
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        '''
        People who are following the current user.
        In other words, select user_id where following_id = current_user.id
        '''

        followers = (
            Following.query
            .filter(Following.following_id == self.current_user.id)
            .order_by(Following.user_id)
            .all()
        )
       # user_ids = [id for (id,) in user_ids_tuples]
        
        followers_json = [follower.to_dict_follower() for follower in followers]
        print(followers_json)
        return Response(json.dumps(followers_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
