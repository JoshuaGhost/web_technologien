(function($) {
    $.fn.jquizzy = function(settings) {
        var defaults = {
            workerId: null,
            questions: null,
            tasks: null,
            startImg: 'images/start.jpg',
            endText: 'Test End!',
            category: null,
            categoryName: null,
            categoryNames: null,
            realTaskURL: null,
            shortURL: null,
            sendResultsURL: null,
            variation: null,
        };
        
        var authCodes = [
            {
                category: 0,
                codes:['w54qyga', 'aqg54t', '3a4t9q']
            },{
                category: 1,
                codes:['w6y547', 'az3654r', 'hsay56']
            },{
                category: 2,
                codes:['y548u0', '3r4thj', '54ij03r']
            },{
                category: 3,
                codes:['rgy5wat', 'e6sus', 'e6yusur']
            }
        ];

        var config = $.extend(defaults, settings);
        if (config.questions === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse questions.</h2></div>');
            return;
        }
        if (config.tasks === null & config.realTaskURL === null) {
            $(this).html('<div class="intro-container slide-container"><h2 class="qTitle">Failed to parse tasks.</h2></div>');
            return;
        }

        var
        category = config.category,
        variation = config.variation,
        superContainer = $(this);
        superContainer.addClass('main-quiz-holder');

        function renderIntroSlide(variation) {
            var introSlide;
            switch (variation) {
            case 0:
            case 1:
                introSlide = '<div class="intro-container slide-container">'+
                                '<a class="nav-start" href="#">'+
                                    '<p><h2>Step 2: Finishing the pre-test</h2></p>'+
                                    '<br/><br/>'+
                                    '<div class="description-text">';
                introSlide += '<p>Following is pre-test for '+config.categoryName+'.</p><br/>\
                            <p>During the test you are supposed to finish five questions, after which your score will be given.</p><br/>\
                            <p>You will meanwhile be recommended, whether tasks in terrian Information Finding are suitable for you.</p><br/>';
                break;
            case 2:
            case 3: 
                introSlide = '<div class="intro-container slide-container">'+
                                '<a class="nav-start" href="#">'+
                                    '<div class="description-text">' +
                                    '<p>Following is pre-test for the <i>&quotreal&quot</i> tasks.</p><br/>' +
                                    '<p>During the test you are supposed to finish several questions, which will be separate evaluated and shown.</p><br/>' +
                                    '<p>You will meanwhile be recommended, on which terrian of tasks you are good.</p><br/>';
            }
            introSlide += '<p><b>At the evaluation phase you\'ll reciecve a <div style="color:red"><i>AUTH-CODE</i></div>, which should be latter given to the CrowdFlower system in order to get your pay.</b></p></div>' + 
                        '<span><img src="'+config.startImg+'"></span>' + 
                        '</a></div>';
            return introSlide;
        }

        function renderExitSlide(variation) {
            return '<div class="results-container slide-container">' +
                        '<div class="question-number">' + 
                            config.endText + 
                        '</div>' +
                        '<div class="result-keeper"></div>' +
                    '</div>'+
                    '<div class="notice"></div>' + 
                    '<div class="progress-keeper" ><div class="progress"></div></div>';
        
        }

        var 
        answers = [],
        categories = [],
        solutions = [],
        questions = [],
        times = [0,0,0,0];//TODO

        function renderTest(q) {
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

        function renderContentSlideforCategory(category) {
            var ret = '', q = [];
            for (var i = 0; i < config.questions.length; i++) {
                if (config.questions[i].category == category) {
                    q.push(config.questions[i]);
                }
            }

            for (var i = 0; i < q.length; i++) {
                ret += '<div class="slide-container"><div class="question-number">' + (questions.length + 1) + '/' + config.questions.length + '</div>'
                
                ret += renderTest(q[i]) + '</div>';
                ret += '<div class="nav-container">';
                if (questions.length !== 0) {
                    ret += '<div class="prev"><a class="nav-previous" href="#">&lt;&nbsp;Previous</a></div>';
                }
                if (questions.length < config.questions.length - 1) {
                    ret += '<div class="next"><a class="nav-next" href="#">Next&nbsp;&gt;</a></div>';
                } else {
                    ret += '<div class="next final"><a class="nav-show-result" href="#">Finish</a></div>';
                }
                ret += '</div></div>';
                questions.push(q[i]);
                solutions.push(q[i].solution);
                categories.push(q[i].category);
            }         
            return ret;
        }

        function renderContent(variation) {
            var contentSlide = '';
            if (variation < 2) {
                contentSlide += renderContentSlideforCategory(category);
            } else {
                for (var i = 0; i < config.categoryNames.length; i++){
                    contentSlide += renderContentSlideforCategory(i);
                }
            }
            return contentSlide;
        }

        var 
        introSlide = renderIntroSlide(variation),
        contentSlides = renderContent(variation),
        exitSlide  = renderExitSlide(variation);

        superContainer.html(introSlide + contentSlides + exitSlide);
        
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
        
        var 
        results = [],
        tic, toc,
        usedTimes = [];

        superContainer.find('.nav-start').click(function() {
            $(this).parents('.slide-container').fadeOut(200,
            function() {
                $(this).next().fadeIn(200);
                progressKeeper.fadeIn(200);
            });
            tic = new Date();
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
            var 
            toc = new Date(),
            questionNum = $(this).parents('.slide-container').index();
            if (usedTimes[questionNum]===undefined) {
                usedTimes.push(questionNum);
                usedTimes[questionNum] = 0;
            }
            usedTimes[questionNum] += toc - tic;

            var thisLi = $(this);
            if (thisLi.hasClass('selected')) {
                thisLi.removeClass('selected');
            } else {
                thisLi.parents('.options').children('li').removeClass('selected');
                thisLi.addClass('selected');
            }
            if (typeof(logging)=="function") {
                dump = logging(dump, e, thisLi);
            }
            tic = new Date();
        });

        superContainer.find('.next').click(function() {
            var 
            toc = new Date(),
            questionNum = $(this).parents('.slide-container').index();
            if (usedTimes[questionNum]===undefined) {
                usedTimes.push(questionNum);
                usedTimes[questionNum] = 0;
            }
            usedTimes[questionNum] += toc - tic;
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
                    answers.push(thisSlide.find('li.selected').index())
                    results.push(thisSlide.find('li.selected').index() == solutions[testNum]);
            }

            notice.hide();
            thisSlide.fadeOut(100, function() {$(this).next().fadeIn(100);});
            progress.animate({
                width: progress.width() + Math.round(progressWidth / questionLength)
            }, 100);
            tic = new Date();
            return false;
        });

        superContainer.find('.final').click(function() {
            var thisSlide = $(this).parents('.slide-container');
            var testNum = questions.length - 1;
            if (categories[testNum] % 2 ==0) { //category 0 and 2
                if (thisSlide.find('input').val().length === 0) {
                    return false;
                }
            } else {
                if (thisSlide.find('li.selected').length === 0) {
                    return false;
                }
            }

            (function () {
                //dumping
                var workerId;
                if (config.workerId === null) {
                    workerId = localStorage.workerId;
                } else {
                    workerId = config.workerId;
                }

                var dump = {
                    workerId: workerId,
                    logDatas: []
                };
                for (var i = 0; i < questions.length; i++) {
                    var logData = {
                        questionNum:    i + 1,
                        result:         results[i],
                        'usedTime(ms)': usedTimes[i]
                    };
                    dump.logDatas.push(i);
                    dump.logDatas[i] = logData;
                }
                localStorage.answerLog = JSON.stringify(dump);
                console.log('dumpedData:');
                console.log(localStorage.answerLog);
            })();
            console.log(results);
            progressKeeper.hide();

            function calScore(num, dec) {
                var score = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
                return score;
            }

            function renderSuggestion(competent, variation) {
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

            if (variation < 2) {//variations 0 and 1
                var 
                trueCount = 0,
                resultSlide = '';
                for (var i = 0; i < results.length; i++) {
                    if (results[i]) {
                        trueCount++;
                    }
                    resultSlide += '<div class="result-row">'+
                                    '<div class="' + (results[i]? 'correct': 'wrong') + '">' + (i + 1) + 
                                        '<span></span>' +
                                    '</div>' +
                                 '</div>';
                }

                var 
                score = calScore(trueCount / questionLength * 100, 2),
                competent = (score >= 60)? true: false;
                resultSlide = '<h2 class="qTitle"><br/> Your score： ' + score + '</h2>' +
                                '<div class="jquizzy-clear"/>' + 
                                resultSlide + 
                                '<div class="jquizzy-clear"/>';
                resultSlide += '<h2 class="sugg">' + renderSuggestion(competent, variation)+"</h2>";
                var authnum = Math.round(Math.random()*10/4);
                resultSlide += '<div style="color: red">AUTH-CODE: ' + authCodes[category].codes[authnum] + '</div>';
                superContainer.find('.result-keeper').html(resultSlide).show(100);

            } else { //variations 2 and 3
                var
                trueCounts = [0, 0, 0, 0];
                resultSlide = '';
                resultSlides4EveryC = ['', '', '', ''];
                questionNums = [0, 0, 0, 0];
                for (var i = 0; i < results.length; i++) {
                    questionNums[categories[i]]++;
                    if (results[i]) {
                        trueCounts[categories[i]]++;
                    }
                    resultSlides4EveryC[categories[i]] += '<div class="result-row">'+
                                                            '<div class="' + (results[i]? 'correct': 'wrong') + '">' +
                                                                (i + 1) + 
                                                                '<span></span>' +
                                                            '</div>' +
                                                        '</div>';
                }

                for (var i = 0; i < config.categoryNames.length; i++) {
                    score = calScore(trueCounts[i] / questionNums[i] * 100, 2);
                    resultSlide += '<h2 class = "qTitle">'+
                                    'Result for Category ' + config.categoryNames[i] + '<br/><br/>' +
                                    'Your score : ' + score + ' within ' + times[i] + ' ms' + 
                                '</h2>' +
                                '<div class = "jquizzy-clear"/>' + resultSlides4EveryC[i];
                    if (score >= 80) {
                        var authnum = Math.round(Math.random()*10/4);
                        resultSlide += '<div style="color: red">AUTH-CODE: ' + authCodes[i].codes[authnum] + '</div>';
                    }
                 resultSlide += '<div class = "jquizzy-clear"/>';
                }

                resultSlide += '<div class="tasks">' +
                                '<div class="jquizzy-clear"/>' +
                                '<a href = "' + (variation==2?'s3_cat.html':'s4_tlist.html')+'">' +
                                    '<div class="p2">proceed&nbsp;&gt;</div>' +
                                '</a>' +
                            '</div>';

                superContainer.find('.result-keeper').html(resultSlide).show(500);
            }

            $(this).parents('.slide-container').fadeOut(100,
            function() {
                $(this).next().fadeIn(100);
            });
            return false;
        });
    };
})(jQuery);