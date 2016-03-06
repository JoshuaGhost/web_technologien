function checkAnswers(answers, solutions) {
    var resultArr = [],
    flag = false;
    for (i = 0; i < solutions.length; i++) {
        if (solutions[i] == answers[i]) {
            flag = true;
        } else {
            flag = false;
        }
        resultArr.push(flag);
    }
    return resultArr;
}

function roundReloaded(num, dec) {
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

function judgeSkills(score, comments) {
    var returnString;
    if (score === 100) return comments.perfect;
    else if (score > 90) return comments.excellent;
    else if (score > 70) return comments.good;
    else if (score > 50) return comments.average;
    else if (score > 35) return comments.bad;
    else if (score > 20) return comments.poor;
    else return comments.worst;
}

function renderTaskList(competent, tasks) {
	var ret = '',
	bottonClass = '';

	if (competent) {
	    ret += 'Congratulations, you have proved your competence in terrian Information Finding and welcomed to participate the real job:<br/><br/> \
	            <div class="tasks">';
	    buttonClass = 'proceed';
	} else {
	    ret += 'Sorry, but you seem not ready for the tasks in Information Finding. Therefore you are not suggest to proceed<br/><br/>\
	            <div class = "tasks">';
	    buttonClass = 'proceed-faded'
	}
	ret += '<div class="jquizzy-clear"></div>';
	ret += '<ul class = "task-list">';
	for (var i = 0; i < tasks.length; i++) {
	    ret += '<li class="task-intry"><a href="'+tasks[i].taskLink+'">\
	                <div class="'+buttonClass+'">'+tasks[i].taskTitle+'</div>\
	            </a></li>';
	}
	ret += '</ul></div></br>';

	return ret
}