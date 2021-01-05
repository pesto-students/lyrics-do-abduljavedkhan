let nextPageUrl = '';
let prevPageUrl = '';
const apiURL = 'https://api.lyrics.ovh';
const cors = 'https://cors-anywhere.herokuapp.com';
const headersData = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
const search = document.getElementById('songsearch')
const form = document.querySelector('#searchForm');

// search song based on kewyword

form.addEventListener('submit', function (e) {
    e.preventDefault();
    searchKeyword = search.value.trim()
    if (!searchKeyword) { alert("No keywords to search") }
    else { searchSong(searchKeyword) }
});

// search song API call

const searchSong = async (searchKeyword) => {
    try {
        const res = await fetch(`${apiURL}/suggest/${searchKeyword}`);
        const data = await res.json();
        nextPageUrl = data.next;
        showData(data);
    } catch (e) {
        console.log('something went wrong', e);
    }
}

// render response data of searched keyword

function showData(data) {
    result.innerHTML = `<ul class="song-data">
                        ${data.data.map(song =>
                        `<li>
                            <div>
                                <strong>${song.artist.name}</strong> -${song.title} 
                            </div>
                            <span artist="${song.artist.name}" songtitle="${song.title}"> Show Lyrics</span>
                        </li>`).join('')
                        }</ul>`;
 }

// show lyrics 

result.addEventListener('click', e => {
    const clickedElement = e.target;
    if (clickedElement.tagName === 'SPAN') {
        const artist = clickedElement.getAttribute('artist');
        const songTitle = clickedElement.getAttribute('songtitle');
        showLyrics(artist, songTitle)
    }
});

// lyrics api call

async function showLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML =
     `<h2><strong>${artist}</strong> - ${songTitle}</h2>
      <p>${lyrics}</p>`;
}

// pagination API call on click
//next page
async function nextPage() {
  if (!nextPageUrl) {
    if (!search.value) { alert("Type a keyword to search") }
else{
        alert('No records to show ');
    }} else {
        try {            
            fetch(`${cors}/${nextPageUrl}`, headersData)
              .then(response => response.text())
              .then(res => {
                const jdata = JSON.parse(res);
                prevPageUrl = jdata.prev;
                nextPageUrl = jdata.next;
                showData(jdata);
              })
              .catch(error => console.log('error', error));
        } catch (e) {
            console.log('something went wrong on clicking next', e);
        }
    }
}

// prev page
async function prevPage() {
    if (!prevPageUrl) {
        if (!search.value) { alert("Type a keyword to search") }
        else{
                alert('No records to show ');
            }
    } else {
        try {
            fetch(`${cors}/${prevPageUrl}`, headersData)
              .then(response => response.text())
              .then(res => {
                const jdata = JSON.parse(res);
                showData(jdata);
              })
              .catch(error => console.log('error', error));
        } catch (e) {
            console.log('something went wrong on clicking prev', e);
        }
    }
}


exports.searchSong = searchSong;