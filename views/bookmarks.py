from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post
from views import get_authorized_user_ids
import decorators 
import flask_jwt_extended
import json

class BookmarksListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required() 
    def get(self):
        # get all bookmarks owned by the current user
        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).all()
        bookmarks_json = [bookmark.to_dict() for bookmark in bookmarks]

        return Response(json.dumps(bookmarks_json), mimetype="application/json", status=200)

    @flask_jwt_extended.jwt_required()
    
    def post(self):
        # create a new "bookmark" based on the data posted in the body 
        body = request.get_json()

        if not body or not body.get('post_id'):
            return Response(json.dumps({'message':'invalid post id'}), mimetype="application/json", status=400)

        try:
            new_post_id = int(body.get('post_id'))
        except:
            return Response(json.dumps({'message': 'invalid post id'}), mimetype="application/json", status=400)

        post = Post.query.get(new_post_id)
        authorized_ids = get_authorized_user_ids(self.current_user)

        if not post or not post.user_id in authorized_ids:
            return Response(json.dumps({'message': 'invalid post id'}), mimetype="application/json", status=404)

        bookmarks = Bookmark.query.filter_by(user_id = self.current_user.id).all()

        if new_post_id in [bookmark.post_id for bookmark in bookmarks]:
            return Response(json.dumps({'message': 'already bookmarked'}), mimetype="application/json", status=400)
     
        new_bookmark = Bookmark(
            user_id = self.current_user.id,
            post_id = new_post_id
        )

        print(new_bookmark.post_id)

        db.session.add(new_bookmark)
        db.session.commit()

        print(body)
        return Response(json.dumps(new_bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()

    def delete(self, id):
        # delete "bookmark" record where "id"=id
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        print(id)

        bookmark = Bookmark.query.get(id)
        if not bookmark or not bookmark.user_id == self.current_user.id:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=404)

        Bookmark.query.filter_by(id=id).delete()
        db.session.commit()
        
        return Response(json.dumps({'message': 'Post id={0} was successfully deleted.'.format(id)}), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<int:id>', 
        '/api/bookmarks/<int:id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
