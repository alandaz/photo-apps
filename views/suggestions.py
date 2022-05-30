from flask import Response, request
from flask_restful import Resource
from models import User
from views import get_authorized_user_ids
import json
import flask_jwt_extended

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # suggestions should be any user with an ID that's not in this list:
        # print(get_authorized_user_ids(self.current_user))
        authorized_ids = get_authorized_user_ids(self.current_user)
        recommended = User.query.filter(~User.id.in_(authorized_ids)).limit(7).all()
        recommended_json = [recommend.to_dict() for recommend in recommended]


        return Response(json.dumps(recommended_json), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
