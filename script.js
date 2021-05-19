// DRAG AND DROP
const dropArea = document.getElementById("uploader-box");
var MAX_FILE_SIZE = 12 * 1024 * 1024; // 12MB
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); 
  dropArea.classList.add("active");
});

dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
});

dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); 
  file = event.dataTransfer.files[0];
  if (event.dataTransfer.files[0].type == "application/pdf"){
    document.getElementById('first').style.display = "none";
    document.getElementById('second').style.display = "block";
    var file = event.dataTransfer.files[0];
      var fileReader = new FileReader();
      fileReader.onload = function() {
        var typedarray = new Uint8Array(this.result);
        console.log(typedarray);
        const loadingTask = pdfjsLib.getDocument(typedarray);
        loadingTask.promise.then(pdf => {
          pdf.getPage(1).then(function(page) {
            console.log('Page loaded');
            var scale = 1.5;
            var viewport = page.getViewport({
              scale: scale
            });
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function() {
              console.log('Page rendered');
            });
          });
        });
      }
      fileReader.readAsArrayBuffer(file);
  }else {
    alert("Please select Pdf file");
  }
});
  

$(document).ready(function(){
  $('input[type="file"]').change(function(e){
      var fileName = e.target.files[0].name;
      fileSize = this.files[0].size;
        if (fileSize > MAX_FILE_SIZE) {
            this.setCustomValidity("File must not exceed 12 MB!");
            this.reportValidity();
        } else {
          document.getElementById("uploader-box").innerHTML = fileName;
          document.getElementById('first').style.display = "none";
          document.getElementById('second').style.display = "block";   
        }
  });
});

function file() {
  loadPdf();
}
// LOAD PDF INTO CANVAS

function loadPdf() {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';
  document.getElementById('myPdf').onchange = function(event) {
  var file = event.target.files[0];
  var fileReader = new FileReader();
  fileReader.onload = function() {
    var typedarray = new Uint8Array(this.result);
    console.log(typedarray);
    const loadingTask = pdfjsLib.getDocument(typedarray);
    loadingTask.promise.then(pdf => {
      pdf.getPage(1).then(function(page) {
        console.log('Page loaded');
        var scale = 1.5;
        var viewport = page.getViewport({
          scale: scale
        });

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
         	console.log('Page rendered');
        });
      });
    });
  }
  fileReader.readAsArrayBuffer(file);
}
}

// MODELBOX TO ADD SIGNATURE
var modal = document.getElementById("myModal");
var btn = document.getElementById("add_sign");
var span = document.getElementsByClassName("close")[0];
 
btn.onclick = function() {
  	modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

jQuery(document).ready(function($){
	var canvas = document.getElementById("signature");
	var signaturePad = new SignaturePad(canvas);
	$('#add-signature').on('click', function() {                                      
	  console.log(canvas.toDataURL("image/jpg"));
		const img = document.getElementById('img_v');
		img.src = canvas.toDataURL("image/jpg");
    document.getElementById("myModal").style.display = "none";
		document.getElementById("add_sign").style.display = "none";
		document.getElementById("download").style.display = "block";
		document.getElementById("img_v").style.display = "block";
		document.getElementById("delete").style.display = "block";
    document.getElementById("add").style.display = "block";
		return img;
	});
	
	$('#clear-signature').on('click', function(){
		signaturePad.clear();
	});
	
});

// DRAGGABLE SIGNATURE
dragElement(document.getElementById("drag_sign"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id)) {
    document.getElementById(elmnt.id).onmousedown = dragMouseDown;
  } else {
   
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

$('#add').on('click', function() {
  var canvas1 = document.getElementById('canvas');
  var context1 = canvas1.getContext('2d');
  var canvas = document.getElementById("signature");
	const img = document.getElementById('img_v');
	img.src = canvas.toDataURL("image/jpg");
  img.onload = function(){        
      context1.drawImage(img, 20, 900);
  };
  document.getElementById("add").style.display = "none";
	document.getElementById("img_v").style.display = "none";
	document.getElementById("delete").style.display = "none"; 
	document.getElementById("add_sign").style.display = "none";
	document.getElementById("download").style.display = "block";
});

$('#delete').on('click', function() {
  document.getElementById("add").style.display = "none";
	document.getElementById("img_v").style.display = "none";
	document.getElementById("delete").style.display = "none";
	document.getElementById("add_sign").style.display = "block";
	document.getElementById("download").style.display = "none";
});

// DOWNLOAD IMAGE 
var canvas = document.getElementById("canvas");
	$('#download').on('click', function() {
		console.log(canvas.toDataURL("image/jpg"));
		const img = document.getElementById('img_v1');
		img.src = canvas.toDataURL("image/jpeg");
		var pdf = new jsPDF();
		pdf.addImage(img, 'JPEG', 0, 0);
		pdf.save("download.pdf");  
		return img;
});

