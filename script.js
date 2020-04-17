const apiKeyList = ["AIzaSyAKkNJJh2kbSgl31RObQuuEaS_6oRzT30Q", "AIzaSyAvPUsjjqCxjx9ZlIZh-EcdiBAFbJOeoO0", "AIzaSyB56E3cgBh0TMpNi5WQJT9AMFtChFIeEIo"];
var apiKey = apiKeyList[0];
var listVid = [];
var listVideo;
var player;

var bg = document.getElementsByClassName('bg')[0];
var musicPlayer = document.getElementsByClassName('player')[0];
var prev = document.getElementsByClassName('btn-prev')[0];
var next = document.getElementsByClassName('btn-next')[0];
var repeat = document.getElementsByClassName('btn-repeat')[0];
var form = document.getElementsByClassName('form')[0];
var newPlaylistId = document.getElementsByClassName('input')[0];
var ok = document.getElementsByClassName('ok')[0];
var body = document.getElementsByTagName('body')[0];

var tag = document.createElement('script');
var btn = document.getElementById('btn');
var btn2 = document.getElementById('btn2');
var icon = document.getElementById('icon');
var icon2 = document.getElementById('icon2');
var para = document.getElementById('title');

var rand;
var repeatStatus = 0;

//Request de lay Playlist Item
const getPlayListItems = async playlistID => {
	var token;
	var resultArr = [];
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'id,snippet',
        maxResults: 50,
        playlistId: playlistID,
        key: apiKey
      }
    })
    //Lay NextPage Token
	token = result.data.nextPageToken;
	resultArr.push(result.data);
	while (token) {
		let result = await axios.get(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      	params: {
        part: 'id,snippet',
        maxResults: 50,
        playlistId: playlistID,
        key: apiKey,
		pageToken: token
      	}
    	})
		token = result.data.nextPageToken;
		resultArr.push(result.data);
	}	
	return resultArr;
};

//Xu li Item de lay Title video va videoId
getPlayListItems("UUWovDkXc7w0821EaKmznmCA")
.then(data => {
	data.forEach(item => {
    	item.items.forEach(i => listVid.push({title: i.snippet.title, idVid: i.snippet.resourceId.videoId}));
	});
	//Tao random index
    rand = Math.floor(Math.random()*listVid.length);
    checkPrivate();
    tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})
.catch(err => {
	changeAPIKey(apiKeyList[1], err);
});


function changeAPIKey(newKey, err) {
	if (err.response.data.error.errors[0].reason == "dailyLimitExceeded") {
		apiKey = newKey;
		getPlayListItems("UUWovDkXc7w0821EaKmznmCA")
		.then(data => {
			data.forEach(item => {
	    	item.items.forEach(i => listVid.push({title: i.snippet.title, idVid: i.snippet.resourceId.videoId}));
			
			rand = Math.floor(Math.random()*listVid.length);
		    checkPrivate();
		    tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		});
		})
		.catch(err => {
			changeAPIKey(apiKeyList[2], err);
		});

		
	}
}


function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
	  height: '0',
	  width: '0',
	  videoId: listVid[rand].idVid,
	  events: {
	    'onReady': onPlayerReady,
	    'onStateChange': onPlayerStateChange
	  }
	});
}

function onPlayerReady(event) {
	player.setPlaybackQuality("small");
	btn.style.display = "block";
	prev.style.display = "block";
	next.style.display = "block";
	btn2.style.display = "block";
	repeat.style.display = "block";
	form.style.display = "flex";
	para.innerHTML = listVid[rand].title;
	playButton(player.getPlayerState() !== 5);
}

//On click button
btn.onclick = changeStatusPlay;
prev.onclick = prevSong;
next.onclick = nextSong;
repeat.onclick = repeatVideo;
ok.onclick = changePlaylistId;

function playButton(play) {
		icon.src = play ? "icon/pause.svg" : "icon/play.svg";
}

function changeStatusPlay() {
	if (player.getPlayerState() == 1 || player.getPlayerState() == 3) {
		pauseVideo();
		playButton(false);
	} else if (player.getPlayerState() != 0) {
		playVideo();
    	playButton(true);
    	
    } 
}

function onPlayerStateChange(event) {
    if (event.data === 0) {
    	playButton(false); 
    }
}

function playVideo() {
	player.playVideo();
}

function pauseVideo() {
	player.pauseVideo();
}

function stopVideo() {
	player.stopVideo();
}

//previous song
function prevSong() {
	if (repeatStatus == 1) {
		repeat.style.opacity = "0.3";
		repeatStatus = 0;
	}
	playButton(false);
	stopVideo();
	if (rand - 1 < 0) {
		rand = listVid.length - 1;
	} else {
		rand -= 1;
	}
	checkPrivateBack();
	player.loadVideoById({videoId:listVid[rand].idVid});
	para.innerHTML = listVid[rand].title;
	musicPlayer.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
	bg.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
	playButton(true);			
}

//next song
function nextSong() {
	if (repeatStatus == 1) {
		repeat.style.opacity = "0.3";
		repeatStatus = 0;
	}
	playButton(false);
	stopVideo();
	if (rand + 1 == listVid.length) {
		rand = 0;
	} else {
		rand += 1;
	}
	checkPrivate();
	player.loadVideoById({videoId:listVid[rand].idVid});
	para.innerHTML = listVid[rand].title;
	musicPlayer.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
	bg.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
	playButton(true);

}

//Next bai moi khi video het
function nextVideo() {
	if (repeatStatus == 1) {
		player.loadVideoById({videoId:listVid[rand].idVid});
	} else {
		rand = Math.round(Math.random()*listVid.length);
		checkPrivate();
		player.loadVideoById({videoId:listVid[rand].idVid});
		para.innerHTML = listVid[rand].title;
		musicPlayer.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
		bg.style.backgroundImage = "url('https://source.unsplash.com/random/600*250/?landscape')";
	}
	
}

//Phat lap lai
function repeatVideo () {
	if (repeatStatus == 0) {
		repeat.style.opacity = "0.8";
		repeatStatus = 1;
	} else {
		repeat.style.opacity = "0.3";
		repeatStatus = 0;
	}
}

//Kiem tra co phai video private hoac delete khong
function checkPrivate() {
	if (listVid[rand].title == "Private video" || listVid[rand].title == "Deleted video") {
		if (rand == listVid.length - 1) {
			rand = 0;
		} else {
			rand += 1;
		}
		checkPrivate();
	}
};

function checkPrivateBack() {
	if (listVid[rand].title == "Private video" || listVid[rand].title == "Deleted video") {
		if (rand == 0) {
			rand = listVid.length - 1;
		} else {
			rand -= 1;
		}		
		checkPrivateBack();
	}
};

//Khi nhap Playlist Id moi
function changePlaylistId () {
	var newId = newPlaylistId.value;
	if (newId == "") {
		return;
	}

	listVid = [];
	btn.style.display = "none";
	prev.style.display = "none";
	next.style.display = "none";
	btn2.style.display = "none";
	repeat.style.display = "none";
	para.innerHTML = "Loading...";

	getPlayListItems(newId)
	.then(data => {
		data.forEach(item => {
	    	item.items.forEach(i => listVid.push({title: i.snippet.title, idVid: i.snippet.resourceId.videoId}));
		});
	    rand = Math.floor(Math.random()*listVid.length);
	    checkPrivate();
	    btn.style.display = "block";
		prev.style.display = "block";
		next.style.display = "block";
		btn2.style.display = "block";
		repeat.style.display = "block";
		para.innerHTML = listVid[rand].title;			    
		player.loadVideoById({videoId:listVid[rand].idVid});
		playButton(true);
	});	

}

//Chuyen bai
setInterval(function() {
	if (player.getPlayerState() == 0) {
		nextVideo();
		playButton(true);
	}
}, 3000);