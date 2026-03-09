async function loadVideos(){
  const { data } = await supabase.from("videos").select("*").order("featured",{ascending:false});
  const grid = document.getElementById("video-grid");
  grid.innerHTML="";

  data.forEach(v=>{
    grid.innerHTML += `
      <div class="vcard">
        ${v.featured ? '<div class="vfeatured-badge">FEATURED</div>' : ''}
        <div class="vcard-body">
          <div class="vtitle">${v.title}</div>
          <p>${v.description}</p>
          <div class="vmeta">
            <span>Views: ${v.views}</span>
          </div>
          <button class="btn btn-p btn-sm" onclick="watchVideo('${v.id}','${v.link}')">Watch</button>
        </div>
      </div>
    `;
  });
}

async function watchVideo(id, link){
  // increment view
  await supabase.from("videos").update({views: supabase.raw('views + 1')}).eq('id', id);
  window.open(link,'_blank');
}

loadVideos();