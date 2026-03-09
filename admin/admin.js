let currentEdit = null;
const ADMIN_USER = "6";
const ADMIN_PASS = "7";

function loginAdmin(){
  const user=document.getElementById("loginUser").value;
  const pass=document.getElementById("loginPass").value;
  if(user===ADMIN_USER && pass===ADMIN_PASS){
    document.getElementById("loginPage").style.display="none";
    document.getElementById("adminPanel").style.display="flex";
    loadVideos();
  } else { alert("Invalid credentials"); }
}

async function addVideo(){
  const title=document.getElementById("videoTitle").value;
  const link=document.getElementById("videoLink").value;
  const description=document.getElementById("videoDesc").value;
  const {error}=await supabase.from("videos").insert([{title,link,description}]);
  if(error){alert("Upload failed");} else {clearForm(); loadVideos();}
}

async function loadVideos(){
  const {data}=await supabase.from("videos").select("*").order("created_at",{ascending:false});
  const table=document.getElementById("videoTable");
  table.innerHTML="";
  data.forEach(v=>{
    table.innerHTML+=`
      <tr>
        <td>${v.title}</td>
        <td>${v.views}</td>
        <td>${v.featured?"YES":"NO"}</td>
        <td>
          <button class="btn btn-s btn-sm" onclick="editVideo('${v.id}')">Edit</button>
          <button class="btn btn-d btn-sm" onclick="deleteVideo('${v.id}')">Delete</button>
          <button class="btn btn-p btn-sm" onclick="featureVideo('${v.id}')">Feature</button>
        </td>
      </tr>`;
  });
}

async function deleteVideo(id){
  await supabase.from("videos").delete().eq("id",id);
  loadVideos();
}

async function featureVideo(id){
  await supabase.from("videos").update({featured:true}).eq("id",id);
  loadVideos();
}

async function editVideo(id){
  const {data}=await supabase.from("videos").select("*").eq("id",id).single();
  document.getElementById("videoTitle").value=data.title;
  document.getElementById("videoLink").value=data.link;
  document.getElementById("videoDesc").value=data.description;
  currentEdit=id;
}

async function updateVideo(){
  await supabase.from("videos").update({
    title:document.getElementById("videoTitle").value,
    link:document.getElementById("videoLink").value,
    description:document.getElementById("videoDesc").value
  }).eq("id",currentEdit);
  currentEdit=null;
  clearForm();
  loadVideos();
}

function clearForm(){
  document.getElementById("videoTitle").value="";
  document.getElementById("videoLink").value="";
  document.getElementById("videoDesc").value="";
}
