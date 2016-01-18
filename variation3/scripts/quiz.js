(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            questions: null,
            startImg: 'images/start.jpg',
            endText: 'End!',
            shortURL: null,
            sendResultsURL: "#",
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
        var pretestContainer = $(this),
        answers = [],
        introDoc = '<div class="intro-container slide-container">\
                        <a class="nav-start" href="#">\
                            <p><div class="caption">Step2: Finishing the pre-test</div></p><br/><br/>\
                            <p>Following is pre-test for Information Finding.</p><br/>\
                            <p>During the test you are supposed to finish five questions, after which your score will not be shown. But the finishing sitiuation of your pre-test\'s is very important for our data analisis.</p><br/>\
                            <p>Good luck in the Pre-test and tasks.</p><br/><br/><br/>\
                            <span><img src="'+config.startImg+'"></span>\
                        </a>\
                    </div>',
        exitDoc = ' <div class="results-container slide-container">\
                        <div class="question-number">' + config.endText + '</div>\
                        <div class="result-keeper"></div>\
                    </div>',
        noticeNoChooseDoc = '\
                    <div class="notice"><br/>Please make a choice！</div>',

        progressbarDoc = '<div class="progress-keeper" ><div class="progress"></div></div>',

        contentDoc = '',
        questionNum,
        answerNum;
        pretestContainer.addClass('main-quiz-holder');

        for (questionNum = 0; questionNum < config.questions.length; questionNum++) {

            contentDoc += ' <div class="slide-container">\
                                <div class="question-number">' + (questionNum + 1) + '/' + config.questions.length + '</div>\
                                <div class="question">' + config.questions[questionNum].question + '</div>\
                                <ul class="answers">';
            for (answerNum = 0; answerNum < config.questions[questionNum].answers.length; answerNum++) {
                contentDoc += '     <li>' + config.questions[questionNum].answers[answerNum] + '</li>';
            }
            contentDoc += '     </ul>\
                                <div class="nav-container">';
            if (questionNum !== 0) {
                contentDoc += ' <div class="prev"><a class="nav-previous" href="#">&lt;&nbsp;Previous</a></div>';
            }
            if (questionNum < config.questions.length - 1) {
                contentDoc += ' <div class="next"><a class="nav-next" href="#">Next&nbsp;&gt;</a></div>';
            } else {
                contentDoc += ' <div class="next final"><a class="nav-show-result" href="#">Finish</a></div>';
            }
            contentDoc += '     </div>\
                            </div>';

            answers.push(config.questions[questionNum].correctAnswer);
        }

        pretestContainer.html(introDoc + contentDoc + exitDoc + noticeNoChooseDoc + progressbarDoc);
        var progress = pretestContainer.find('.progress'),
        progressBar = pretestContainer.find('.progress-keeper'),
        notice = pretestContainer.find('.notice'),
        progressWidth = progressBar.width(),
        userAnswers = [],
        questionLength = config.questions.length,
        slidesList = pretestContainer.find('.slide-container');

        function checkAnswers() {
            var corrections = [],
            flag = false;
            for (i = 0; i < answers.length; i++) {
                if (answers[i] == userAnswers[i]) {
                    flag = true;
                } else {
                    flag = false;
                }
                corrections.push(flag);
            }
            return corrections;
        }

        function roundReloaded(num, dec) {
            return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
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

        progressBar.hide();
        notice.hide();
        slidesList.hide().first().fadeIn(300);

        pretestContainer.find('li').click(function() {
            var thisLi = $(this);
            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                thisLi.parents('.answers').children('li').removeClass('selected');
                thisLi.addClass('selected');
            }
        });

        pretestContainer.find('.nav-start').click(function() {
           $(this).parents('.slide-container').fadeOut(300, function() {
                $(this).next().fadeIn(300);
                progressBar.fadeIn(300);
            });
            return false;
        });

        pretestContainer.find('.next').click(function() {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            notice.hide();
            $(this).parents('.slide-container').fadeOut(200, function() {
                $(this).next().fadeIn(200);
            });
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            },
            500);
            return false;
        });

        pretestContainer.find('.prev').click(function() {
            notice.hide();
            $(this).parents('.slide-container').fadeOut(500, function() {
                $(this).prev().fadeIn(500);
            });
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            500);
            return false;
        });

        pretestContainer.find('.final').click(function() {
            if ($(this).parents('.slide-container').find('li.selected').length === 0) {
                notice.fadeIn(300);
                return false;
            }
            pretestContainer.find('li.selected').each(function(index) {
                userAnswers.push($(this).parents('.answers').children('li').index($(this).parents('.answers').find('li.selected')) + 1);
            });

            progressBar.hide();
            var results = checkAnswers(),
            resultDoc = '',
            trueCount = 0,
            shareButton = '',
            score,
            url;

            if (config.shortURL === null) {
                config.shortURL = window.location
            };

            for (var i = 0; i < results.length; i++) {
                if (results[i] === true) {
                    trueCount++;
                    isCorrect = true;
                }
            }
            score = roundReloaded(trueCount / questionLength * 100, 2);
            competent = (score>=60)?true:false;

            resultDoc = '  <div class="results">\
                                <div class="caption">Step 3: Proceed to finish the real tasks!</div>\
                                <br/>\
                                <div class="proceed"><a href="#" >Continue</a></div>\
                            </div>'
            pretestContainer.find('.result-keeper').html(resultDoc).show(300);
            
            $(this).parents('.slide-container').fadeOut(500,
            function() {
                $(this).next().fadeIn(500);
            });

            ajaxData = '{"workerNr": '+config.workerNr+', "competent": '+competent+'}';

            if (config.sendResultsURL !== null) {
                $.ajax({
                    type: 'POST',
                    url: config.sendResultsURL,
                    data: ajaxData,
                    complete: function() {
                        console.log("result sending complete");
                        console.log(ajaxData);
                    }
                });
            }
        });
    };
})(jQuery);