var current_page = 1;
var records_per_page = 2;
let next='';
let prev='';
const apiURL = 'https://api.lyrics.ovh';
const cors= 'https://cors-anywhere.herokuapp.com/';
const search = document.getElementById('songsearch')
const form = document.querySelector('#searchForm');
form.addEventListener('submit',function(e){
e.preventDefault();
console.log(form.elements.songsearch.value);
searchKeyword = search.value.trim()

if(!searchKeyword){
    alert("No keywords to search")
}
else{ 
    searchSong(searchKeyword)
}

})
const searchSong = async (searchKeyword) => {
try{
const res = await fetch(`${apiURL}/suggest/${searchKeyword}`);
const data = await res.json();
console.log('data: ',data);
next= data.next;
console.log('dataNext: ', next);
showData(data);
}catch(e){
console.log('something went wrong',e);
}
}

function showData(data){
  
    result.innerHTML = `
    <ul class="song-data">
      ${data.data
        .map(song=> `<li>
                    <div>
                        <strong>${song.artist.name}</strong> -${song.title} 
                    </div>
                    <span artist="${song.artist.name}" songtitle="${song.title}"> Show Lyrics</span>
                </li>`
        )
        .join('')}
    </ul>
  `;
}

result.addEventListener('click', e=>{
    const clickedElement = e.target;
    if (clickedElement.tagName === 'SPAN'){
        const artist = clickedElement.getAttribute('artist');
        const songTitle = clickedElement.getAttribute('songtitle');     
        showLyrics(artist, songTitle)
    }
})

async function showLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json(); 
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <p>${lyrics}</p>`;
  
  }
// pagination




async function nextPage()
{
    if(!next){
        alert('No records to show ');
    }else{
    try{

        const res = await fetch(cors+`/`+next);
        const data = await res.json();
        console.log('data: ',data);
        prev= data.prev;
        showData(data);
        }catch(e){
        console.log('something went wrong on clicking next',e);
        }
    } 
}

async function prevPage()
{
    if(!prev){
        alert('No records to show ');
    }else{
    try{
        const res = await fetch(cors+`/`+prev);
        const data = await res.json();
        console.log('data: ',data);
        showData(data);
        }catch(e){
        console.log('something went wrong on clicking prev',e);
        }
}}


exports.searchSong = searchSong;