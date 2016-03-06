(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            questions: null,
            categoryNames: null,
            tasks: null,
            startImg: 'images/start.gif',
            endText: 'Test End!',
            realTaskURL: null,
            shortURL: null,
            sendResultsURL: null,
            taskList: null,
            resultComments: {
                perfect: 'You are genius!',
                excellent: 'You have done a wonderful job!',
                good: 'Well done!',
                average: 'Satisfactory!',
                bad: 'You will do better next time！',
                poor: 'That is terrible!',
                worst: 'Sorry,you had better try again！'
            }
        };

        var tic, toc;
        var counter = 0;
        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }
        var taskList = config.tasks;
        var categoryNames = config.categoryNames;
        var superContainer = $(this),
        testSolutions = [],
        categories = [],
        cateLength = [],
        introFob = '<div class="intro-container slide-container">\
                        <a class="nav-start" href="#">\
                            <p><h2>At first: Finishing the pre-test</h2></p><br/><br/>\
                            <p>Following is pre-test for the <i>&quotreal&quot</i> tasks</p><br/>\
                            <p>During the test you are supposed to finish several questions, which will be separate evaluated and shown.</p><br/>\
                            <p>You will meanwhile be recommended, on which terrian of tasks you are good.</p><br/><br/>\
                            <p><b><i>Good luck in the Pre-test</i></b></p><br/><br/><br/>\
                            <span><img src="'+config.startImg+'"></span>\
                        </a>\
                    </div>',
        exitFob = '<div class="results-container slide-container"><div class="question-number">' + config.endText + '</div><div class="result-keeper"></div></div><div class="notice">Please make a choice！</div><div class="progress-keeper" ><div class="progress"></div></div>',
        contentFob = '';

        var trueCounts  = new Array(),
            cateTimes   = new Array(),
            scores      = new Array(),
            resultsDocs = new Array(),
            tasks       = [],
            url = '';
        for (var i = 0;  i < categoryNames.length; i++) {
            trueCounts.push(0);
            cateTimes.push(0);
            scores.push(0);
            cateLength.push(0);
            resultsDocs.push('');
            tasks.push([]);
        }

        for (var i = 0; i < config.tasks.length; i++) {
            var c = config.tasks[i].category;
            tasks[c].push({'taskTitle': config.tasks[i].taskTitle,
                           'taskLink' : config.tasks[i].taskLink});
        }

        superContainer.addClass('main-quiz-holder');
        for (var iQuests = 0; iQuests < config.questions.length; iQuests++) {
            contentFob += '<div class="slide-container"><div class="question-number">' + (iQuests + 1) + '/' + config.questions.length + '</div><div class="question">' + config.questions[iQuests].question + '</div><ul class="testOptions">';
            for (iOpts = 0; iOpts < config.questions[iQuests].testOptions.length; iOpts++) {
                contentFob += '<li>' + config.questions[iQuests].testOptions[iOpts] + '</li>';
            }
            contentFob += '</ul><div class="nav-container">';
            if (iQuests !== 0) {
                contentFob += '<div class="prev"><a class="nav-previous" href="#">&lt;&nbsp;Previous</a></div>';
            }
            if (iQuests < config.questions.length - 1) {
                contentFob += '<div class="next"><a class="nav-next" href="#">Next&nbsp;&gt;</a></div>';
            } else {
                contentFob += '<div class="next final"><a class="nav-show-result" href="#">Finish</a></div>';
            }
            contentFob += '</div></div>';
            testSolutions.push(config.questions[iQuests].solution);
            categories.push(config.questions[iQuests].category);
            cateLength[categories[iQuests]] ++;
        }
        superContainer.html(introFob + contentFob + exitFob);
        var progress = superContainer.find('.progress'),
        progressKeeper = superContainer.find('.progress-keeper'),
        notice = superContainer.find('.notice'),
        progressWidth = progressKeeper.width(),
        taskTimes = [],
        answers = [],
        questionLength = config.questions.length,
        slidesList = superContainer.find('.slide-container');

        progressKeeper.hide();
        notice.hide();
        slidesList.hide().first().fadeIn(300);

        superContainer.find('li').click(function() {
            var thisLi = $(this);
            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                thisLi.parents('.testOptions').children('li').removeClass('selected');
                thisLi.addClass('selected');
            }
        });

        superContainer.find('.nav-start').click(function() {
            $(this).parents('.slide-container').fadeOut(300,
            function() {
                $(this).next().fadeIn(300);
                progressKeeper.fadeIn(300);
            });
            tic = new Date();
            return false;
        });

        superContainer.find('.next').click(function() {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            toc = new Date();
            notice.hide();
            var time = toc-tic;
            if (taskTimes[$(this).parents('.slide-container').index() - 1] != undefined){
                taskTimes[$(this).parents('.slide-container').index() - 1] +=time;
            } else {
                taskTimes.push(time);
            }
            $(this).parents('.slide-container').fadeOut(300,
            function() {
                $(this).next().fadeIn(300);
            });
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            500);
            
            tic = new Date();
            return false;
        });

        superContainer.find('.prev').click(function() {
            toc = new Date()
            notice.hide();
            var time = toc - tic;
            if (taskTimes[$(this).parents('.slide-container').index() - 1] != undefined){
                taskTimes[$(this).parents('.slide-container').index() - 1] += time;
            } else {
                taskTimes.push(time);
            }
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).prev().fadeIn(500);
            });
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            500);
            tic = new Date();
            return false;
        });

        superContainer.find('.final').click(function() {
            toc = new Date();
            var time = toc - tic;
            if(taskTimes[$(this).parents('.slide-container').index() - 1]  != undefined){
                taskTimes[$(this).parents('.slide-container').index() - 1] += time;
            } else {
                taskTimes.push(time);
            }
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            superContainer.find('li.selected').each(function(index) {
                answers.push($(this).parents('.testOptions').children('li').index($(this).parents('.testOptions').find('li.selected')) + 1);
            });

            if (config.sendResultsURL !== null) {
                var collate = [];
                for (r = 0; r < answers.length; r++) {
                    collate.push('{"questionNumber":"' + parseInt(r + 1, 10) + '", "answer":"' + answers[r] + '"}');
                }
                $.ajax({
                    type: 'POST',
                    url: config.sendResultsURL,
                    data: '{"answers": [' + collate.join(",") + ']}',
                    complete: function() {
                        console.log("Dumping results completed");
                    }
                });
            }

            progressKeeper.hide();
            
            if (config.shortURL === null) {
                config.shortURL = window.location;
            };
            var results = checkAnswers(answers, testSolutions);
            
            for (var i = 0; i < results.length; i++) {
                if (results[i] === true) {
                    trueCounts[categories[i]]++;
                }
                cateTimes[categories[i]] += taskTimes[i];
                resultsDocs[categories[i]]+= '<div class="result-row">' + (results[i] === true ? 
                                                                       '<div class="correct">#' + (i + 1) + '<span></span></div>':
                                                                       '<div class="wrong">#'   + (i + 1) + '<span></span></div>');
                resultsDocs[categories[i]] += '<div class="resultsview-qhover">' + config.questions[i].question;
                resultsDocs[categories[i]] += "<ul>";

                for (iOpts = 0; iOpts < config.questions[i].testOptions.length; iOpts++) {
                    var classestoAdd = '';
                    if (config.questions[i].solution == iOpts + 1) {
                        classestoAdd += 'right';
                    }
                    if (answers[i] == iOpts + 1) {
                        classestoAdd += ' selected';
                    }
                    resultsDocs[categories[i]] += '<li class="' + classestoAdd + '">' + config.questions[i].testOptions[iOpts] + '</li>';
                }
                resultsDocs[categories[i]] += '</ul></div></div>';
            }
console.log(trueCounts);
console.log(results);
console.log(categories);
            function genResultDoc(categoryName, judgeSkill, score, cateTime, resultDoc) {
                return  '<h2 class = "qTitle">'+
                            'Result for Category ' + categoryName + '<br/>' +
                                                     judgeSkill + '<br/>' +
                                                     'Your score : ' + score + ' within ' + cateTime + ' ms' + 
                        '</h2>' + 
                        '<div class = "jquizzy-clear"></div>' + resultDoc + '<div class = "jquizzy-clear"></div>';
            };

            for (var i = 0; i < categories.length; i++) {
                scores[i] = roundReloaded(trueCounts[i]/ cateLength[i] * 100, 2);
                resultDoc = genResultDoc(   categoryNames[i], 
                                            judgeSkills(scores[i], config.resultComments), 
                                            scores[i], cateTimes[i], resultsDocs[i]);
                var competent = (scores[i] >= 60)? true: false;
                resultDoc += renderTaskList(competent, tasks[i]);

                superContainer.find('.result-keeper').append(resultDoc).show(500);
            }

            superContainer.find('.resultsview-qhover').hide();
            superContainer.find('.result-row').hover(function() {
                $(this).find('.resultsview-qhover').show();
            },
            function() {
                $(this).find('.resultsview-qhover').hide();
            });
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).next().fadeIn(500);
            });
            return false;
        });
    };
})(jQuery);