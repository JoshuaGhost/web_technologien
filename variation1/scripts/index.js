/**
 * Created by Thor on 16/1/10.
 */
function detailSlideIn(self) {
    ul = $(self).children("ul");
    li=ul.children("li");
    ul.stop(true).animate({top:-li.height()},600);
}

function detailSlideOut(self) {
    ul = $(self).children("ul");
    li = ul.children("li");
    ul.stop(true).animate({top:0}, 600);

}
/*
 $(document).ready(function(){
 $("a.ad").hide();
 });
 var detailId=self.id+"d"
 console.log(detailId);
 var detail=document.getElementById(detailId);
 console.log(detail);
 $(self).animate({height:"100px", width:"0px"});
 //$(self).hide();
 $(detail).animate({height:"100px", width:"100px"});
 //$(detail).show();
 }
 function contentSlideIn(self) {
 var contentId=self.id.substring(0,2)
 console.log(contentId);
 var content=document.getElementById(contentId);
 console.log(content);
 $(self).animate({height:"100px", width:"0px"});
 //$(self).hide();
 $(content).animate({height:"100px", width:"100px"});
 //$(content).show();
 }
 */