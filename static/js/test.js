var user = null;
var bookmarks = [];
var postCounter = 0;

const modalComments = comments => {
    let html = ``
    for (let comment of comments) {
        html += `
        <div class = "modalcomments">

            <img src = "${comment.user.img_url}" >
            <p class = "modaltext"> <strong> ${comment.user.username} </strong>
            ${comment.text} </p>
        </div>
        <p class = "time"> ${comment.display_time} </p>
        `; 
    }
    return html; 
};

const modalFunction = ev => {
    const postId = ev.currentTarget.dataset.postId; 
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const html = `
                <div class = "modalbackground">
                    <button onclick = 'closeModal(event)">
                        <i class = "fas fa-times"></i>
                    </button> 
                    <div class = "modal"> 
                        <img src = "${ post.image_url}" />
                        <div class = "postinfo"> 
                            <div class = "userinfo"> 
                                < div class = "profilepic" > 
                                    <img src = "${post.user.thumb_url}">
                                </div> 
                                <h1> ${post.user.username} </h1>
                            </div>
                            <div class = "modal-comments">
                                ${openModal(post.comments)}
                            </div> 
                        </div> 
                    </div> 
                </div>`
                ;  
            document.querySelector('#modalcontainer').innerHTML = html; 

            document.getElementById("closeModal").focus(); 
            document.addEventListener('keydown', function(event){
                if (event.key === 'Escape') {
                    closeModal(postId); 
                }
            })
        });
}
const openModal = ev => {
    console.log('open');
    modalElement.classList.remove('hidden'); 
    modalElement.setAttribute('aria-hidden', 'false'); 
    document.querySelector('close').focus(); 
};

const closeModal = ev => {
    console.log('close!'); 
    modalElement.classList.add('hidden'); 
    modalElement.setAttribute('aria-hidden', 'false'); 
    document.querySelector('open').focus(); 
}; 

const getBookmarks = () => {
    fetch("api/bookmarks/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
            console.log('hi');
            if(data) bookmarks = data;
            //document.querySelector('.js-others').innerHTML = `html`;
            displayPosts();
    });
}
const post2Html = (post) => {
    const likes = post.likes.length
    const comments = post.comments.length
    const lastComment = post.comments[post.comments.length - 1]
    var isLiked = false;
    var isBoomarked = false;
    var likeId = null
    var bookmarkId = null;
    postCounter = postCounter + 1;
    //console.log(bookmarks)

    for(let i = 0; i < likes; i++) {
        if(user.id == post.likes[i].user_id) {
            isLiked = true;
            likeId = post.likes[i].id;
        }
        
    }

    for(let i = 0; i < bookmarks.length; i++) {
        if(post.id == bookmarks[i].post.id) {
            isBoomarked = true;
            bookmarkId = bookmarks[i].id;
        }
    }

    //console.log(bookmarks)
    console.log(isBoomarked)
    var displayComment = ``;
    var displayHeart = ``;
    var displayBookmark = ``;
    
    if(comments > 0) {
        if(comments != 1) {
            displayComment = ` <div style="padding-top: 10px;">
            <button class = "view-all-comments" onclick = "openModal(event);" > View all ${comments} comments</button>
            </div>
            <div class = "post-caption">
                <div class = "caption-bold"> ${lastComment.user.username}</div>
                <p style="display: inline;"> ${lastComment.text} </p>
            </div>
            `;
        }
        else {
            displayComment = `  <div class = "post-caption">
            <div class = "caption-bold"> ${lastComment.user.username}</div>
            <p style="display: inline;"> ${lastComment.text} </p>
            </div>`;
        }   
    }

    if(isLiked) {
        displayHeart = `<i
        id = "heart" 
        class = "fas fa-heart"
        onclick="toggleLike(event);"
        data-post-id="${post.id}" 
        data-like-id="${likeId}"
        aria-label="Like Post"
        aria-checked="true"
        style= "padding-right: 5px; color: red;"></i>`;
    }
    else {
        displayHeart = `<i 
        id = "heart"
        class = "far fa-heart"
        onclick="toggleLike(event);"
        data-post-id="${post.id}" 
        aria-label="Like Post"
        aria-checked="false"
        style= "padding-right: 5px;"></i>`;
    }

    if(isBoomarked) {
        displayBookmark = `<i
         class = "fas fa-bookmark"
         onclick="toggleBookmark(event);"
         data-post-id="${post.id}"
         data-bookmark-id="${bookmarkId}"
         aria-label="Bookmark Post"
         aria-checked="true"
         style= "padding-right: 5px;"></i>`
    }
    else {
        displayBookmark = `<i
        class = "far fa-bookmark"
        onclick="toggleBookmark(event);"
        data-post-id="${post.id}"
        aria-label="Bookmark Post"
        aria-checked="false"
        style= "padding-right: 5px;"></i>`
    }

    return `    
    <div class = "post">
    <div class = "ind-post">
        <div class = "post-header">
            <div> ${post.user.username} </div>
            <i class = "fas fa-ellipsis-h"></i>
        </div>
        <img src=" ${post.image_url} "
             alt="" class = "post-img">
        <div class = "post-header">
            <div>
                ${displayHeart}
                <i class = "far fa-comment" style= "padding-right: 5px;"></i>
                <i class = "far fa-paper-plane"></i>
            </div>
            <div>
                ${displayBookmark}
            </div>
        </div>
        <div style="padding-left: 10px; font-weight: bold;">
            ${likes} likes
        </div>
        <div class = "post-caption">
            <div class = "caption-bold"> ${post.user.username} </div>
            <p style="display: inline;"> ${post.caption} </p>
            <a class = "link" href=""> more </a>
        </div>

        ${displayComment}

        <div class = "post-caption">
            <div style="color: rgb(53, 54, 55); padding-bottom: 5px; border: none;"> ${post.display_time} </div>
        </div>
    </div>
    <div class = "post-comment">
        <div class="post-comment-right">
            <i class = "far fa-smile"></i>
            <input class="post-input" id="input-${postCounter}" placeholder="Add a comment..."></input>
        </div>
        <button 
        style="margin-right: 0px"
        onclick = "postComment(event);"
        id="${postCounter}" 
        data-post-id="${post.id}" href="" class = "link">Post</button>
    </div>
</div>
`
}

const suggestions2Html = user => {
    return `<div class = "suggestions">
    <div class = "others">
        <div class = "sg-profile">
            <div class="sg-img-name"> 
                <img src=" ${user.thumb_url}" alt="">
                <div style="padding-left: 10px;">
                    <div style="font-weight: bold; color: black;">
                        ${user.username}
                    </div>
                    <div>
                        suggested for you
                    </div>
                </div>
            </div>
            <button
            class="follow"
            data-user-id="${user.id}" 
            aria-label="Follow"
            aria-checked="false"
            onclick="toggleFollow(event);">follow</button>
        </div>                        
    </div>
    </div>`
};

const postComment = ev => {
    const elem = ev.currentTarget;
    const buttonId = elem.getAttribute("id");
    var inputId = "input-" + buttonId;  
    var inputElem = document.querySelector("#" + inputId)
    
    var inputText = document.querySelector("#" + inputId).value
    //console.log(inputText)
    inputElem.value = "";

    const postData = {
        "post_id": elem.dataset.postId,
        "text": inputText
    };
    
    fetch("api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayPosts();
        });
}


const toggleBookmark = ev => {
    const elem = ev.currentTarget;
    const postId = elem.dataset.postId;
    //console.log(elem.dataset.userId);
    if(elem.getAttribute("aria-checked") === 'false') {
        //console.log('nice')
        bookmarksPost(postId, elem)
    }
    else {
        const bookmarkId = parseInt(elem.dataset.bookmarkId)
        unbookmarkPost(bookmarkId, elem)
    }
}

const bookmarksPost = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    
    fetch("http://localhost:5000/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.className = "fas fa-bookmark"
            elem.setAttribute('data-bookmark-id', data.id)
            elem.setAttribute('aria-checked', 'true');
        });
}

const unbookmarkPost = (bookmarkId, elem) => {
    const deleteURL = `api/bookmarks/${bookmarkId}`
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.removeAttribute('data-like-id');
        elem.setAttribute('aria-checked', 'false');
        elem.className = "far fa-bookmark"
    });
}



const toggleLike = ev => {
    //console.log('hi');
    const elem = ev.currentTarget;
    const postId = elem.dataset.postId;
    //console.log(elem.dataset.userId);
    if(elem.getAttribute("aria-checked") === 'false') {
        //console.log('nice')
        likePost(postId, elem)
    }
    else {
        const likeId = parseInt(elem.dataset.likeId)
        deleteLikePost(likeId, elem)
    }
}

const likePost = (postId, elem) => {
    const postData = {
        "post_id": postId
    };
    
    fetch("http://localhost:5000/api/posts/likes/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.className="fas fa-heart"
            elem.setAttribute('data-like-id', data.id)
            elem.setAttribute('aria-checked', 'true');
            elem.style.color = 'red'
            displayPosts();
        });
}

const deleteLikePost = (likeId, elem) => {
    const deleteURL = `api/posts/likes/${likeId}`
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.removeAttribute('data-like-id');
        elem.setAttribute('aria-checked', 'false');
        elem.style.color = 'black'
        elem.className = "far fa-heart"
        displayPosts();
    });
}


const toggleFollow = ev => {
    const elem = ev.currentTarget;
    const userId = parseInt(elem.dataset.userId)
    console.log(elem.dataset.userId);
    if(elem.innerHTML === 'follow') {
        followUser(userId, elem)
    }
    else {
        const followingId = parseInt(elem.dataset.followingId)
        unfollowUser(followingId, elem)
    }
}

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.className ='unfollow'
            elem.setAttribute('data-following-id', data.id)
            elem.setAttribute('aria-checked', 'true');
        });
}

const unfollowUser = (followingId, elem) => {
    const deleteURL = `api/following/${followingId}`
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = "follow";
        elem.className = "follow"
        elem.removeAttribute('data-following-id');
        elem.setAttribute('aria-checked', 'false');
    });
}


const displaySuggestions = () => {
    fetch('api/suggestions')
        .then(response => response.json())
        .then(users => {
            //console.log(users)
            const html = users.map(suggestions2Html).join('\n')
            document.querySelector('.js-others').innerHTML = html;
    })
}

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const displayPosts = () => {
    //getBookmarks();
    fetch("http://localhost:5000/api/posts/?limit=10", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        var html = ``;

        for(let i = 0; i < data.length; i++) {
            html = html + '\n' + post2Html(data[i])
        }

        // const html = data.map(post2Html).join('\n');
        document.querySelector('.posts').innerHTML = html;
    });
}

const displayProfile = () => {
    fetch("http://localhost:5000/api/profile/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        const html = `
        <div class = "profile">
        <img src= "${data.thumb_url}" alt="">
        <div style="padding-left: 15px;"> ${data.username} </div>
        </div>`;
        document.querySelector('.profile').innerHTML = html;
        user = data;
    });
}



async function initPage() {
    getBookmarks();
    displayProfile();
    displaySuggestions();
    displayStories();
   
};




// invoke init page to display stories:
initPage();