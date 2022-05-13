
const toggleFollow = ev =>{
    const elem = ev.currentTarget; 
    if (elem.innerHTML === 'follow'){
        //issue post request to UI for new follower 
        createFollower(elem.dataset.userId, elem);
    }else{
        deleteFollower(elem.dataset.followingId, elem);
    }
};

const createFollower = (userId, elem) => {
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
        .then(response=> response.json())
        .then(data=> {
            console.log(data); 
            elem.innerHTML = 'unfollow';
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
        //in the event that we want to unfollow 
            elem.setAttribute('data-following-id', data.id);
        });
};

const deleteFollower = (followingId, elem) => {
    const deleteURl = "https://photo-app-demo.herokuapp.com/api/following/${followingId}"; 
    fetch(deleteURL, {
            method: "DELETE"
        })
        .then(response=> response.json())
        .then(data=> {
            console.log(data); 
            elem.innerHTML = 'follow';
            elem.classList.add('follow');
            elem.classList.remove('unfollow');
            elem.removeAttribute('data-following-id');
        
        });
};
const user2Html = user => {
    return `<div class = "suggestion">
            <img src = "${user.thumb_url}"/>
            <div>
                <p class = "username">${user.username}</p>
                <p class = "suggestion-text">suggested for you</p>
            </div>
            <div>
                <button class = "follow" data-user-id= "${user.id}" onclick ="toggleFollow(event);">follow</button>
            </div>
        </div>`;
};
const getSuggestions = () => {
    fetch("/api/suggestions/")
        .then(response => response.json())
        .then(users => {
            console.log(users);
            const html = users.map(user2Html).join('\n');
            document.querySelector('#suggestions').innerHTML = html; 
        });
};

const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const initPage = () => {
    displayStories();
    getSuggestions(); 
};

// invoke init page to display stories:
initPage();