(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            questions: null,
            startImg: 'images/start.gif',
            endText: 'End!',
            shortURL: null,
            sendResultsURL: null,
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
        var categoryNames = ['Information Finding',
                                                       'Valuation and Varification',
                                                       'Information Analysis',
                                                       'Content Creation',
                                                       'Surveys',
                                                       'Content Access'];
        var tic = new Date();
        var toc = new Date();
        var counter = 0;
        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }
        var superContainer = $(this),
        answers = [],
        categories = [],
        cateLength = [0,0,0,0,0,0],
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
        contentFob = '',
        questionsIteratorIndex,
        answersIteratorIndex;
        superContainer.addClass('main-quiz-holder');
        for (questionsIteratorIndex = 0; questionsIteratorIndex < config.questions.length; questionsIteratorIndex++) {
            contentFob += '<div class="slide-container"><div class="question-number">' + (questionsIteratorIndex + 1) + '/' + config.questions.length + '</div><div class="question">' + config.questions[questionsIteratorIndex].question + '</div><ul class="answers">';
            for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[questionsIteratorIndex].answers.length; answersIteratorIndex++) {
                contentFob += '<li>' + config.questions[questionsIteratorIndex].answers[answersIteratorIndex] + '</li>';
            }
            contentFob += '</ul><div class="nav-container">';
            if (questionsIteratorIndex !== 0) {
                contentFob += '<div class="prev"><a class="nav-previous" href="#">&lt;&nbsp;Previous</a></div>';
            }
            if (questionsIteratorIndex < config.questions.length - 1) {
                contentFob += '<div class="next"><a class="nav-next" href="#">Next&nbsp;&gt;</a></div>';
            } else {
                contentFob += '<div class="next final"><a class="nav-show-result" href="#">Finish</a></div>';
            }
            contentFob += '</div></div>';
            answers.push(config.questions[questionsIteratorIndex].correctAnswer);
            categories.push(config.questions[questionsIteratorIndex].category);
            cateLength[categories[questionsIteratorIndex]] ++;
        }
        superContainer.html(introFob + contentFob + exitFob);
        var progress = superContainer.find('.progress'),
        progressKeeper = superContainer.find('.progress-keeper'),
        notice = superContainer.find('.notice'),
        progressWidth = progressKeeper.width(),
        taskTimes = [],
        userAnswers = [],
        questionLength = config.questions.length,
        slidesList = superContainer.find('.slide-container');

        function checkAnswers() {
            var resultArr = [],
            flag = false;
            for (i = 0; i < answers.length; i++) {
                if (answers[i] == userAnswers[i]) {
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
        function judgeSkills(score) {
            var returnString;
            if (score === 100) return config.resultComments.perfect;
            else if (score > 90) return config.resultComments.excellent;
            else if (score > 70) return config.resultComments.good;
            else if (score > 50) return config.resultComments.average;
            else if (score > 35) return config.resultComments.bad;
            else if (score > 20) return config.resultComments.poor;
            else return config.resultComments.worst;
        }

        progressKeeper.hide();
        notice.hide();
        slidesList.hide().first().fadeIn(300);

        superContainer.find('li').click(function() {
            var thisLi = $(this);
            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                thisLi.parents('.answers').children('li').removeClass('selected');
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
            toc = new Date();
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            notice.hide();
            $(this).parents('.slide-container').fadeOut(300,
            function() {
                $(this).next().fadeIn(300);
            });
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            500);
            time = toc-tic;
            if (taskTimes[counter] != undefined){
                taskTimes[counter] +=time;
            } else {
                taskTimes.push(time);
            }
            counter++;
            tic = new Date();
            return false;
        });

        superContainer.find('.prev').click(function() {
            toc = new Date()
            notice.hide();
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).prev().fadeIn(500);
            });
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            500);
            time = toc-tic;
            if (taskTimes[counter]!=undefined){
                taskTimes[counter] += time;
            } else {
                taskTimes.push(time);
            }
            counter--;
            tic = new Date();
            return false;
        });

        superContainer.find('.final').click(function() {
            toc = new Date();
            time = toc-tic;
            if(taskTimes[counter]!=undefined){
                taskTimes[counter]+=time;
            } else {
                taskTimes.push(time);
            }
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            superContainer.find('li.selected').each(function(index) {
                userAnswers.push($(this).parents('.answers').children('li').index($(this).parents('.answers').find('li.selected')) + 1);
            });
            if (config.sendResultsURL !== null) {
                var collate = [];
                for (r = 0; r < userAnswers.length; r++) {
                    collate.push('{"questionNumber":"' + parseInt(r + 1, 10) + '", "userAnswer":"' + userAnswers[r] + '"}');
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
            var results = checkAnswers(),
            resultDocs= ['','','','','',''],
            trueCounts = [0, 0, 0, 0, 0, 0],
            cateTimes = [0, 0, 0, 0, 0, 0],
            shareButton = '',
            scores = [0,0,0,0,0,0],
            url;
            if (config.shortURL === null) {
                config.shortURL = window.location
            };

            for (var i = 0, toLoopTill = results.length; i < toLoopTill; i++) {
                if (results[i] === true) {
                    trueCounts[categories[i]]++;
                    isCorrect = true;
                }
                cateTimes[categories[i]] += taskTimes[i];
                resultDocs[categories[i]]+= '<div class="result-row">' + (results[i] === true ? 
                                                                                                            '<div class="correct">#'+(i + 1)+'<span></span></div>':
                                                                                                            '<div class="wrong">#'     +(i + 1)+'<span></span></div>');
                resultDocs[categories[i]] += '<div class="resultsview-qhover">' + config.questions[i].question;
                resultDocs[categories[i]] += "<ul>";

                for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[i].answers.length; answersIteratorIndex++) {
                    var classestoAdd = '';
                    if (config.questions[i].correctAnswer == answersIteratorIndex + 1) {
                        classestoAdd += 'right';
                    }
                    if (userAnswers[i] == answersIteratorIndex + 1) {
                        classestoAdd += ' selected';
                    }
                    resultDocs[categories[i]] += '<li class="' + classestoAdd + '">' + config.questions[i].answers[answersIteratorIndex] + '</li>';
                }
                resultDocs[categories[i]] += '</ul></div></div>';
            }
//TODO
            for (var i = 0; i < categories.length; i++) {
                scores[i] = roundReloaded(trueCounts[i]/ cateLength[i] * 100, 2)
                resultDoc = '<h2 class = "qTitle">Result for Category ' + categoryNames[i] + '<br/>' +
                                           judgeSkills(scores[i]) + '<br/>\
                                           Your score : ' + scores[i] + ' within '+cateTimes[i]+' ms</h2>' + shareButton + 
                                           '<div class = "jquizzy-clear"></div>' + resultDocs[i] + '<div class = "jquizzy-clear"></div>';
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