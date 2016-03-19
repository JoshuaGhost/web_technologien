(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            questions: null,
            tasks: null,
            startImg: 'images/start.jpg',
            endText: 'Test End!',
            categoryName: null,
            categoryNames: null,
            realTaskURL: null,
            shortURL: null,
            sendResultsURL: null,
            variation: null,
        };
        
        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }
        if (config.tasks === null & config.realTaskURL === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse tasks.</h2></div>');
            return;
        }

        var variation = config.variation,
        superContainer = $(this),
        answers = [];
console.log(variation);
        var
        introFob = '<div class="intro-container slide-container">'+
                        '<a class="nav-start" href="#">'+
                            '<p><h2>Step' + (2 - variation / 2) + ': Finishing the pre-test</h2></p>'+
                            '<br/><br/>'+
                            '<div class="description-text">';
        switch (variation) {
            case 0:
            case 1: introFob += '<p>Following is pre-test for '+config.categoryName+'.</p><br/>\
                            <p>During the test you are supposed to finish five questions, after which your score will be given.</p><br/>\
                            <p>You will meanwhile be recommended, whether tasks in terrian Information Finding are suitable for you</p><br/>';
                    break;
            case 2:
            case 3: introFob += '<p>Following is pre-test for the <i>&quotreal&quot</i> tasks</p><br/>\
                            <p>During the test you are supposed to finish several questions, which will be separate evaluated and shown.</p><br/>\
                            <p>You will meanwhile be recommended, on which terrian of tasks you are good.</p><br/><br/>'
        }
        introFob += '<p><b><i>Good luck in the Pre-test</i></b></p></div>' + 
                    '<br/><br/><br/>'+
                    '<span><img src="'+config.startImg+'"></span>' + 
                    '</a></div>';

        var
        exitFob = '<div class="results-container slide-container"><div class="question-number">' + config.endText + '</div><div class="result-keeper"></div></div><div class="notice"></div><div class="progress-keeper" ><div class="progress"></div></div>',
        contentFob = '';
        superContainer.addClass('main-quiz-holder');

        var 
        answers = [],
        categories = [],
        solutions = [];

        function genTest(q) {
            var ret = '<div class="question">' + q.question;
            switch (q.category) {
                case 0://content creation
                    ret += '<br/><br/><div class="quote"><img src ="' + q.quote +'"/></div><br/>';
                    ret += '<div class="input-box"><input type="text"/></div><br/><br/>';
                    return ret;
                case 1://interpretation and analysis
                    ret += '<div class="quote">' + q.quote + '</div>';
                    ret += '<ul class="options">' + 
                                '<li>positive</li>' + 
                                '<li>neutral</li>' + 
                                '<li>negative</li>';
                    ret += '</ul>';
                    return ret;
                case 2://information finding
                    ret += '<div class="quote">' + q.quote + "</div>";
                    ret += '<div class="input-box"><input type="text"></input></div>';
                    return ret;
                case 3://varification and validation
                    ret += '<ul class="options">';
                    for (var i = 0; i < q.options.length; i++) {
                        ret += '<li>' + q.options[i] + '</li>';
                    }
                    ret += '</ul>';
                    return ret;
            }
            return "fail";
        }

        for (var i = 0; i < config.questions.length; i++) {
            contentFob += '<div class="slide-container"><div class="question-number">' + (i + 1) + '/' + config.questions.length + '</div>'
            
            contentFob += genTest(config.questions[i]) + '</div>';
            contentFob += '<div class="nav-container">';
            if (i !== 0) {
                contentFob += '<div class="prev"><a class="nav-previous" href="#">&lt;&nbsp;Previous</a></div>';
            }
            if (i < config.questions.length - 1) {
                contentFob += '<div class="next"><a class="nav-next" href="#">Next&nbsp;&gt;</a></div>';
            } else {
                contentFob += '<div class="next final"><a class="nav-show-result" href="#">Finish</a></div>';
            }
            contentFob += '</div></div>';
            solutions.push(config.questions[i].solution);
            categories.push(config.questions[i].category);
        }
        superContainer.html(introFob + contentFob + exitFob);
        
        var progress = superContainer.find('.progress'),
        progressKeeper = superContainer.find('.progress-keeper'),
        notice = superContainer.find('.notice'),
        progressWidth = progressKeeper.width(),
        answers = [],
        questionLength = config.questions.length,
        slidesList = superContainer.find('.slide-container');

        var dump = [];

        progressKeeper.hide();
        notice.hide();
        slidesList.hide().first().fadeIn(100);
        
        var results = [];

        superContainer.find('.nav-start').click(function() {
            $(this).parents('.slide-container').fadeOut(200,
            function() {
                $(this).next().fadeIn(200);
                progressKeeper.fadeIn(200);
            });
            return false;
        });

        superContainer.find('.prev').click(function() {
            notice.hide();
            $(this).parents('.slide-container').fadeOut(100,
            function() {
                $(this).prev().fadeIn(100);
            });
            if (results.length > 0) {
                results.pop();
            }
            progress.animate({
                width: progress.width() - Math.round(progressWidth / questionLength)
            },
            100);
            return false;
        });

        superContainer.find('li').on("click", function(e) {
            var thisLi = $(this);
            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                console.log(thisLi.parents('.options').children('li'));
                thisLi.parents('.options').children('li').removeClass('selected');
                thisLi.addClass('selected');
            }
            if (typeof(logging)=="function") {
                dump = logging(dump, e, thisLi);
            }
        });

        superContainer.find('.next').click(function() {
            var thisSlide = $(this).parents('.slide-container');
            var testNum = results.length;
            //'+((category==0|category==2)?'Please enter your answer!':'Please choose an option!')+'
            switch (categories[testNum]) {
                case 0://content creation
                case 2://information finding
                    if (thisSlide.find('input').val().length === 0) {
                        notice.html('Please enter your answer!');
                        notice.fadeIn(100);
                        return false;
                    }
                    console.log(thisSlide.find('input').val());
                    console.log(solutions[testNum]);
                    answers.push(thisSlide.find('input').val())
                    results.push(thisSlide.find('input').val() == solutions[testNum]);
                    break;
                case 1://interpretation and analysis
                case 3://varification and validation
                    if (thisSlide.find('li.selected').length === 0) {
                        notice.html('Please choose an option!');
                        notice.fadeIn(100);
                        return false;
                    }
                    console.log(thisSlide.find('li.selected').index());
                    console.log(solutions[testNum]);
                    answers.push(thisSlide.find('li.selected').index())
                    results.push(thisSlide.find('li.selected').index() == solutions[testNum]);
            }

            notice.hide();
            thisSlide.fadeOut(100, function() {$(this).next().fadeIn(100);});
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            }, 100);
            return false;
        });

        superContainer.find('.final').click(function() {
            var thisSlide = $(this).parents('.slide-container');
            var testNum = results.length - 1;
            switch (categories[testNum]) {
                case 0:
                case 2:
                    console.log(thisSlide.find('input').val().length)
                    if (thisSlide.find('input').val().length === 0) {
                        return false;
                    }
                    break;
                case 1:
                case 3:
                    if (thisSlide.find('li.selected').length === 0) {
                        return false;
                    }
                    break;
            }

            (function () {
                //dumping
                localStorage.answerLog = JSON.stringify(dump);
                console.log('dumpedData:');
                console.log(localStorage.answerLog);
            })();
            console.log(results);
            progressKeeper.hide();

            function roundReloaded(num, dec) {
                var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
                return result;
            }

            function genSugesstion(competent, variation) {
                var ret = '',
                    buttonClass = '';
                switch (variation) {
                case 0:
                    if (competent) {
                        ret += 'Congratulations, you have proved your competence under category ' +  config.categoryName + ' and are welcomed to participate the real job:<br/><br/> ' +
                            '<div class="tasks">';
                        buttonClass = 'proceed';
                    } else {
                        ret += 'Sorry, but you seem not ready for tasks in ' + config.categoryName + '. Therefore you are not suggest to proceed<br/><br/>' +
                            '<div class = "tasks">';
                        buttonClass = 'proceed-faded';
                    }
                    ret += '<div class="jquizzy-clear"></div>';
                    ret += '<ul class = "task-list">';
                    for (var i = 0; i < config.tasks.length; i++) {
                    ret += '<li class="task-intry">' +
                                '<a href="'+config.tasks[i].realTaskURL+'">' +
                                    '<div class="'+buttonClass+'">'+config.tasks[i].taskTitle+'</div>'+
                                '</a>' +
                            '</li>';
                    }
                    ret += '</ul></div>';
                    return ret;
                case 1:
                    if (competent) { 
                        ret += 'Congratulations, you have proved your competence for this task and are welcomed to contribute to it<br/><br/>' +
                        '<div class = "tasks">';
                        buttonClass = 'proceed';
                    } else {
                        ret += 'Sorry, but you seem not to be read for this task. Therefore you\'re not suggest to proceed<br/><br/>' +
                        '<div class="tasks">';
                        buttonClass = 'proceed-faded';
                    }
                    ret += '<div class="jquizzy-clear"></div>';
                    ret += '<a href = "' + config.realTaskURL+'">' +
                                '<div class="' + buttonClass + '">proceed&nbsp;&lt;</div>' +
                            '</a>';
                    ret += '</div>';
                    return ret;
                case 2:
                    ret += 'Pre-test finished, here are results of your tests<br/><br/>';

                }
                return ret;
            }

            if (variation / 2 == 0) {
                var 
                trueCount = 0,
                resultFob = '';
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    if (results[i]) {
                        trueCount++;
                    }
                    resultFob += '<div class="result-row">'+
                                    '<div class="' + (results[i]? 'correct': 'wrong') + '">' + (i + 1) + 
                                        '<span></span>' +
                                    '</div>' +
                                 '</div>';
                }

                var 
                score = roundReloaded(trueCount / questionLength * 100, 2),
                competent = (score >= 60)? true: false;
                resultFob = '<h2 class="qTitle"><br/> Your score： ' + score + '</h2>' +
                                '<div class="jquizzy-clear"/>' + 
                                resultFob + 
                                '<div class="jquizzy-clear"/>';
                resultFob += '<h2 class="sugg">' + genSugesstion(competent, variation)+"</h2>";
                superContainer.find('.result-keeper').html(resultFob).show(100);

            } else {

                var
                trueCount = [0, 0, 0, 0];
                resultFob = '';
                resultFobs4EveryC = ['', '', '', ''];

                for (var i = 0; i < results.length; i++) {
                    if (results[i]) {
                        truecount++;
                    }
                    resultFobs4EveryC[categories[i]] += '<div class="result-row">'+
                                                            '<div class="' + (results[i]? 'correct': 'wrong') + '">' +
                                                                (i + 1) + 
                                                                '<span></span>' +
                                                            '</div>' +
                                                        '</div>';
                }

                for (var i = 0; i < categoryNames.length; i++) {
                    scores = roundReloaded(trueCount[i] / 5 * 100, 2);
                    resultFob += '<h2 class = "qTitle">'+
                                    'Result for Category ' + categoryNames[i] + '<br/><br/>' +
                                    'Your score : ' + score + ' within ' + times[i] + ' ms' + 
                                '</h2>' + 
                                '<div class = "jquizzy-clear"/>' + resultFobs4EveryC[i] + '<div class = "jquizzy-clear"/>';
                }

                resultFob += '<div class="tasks">' +
                                '<div class="jquizzy-clear"/>' +
                                '<a href = "' + config.realTaskURL+'">' +
                                    '<div class="proceed">proceed&nbsp;&lt;</div>' +
                                '</a>' +
                            '</div>';

                superContainer.find('.result-keeper').html(resultDoc).show(500);
            }

            $(this).parents('.slide-container').fadeOut(100,
            function() {
                $(this).next().fadeIn(100);
            });
            return false;
        });
    };
})(jQuery);