function logging (dump, e, thisLi) {
	dump.push({});
    dump[dump.length-1]["timestamp"] = e.timeStamp;
    dump[dump.length-1]["target"]    = e.target.childNodes[0].data;
    if (thisLi.context.classList.contains("selected")) {
        dump[dump.length-1]["action"] = "select";
    } else {
        dump[dump.length-1]["action"] = "cancel";
    }
    return dump;
}