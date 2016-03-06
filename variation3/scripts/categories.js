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