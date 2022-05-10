import utils
import requests

root_url = utils.root_url
import unittest

class TestLikesCommentsListEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_user_12()

    def test_likes_comments_post_valid_request_201(self):
        comment_id = utils.get_unliked_comment_id_by_user(self.current_user.get('id'))
        print(comment_id)
        body = {
            'comment_id': comment_id,
        }

        print(body)
        response = requests.post(root_url + '/api/likescomments', json=body)
        new_likeComment = response.json()
        self.assertEqual(response.status_code, 201)

        # check that the values are in the returned json:
        self.assertEqual(new_likeComment.get('comment_id'), body.get('comment_id'))
        self.assertEqual(new_likeComment.get('user_id'), self.current_user.get('id'))

        # now delete comment from DB:
        utils.delete_likes_comments_by_id(new_likeComment.get('id'))

        # and check that it's gone:
        self.assertEqual(utils.get_likes_comments_by_id(new_likeComment.get('id')), [])

    def test_likes_comments_no_duplicates_400(self):
        liked_post = utils.get_likes_comments_by_user(self.current_user.get('id'))
        url = '{0}/api/likescomments'.format(root_url)
        response = requests.post(url, json={'post_id': liked_post.get('post_id')})
        # print(liked_post.get('post_id'))
        # print(response.text)
        self.assertEqual(response.status_code, 400)    


    def test_likes_comments_post_invalid_comment_id_format_400(self):
        body = {
            'comment_id': 'dasdasdasd',
        }
        response = requests.post(root_url + '/api/likescomments', json=body)
        # print(response.text)
        self.assertEqual(response.status_code, 400)

    def test_likes_comments_post_invalid_comment_id_404(self):
        body = {
            'comment_id': 999999,
        }
        response = requests.post(root_url + '/api/likescomments', json=body)
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    def test_likes_comments_post_unauthorized_comment_id_404(self):
        comment_id = utils.get_comment_id_that_user_cannot_access(self.current_user.get('id'))
        body = {
            'comment_id': comment_id,
        }
        response = requests.post(root_url + '/api/likescomments', json=body)
        # print(response.text)
        self.assertEqual(response.status_code, 404)

    def test_likes_comments_missing_comment_id_400(self):
        response = requests.post(root_url + '/api/likescomments', json={})
        # print(response.text)
        self.assertEqual(response.status_code, 400)    
    

class TestLikesCommentsDetailEndpoint(unittest.TestCase):
    
    def setUp(self):
        self.current_user = utils.get_user_12()

    def test_likes_comments_delete_valid_200(self):
        likesComment_to_delete = utils.get_likes_comments_by_user(self.current_user.get('id'))
        print(likesComment_to_delete)
        likesComment_id = likesComment_to_delete.get('id')
        url = '{0}/api/likescomments/{1}'.format(root_url, likesComment_id)
        
        response = requests.delete(url)
        # print(response.text)
        self.assertEqual(response.status_code, 200)

        # restore the like in the database:
        utils.restore_likes_comments(likesComment_to_delete)

    def test_likes_comments_delete_invalid_id_format_404(self):
        url = '{0}/api/likescomments/sdfsdfdsf'.format(root_url)
        response = requests.delete(url)
        self.assertEqual(response.status_code, 404)

    def test_likes_comments_delete_invalid_id_404(self):
        url = '{0}/api/likescomments/99999'.format(root_url)
        response = requests.delete(url)
        self.assertEqual(response.status_code, 404)

    def test_likes_comments_delete_unauthorized_id_404(self):
        unauthorized_likes_comment = utils.get_likes_comments_that_user_cannot_delete(self.current_user.get('id'))
        url = '{0}/api/likescomments/{1}'.format(root_url, unauthorized_likes_comment.get('id'))
        response = requests.delete(url)
        self.assertEqual(response.status_code, 404)



if __name__ == '__main__':
    # to run all of the tests:
    # unittest.main()

    # to run some of the tests (convenient for commenting out some of the tests):
    suite = unittest.TestSuite()
    suite.addTests([

        # POST Tests:
        TestLikesCommentsListEndpoint('test_likes_comments_post_valid_request_201'),
        TestLikesCommentsListEndpoint('test_likes_comments_post_invalid_comment_id_format_400'),
        TestLikesCommentsListEndpoint('test_likes_comments_post_invalid_comment_id_404'),
        TestLikesCommentsListEndpoint('test_likes_comments_post_unauthorized_comment_id_404'),
        TestLikesCommentsListEndpoint('test_likes_comments_no_duplicates_400'),
        TestLikesCommentsListEndpoint('test_likes_comments_missing_comment_id_400'),

        # DELETE Tests:
        TestLikesCommentsDetailEndpoint('test_likes_comments_delete_valid_200'),
        TestLikesCommentsDetailEndpoint('test_likes_comments_delete_invalid_id_format_404'),
        TestLikesCommentsDetailEndpoint('test_likes_comments_delete_invalid_id_404'),
        TestLikesCommentsDetailEndpoint('test_likes_comments_delete_unauthorized_id_404'),
        
    ])

    unittest.TextTestRunner(verbosity=2).run(suite)