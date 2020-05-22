$(function()
{
    var playerTrack = $("#player-track");
	var bgArtwork = $('#bg-artwork');
	var bgArtworkUrl;
	var albumName = $('#album-name');
	var trackName = $('#track-name');
	var albumArt = $('#album-art'),
		sArea = $('#s-area'),
		seekBar = $('#seek-bar'),
		trackTime = $('#track-time'),
		insTime = $('#ins-time'),
		sHover = $('#s-hover'),
		playPauseButton = $("#play-pause-button"),
		i = playPauseButton.find('i'),
		tProgress = $('#current-time'),
		tTime = $('#track-length'),
		seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
		buffInterval = null, tFlag = false;
	
	var playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;
	
	var songs = [{
		artist: "Dig Didzay",
		name: "Nếu Anh Đi (Cover)",
		url: "Musics/NeuAnhDi.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	}, {
		artist: "Khói",
		name: " Bệnh Của Anh",
		url: "Musics/BenhCuaAnh.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	}, {
		artist: "Khói",
		name: " Tất cả của anh",
		url: "Musics/TatCaCuaAnh.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Khói",
		name: " Như ngày Đó",
		url: "Musics/NhuNgayDo.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	}, {
		artist: "Táo",
		name: " 25 ",
		url: "Musics/25Tao.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Tây Nguyên Sound",
		name: " Ai Đưa Em Về Nếu Một Mai Chúng Ta Không Còn Gặp ",
		url: "Musics/AiDuaEmVeNeuMotNgayChungTaKhongConGap.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Linh Lee",
		name: " Buồn Thì Cứ Khóc Đi ",
		url: "Musics/BuonThiCuKhocDi-LinhLee.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Bray",
		name: " Cao Ốc 20 ",
		url: "Musics/CaoOc20-Bray.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Khói",
		name: " Chân Ái ",
		url: "Musics/ChanAi-Khoi.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Jaykii",
		name: " Chiều Hôm Ấy ",
		url: "Musics/ChieuHomAy-Jaykii.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Binz",
		name: " Hoa Hồng Dại ",
		url: "Musics/HoaHongDai-Binz.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Mr.Siro",
		name: " Khóc Cùng Em ",
		url: "Musics/KhocCungEm-MrSiro.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Yang",
		name: " Là Ai Mang Nắng Đi Xa ",
		url: "Musics/LaAiMangNangDiXa.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Bray",
		name: " Lửng Lơ ",
		url: "Musics/LungLo.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Thanh Duy",
		name: " Anh Không Theo Đuổi Em Nữa ",
		url: "Musics/AnhKhongTheoDuoiEmNua.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Junn Đăng Dũng",
		name: " Sợ Rằng Em Biết Anh Còn Yêu Em ",
		url: "Musics/SoRangEmBietAnhConYeuEm.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Khói",
		name: " Tháng 7 Của Anh ",
		url: "Musics/Thang7CuaAnh-Khoi.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Khói",
		name: " Vì Biết Đâu Anh Buồn ",
		url: "Musics/ViBietDauAnhBuon-Khoi.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	},{
		artist: "Cover",
		name: " Thương Thì Thương Thế Thôi ",
		url: "Musics/ThuongThiThuongTheThoi.mp3",
		picture: "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/img/_1.jpg"
	}];
	
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	songs = shuffle(songs);

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
			selectTrack(1);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < songs.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');
			
			currAlbum = songs[currIndex].name;
            currTrackName = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;

            audio.src = songs[currIndex].url;
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
	    albumArt.find('img').attr('src', currArtwork);
            $('#album-art img').prop('src', bgArtworkUrl);
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});
