var user = null;

const post2Modal = post => {
    return `<div class="modal-bg" aria-hidden="false" role="dialog">
    <section class="modal">
            <img class="modal-img" src="${post.image_url}" />
            <div class = "modal-right">
                <section>
                    <div class="close-div">
                        <div style="margin-left: auto">
                            <button data-post-id="${post.id}" class="close" aria-label="Close the modal window" onclick="closeModal(event);">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class = "modal-profile">
                        <img class = "modal-prof-img" src= "${post.user.thumb_url}" alt="">
                        <div style="padding-left: 15px;"> ${post.user.username} </div>
                    </div>
                </section>
                <div class="modal-body">
                    ${displayModalComments(post)}
                </div>
            </div>
    </section>
    </div>
    `
}

const comment2Modal = comment => {
    return `
    <div style = "" class = "modal-comment">
        <img class = "modal-prof-img" src= "${comment.user.thumb_url}" alt="">
        <div style = "flex-grow: 1;  padding-right: 10px; padding-left: 10px">
            <div class = "caption-bold"> ${comment.user.username} </div>
            <p style="display: inline;"> ${comment.text} </p>
            <div style="padding-top: 10px; font-weight: bold;"> ${comment.display_time} </div>
        </div>
        <i class = "far fa-heart"> </i>
    </div>
    `
}


const  displayModalComments = post => {
    comments = post.comments
    const html = comments.map(comment2Modal).join('\n');
    return html;
}

const story2Html = story => {
    return `
    <div class = "story-prof">
        <img src="${story.user.thumb_url} " alt="profile pic for ${ story.user.username }">
        <div> ${story.user.username} </div>
    </div>
    `;
};

const post2Html = (post) => {
    const likes = post.likes.length
    const comments = post.comments.length
    const lastComment = post.comments[post.comments.length - 1]
    var isLiked = false;
    var isBoomarked = false;


    if(post.current_user_like_id) isLiked = true;
    if(post.current_user_bookmark_id) isBoomarked = true;
    
    var displayComment = ``;
    var displayHeart = ``;
    var displayBookmark = ``;
    
    if(comments > 0) {
        if(comments != 1) {
            displayComment = ` <div style="padding-top: 10px;">
            <button
                id = "display-comments-${post.id}"
                data-post-id="${post.id}"
                onclick="showModal(event);"
                class = "view-all-comments"> View all ${comments} comments</button>
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
        displayHeart = 
        `<button class="icon-button" id = "heart-${post.id}" onclick="toggleLike(event);">   
            <i 
            class = "fas fa-heart"
            data-post-id="${post.id}" 
            data-like-id="${post.current_user_like_id}"
            aria-label="Like Post"
            aria-checked="true"
            style= "padding-right: 5px; color: red;"></i>
        </button>`
            ;
    }
    else {
        displayHeart = 
        `<button class="icon-button" id = "heart-${post.id}" onclick="toggleLike(event);">   
            <i 
            class = "far fa-heart"
            data-post-id="${post.id}" 
            aria-label="Like Post"
            aria-checked="false"
            style= "padding-right: 5px;"></i>
        </button>`;
    }

    if(isBoomarked) {
        displayBookmark = 
        `<button class="icon-button" id = "bookmark-${post.id}" onclick="toggleBookmark(event);">
            <i
            class = "fas fa-bookmark"
            data-post-id="${post.id}"
            data-bookmark-id="${post.current_user_bookmark_id}"
            aria-label="Bookmark Post"
            aria-checked="true"
            style= "padding-right: 5px;"></i>
        </button>`
    }
    else {
        displayBookmark = 
        `<button class="icon-button" id = "bookmark-${post.id}" onclick="toggleBookmark(event);">
            <i
            class = "far fa-bookmark"
            data-post-id="${post.id}"
            aria-label="Bookmark Post"
            aria-checked="false"
            style= "padding-right: 5px;"></i>
        </button>`
    }

    return `    
    <div id="post_${post.id}" class = "post">
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
            <input class="post-input" id="input-${post.id}" placeholder="Add a comment..."></input>
        </div>
        <button 
        style="margin-right: 0px"
        onclick = "postComment(event);"
        id="${post.id}" 
        data-post-id="${post.id}" href="" class = "link">Post</button>
    </div>
</div>
`
}

const stringToHTML = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, 'text/html');
    return doc.body.firstChild;
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

const showModal = ev => {
    const postId = Number(ev.currentTarget.dataset.postId)
    redrawPost(postId, post => {
        const html = post2Modal(post);
        document.querySelector(`.body`).insertAdjacentHTML("afterend", html);
        document.querySelector('.close').focus();
    })
}

document.addEventListener('focus', function(event) {
    modalElement = document.querySelector(".modal-bg");
    if (modalElement && modalElement.getAttribute('aria-hidden') === 'false' && !modalElement.contains(event.target)) {
        event.stopPropagation();
        document.querySelector('.close').focus();
    }
}, true);

document.addEventListener('keydown', function(event){
    modalElement = document.querySelector(".modal-bg");
	if(modalElement && event.key === "Escape" && modalElement.getAttribute('aria-hidden') === 'false'){
        postId = document.querySelector(".close").dataset.postId;
		closeModal(event, postId);
	}
});


const closeModal = (ev, postId) => {
    var updatedPostId = null;
    if(!postId) updatedPostId = Number(ev.currentTarget.dataset.postId);
    else updatedPostId = postId
    document.querySelector('.modal-bg').remove();
    const focusButton = '#display-comments-' + updatedPostId;
    document.querySelector(focusButton).focus();
}


const postComment = ev => {
    const elem = ev.currentTarget;
    const buttonId = elem.getAttribute("id");
    var inputId = "input-" + buttonId;  
    var inputElem = document.querySelector("#" + inputId)
    var inputText = document.querySelector("#" + inputId).value
    inputElem.value = "";

    const postData = {
        "post_id": elem.dataset.postId,
        "text": inputText
    };
    
    fetch("/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            redrawPost(elem.dataset.postId, post => {
                redrawCard(post);
                document.querySelector("#" + inputId).focus();
            });
        });
}


const toggleBookmark = ev => {
    const elem = ev.currentTarget.firstElementChild;
    const postId = elem.dataset.postId;
    if(elem.getAttribute("aria-checked") === 'false') {
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

    fetch("/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('csrf_access_token')
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            elem.className = "fas fa-bookmark"
            redrawPost(postId, post => {
                redrawCard(post);
                document.querySelector("#bookmark-" + postId).focus();
            });
        });
}

const unbookmarkPost = (bookmarkId, elem) => {
    const postId = elem.dataset.postId
    const deleteURL = `/api/bookmarks/${bookmarkId}`
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.className = "far fa-bookmark"
        redrawPost(postId, post => {
            redrawCard(post);
            document.querySelector("#bookmark-" + postId).focus();
        });
    });
}



const toggleLike = ev => {
    const elem = ev.currentTarget.firstElementChild;
    const postId = elem.dataset.postId;
    if(elem.getAttribute("aria-checked") === 'false') {
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
    
    fetch("/api/posts/likes/", {
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
            elem.style.color = 'red'
            redrawPost(postId, post => {
                redrawCard(post);
                document.querySelector("#heart-" + postId).focus();
            });
        });
}

const deleteLikePost = (likeId, elem) => {
    const postId = elem.dataset.postId
    const deleteURL = `/api/posts/likes/${likeId}`
    fetch(deleteURL, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.style.color = 'black'
        elem.className = "far fa-heart"
        redrawPost(postId, post => {
            redrawCard(post);
            document.querySelector("#heart-" + postId).focus();
        });
    });
}


const redrawPost = (postId, callback) => {
    fetch(`/api/posts/${postId}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        if(!callback) {
            redrawCard(data);
        }
        else {
            callback(data);
        } 
    });
}

const redrawCard = post => {
    const html = post2Html(post);
    const newElement = stringToHTML(html);
    const postElement = document.querySelector(`#post_${post.id}`);
    postElement.innerHTML = newElement.innerHTML; 
}

const toggleFollow = ev => {
    const elem = ev.currentTarget;
    const userId = parseInt(elem.dataset.userId)
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
    
    fetch("/api/following/", {
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
    const deleteURL = `/api/following/${followingId}`
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
    fetch('/api/suggestions')
        .then(response => response.json())
        .then(users => {
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
    fetch("/api/posts/?limit=10", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        var html = ``;

        for(let i = 0; i < data.length; i++) {
            //(data[i]);
            html = html + '\n' + post2Html(data[i])
        }

        // const html = data.map(post2Html).join('\n');
        document.querySelector('.posts').innerHTML = html;
    });
}

const displayProfile = () => {
    fetch("/api/profile/", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        const html = `
        <div class = "profile">
        <img src= "${data.thumb_url}" alt="">
        <div style="padding-left: 15px;"> ${data.username} </div>
        </div>`;
        document.querySelector('.profile').innerHTML = html;
        user = data;
    });
}


const getCookie = key => {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

async function initPage() {
    displayPosts(); 
    displayProfile();
    displaySuggestions();
    displayStories();
   
};

// invoke init page to display stories:
initPage();