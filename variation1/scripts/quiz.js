﻿(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            questions: null,
            startImg: 'images/start.jpg',
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

        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }
        var superContainer = $(this),
        answers = [],
        introFob = '<div class="intro-container slide-container">\
                        <a class="nav-start" href="#">\
                            <p><h2>Step2: Finishing the pre-test</h2></p><br/><br/>\
                            <p>Following is pre-test for Information Finding.</p><br/>\
                            <p>During the test you are supposed to finish five questions, after which your score will be given.</p><br/>\
                            <p>You will meanwhile be recommended, whether tasks in terrian Information Finding are suitable for you</p><br/>\
                            <p>Good luck in the Pre-test</p><br/><br/><br/>\
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
        }
        superContainer.html(introFob + contentFob + exitFob);
        var progress = superContainer.find('.progress'),
        progressKeeper = superContainer.find('.progress-keeper'),
        notice = superContainer.find('.notice'),
        progressWidth = progressKeeper.width(),
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

        function genSugesstion(competent) {
            if (competent) {
                return 'Congratulations, you have proved your competence in terrian Information Finding. You are welcome to participate the real job:<br/><br/>\
                                <div class="proceed"><a href="#" >proceed !</a></div><br/>'
            }
            return 'Sorry, but you seem not ready for the tasks in Information Finding. Therefore you are not suggest to proceed<br/><br/>\
                                <div class = "proceed-faded"><a href="#">proceed ?</a></div><br/>'
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
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).next().fadeIn(500);
                progressKeeper.fadeIn(500);
            });
            return false;
        });
        superContainer.find('.next').click(function() {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            notice.hide();
            $(this).parents('.slide-container').fadeOut(200,
            function() {
                $(this).next().fadeIn(200);
            });
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            500);
            return false;
        });
        superContainer.find('.prev').click(function() {
            notice.hide();
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).prev().fadeIn(500);
            });
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            500);
            return false;
        });
        superContainer.find('.final').click(function() {
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
                        console.log("OH HAI");
                    }
                });
            }
            progressKeeper.hide();
            var results = checkAnswers(),
            resultSet = '',
            trueCount = 0,
            shareButton = '',
            score,
            url;
            if (config.shortURL === null) {
                config.shortURL = window.location
            };
            for (var i = 0,
            toLoopTill = results.length; i < toLoopTill; i++) {
                if (results[i] === true) {
                    trueCount++;
                    isCorrect = true;
                }
                resultSet += '<div class="result-row">' + (results[i] === true ? "<div class='correct'>#"+(i + 1)+"<span></span></div>": "<div class='wrong'>#"+(i + 1)+"<span></span></div>");
                resultSet += '<div class="resultsview-qhover">' + config.questions[i].question;
                resultSet += "<ul>";
                for (answersIteratorIndex = 0; answersIteratorIndex < config.questions[i].answers.length; answersIteratorIndex++) {
                    var classestoAdd = '';
                    if (config.questions[i].correctAnswer == answersIteratorIndex + 1) {
                        classestoAdd += 'right';
                    }
                    if (userAnswers[i] == answersIteratorIndex + 1) {
                        classestoAdd += ' selected';
                    }
                    resultSet += '<li class="' + classestoAdd + '">' + config.questions[i].answers[answersIteratorIndex] + '</li>';
                }
                resultSet += '</ul></div></div>';
            }
            score = roundReloaded(trueCount / questionLength * 100, 2);
            competent = (score>=60)?true:false;
            resultSet = '<h2 class="qTitle">' + judgeSkills(score) + '<br/> Your score： ' + score + '</h2>' + shareButton + '<div class="jquizzy-clear"></div>' + resultSet + '<div class="jquizzy-clear"></div>';
            suggestion = '<h2 class="sugg">'+genSugesstion(competent)+"</h2>"
            superContainer.find('.result-keeper').html(resultSet).show(300);
            superContainer.find('.result-keeper').append(suggestion).show(300);
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