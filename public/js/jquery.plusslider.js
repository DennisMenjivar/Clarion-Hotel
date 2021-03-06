/*
 * jQuery Plus Slider 1.2
 * By Jamy Golden
 * http://css-plus.com
 *
 * Copyright 2011
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function($){
    $.plusSlider = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        // Add a reverse reference to the DOM object
        base.$el.data('plusSlider', base);
		
		function copyLink(ptSlide) {
			var slideButton = ptSlide.find('a.readmore');
			$('#slidehref').empty();
			slideButton.clone().appendTo($('#slidehref'));
			
		}
		
		
        base.init = function(){
            base.options = $.extend({}, $.plusSlider.defaults, options);
            base.$slides = base.$el.children();
            base.$totalSlides = base.$slides.length;
			
			
            // Injected HTML elements 
            base.$el.wrap('<div class="plusSlider" />');
            base.$slides.addClass('child');
            base.$slides.eq(0).addClass('current');
			
            // Slider/Fader Settings
            if(base.options.sliderType == 'slider'){
                base.$slideWidth = base.$el.find(':first').outerWidth(true);
                base.$sliderWidth = base.$slideWidth * base.$totalSlides;
                base.$stopPosition = base.$sliderWidth - base.$slideWidth;
                base.$el.width(base.$sliderWidth);
                base.$el.children().show();
				
            }else{
                base.$el.parent().addClass('fader');
                base.$el.children(':first').show();
            }
            if(base.$totalSlides === 1){
                base.options.autoPlay = false;
                base.options.createArrows = false;
                base.options.createPagination = false;
            }
			
			// Overide default CSS width
			 if(base.options.width){
				base.$el.parent().width(base.options.width);
				base.$el.parent().css('margin-left','-'+(base.options.width/2)+'px');
			 }
			 // Overide default CSS height
			 if(base.options.height){
				base.$el.parent().height(base.options.height);
			 }
			
			
			copyLink(base.$slides.eq(0));
			
            // Begin settings.pagination
            if(base.options.createPagination){
                // #slider-controls
                if(base.options.paginationBefore){
                	base.$el.parent().before('<div class="plusSlider-controls" />');
                	base.$sliderControls = base.$el.parent().prev('.plusSlider-controls');
            	} else{
               		base.$el.parent().after('<div class="plusSlider-controls" />');
               		base.$sliderControls = base.$el.parent().next('.plusSlider-controls');
           		}
           		base.$sliderControls.wrap('<div class="plusSlider-controls-wrapper" />');
                // Pagination
                for (var i = 0; i < base.$totalSlides; i++){
                    base.$sliderControls.append('<a href="#" rel="' + i + '">' + (i + 1) + '</a>');
                }
                 if(base.options.paginationWidth){
                 	base.$sliderControls.width(base.$sliderControls.find('a').outerWidth(true) * base.$totalSlides);
             	}
                if(base.options.sliderType == 'slider'){
                    base.$sliderControls.find('a').click(function(){
                        var $this = $(this);
                        // Don't animate while animated
                        if(!base.$slides.is(':animated')){
                            base.$rel = $this.attr('rel');
							base.$slides.eq(base.$rel).addClass('current').siblings().removeClass('current');
                            $this.addClass('current').siblings().removeClass('current');
                            base.$el.animate({
                                left: base.$slideWidth * base.$rel * -1 + "px"
                            }, base.options.speed, base.options.sliderEasing);
                            // Clear Timer
                            if(base.options.autoPlay){
                                base.clearTimer();
                                base.beginTimer();
                            }
                        }
						copyLink(base.$el.children('.current'));
						
                        return false;
                    });
                }else{
                    base.$sliderControls.find('a').click(function(){
                        var $this = $(this);
                        // Don't animate while animated
                        if(!base.$slides.is(':animated')){
                            $this.addClass('current').siblings().removeClass('current');
                            base.$slides.eq($this.attr('rel')).siblings().css('zIndex', 500).removeClass('current');
                            base.$slides.eq($this.attr('rel')).css('zIndex', 100).addClass('current').fadeIn(base.options.speed, function(){
                                base.$slides.not('.current').hide();
                            });
                            // Clear Timer
                            if(base.options.autoPlay){
                                base.clearTimer();
                                base.beginTimer();
                            }
                        }
						copyLink(base.$el.children('.current'));
						
                        return false;
                    });
                }
                base.$sliderControls.find('a').eq(0).addClass('current');
            } // End settings.pagination
			
            // Begin Functions
            if(base.options.sliderType == 'slider'){
                base.nextSlide = function (direction){
                    if(direction !== false){
                        direction = true;
                    }
					
					
                    if(direction == true && !base.$el.is(':animated')){
						
                        //stop position -1 to fix IE8 inconsistancy
                        if(base.$el.position().left > (base.$stopPosition - 1) * -1){
                            if(base.options.createPagination){
                                base.$sliderControls.find('a.current').removeClass('current').next().addClass('current');
                            }
                            base.$el.animate({
                                left: "-=" + base.$slideWidth + "px"
                            }, base.options.speed, base.options.sliderEasing);
							base.$el.find('.current').removeClass('current').next().addClass('current');
                        }else{
                            if(base.options.createPagination){
                                base.$sliderControls.find('a:last').removeClass('current').siblings('a:first').addClass('current');
                            }
                            base.$el.animate({
                                left: 0
                            }, base.options.speed, base.options.sliderEasing);
							base.$slides.removeClass('current').eq(0).addClass('current');
							
                        }
						// cod inainte
                    }else if(direction == false && !base.$el.is(':animated')){
                        if(base.$el.position().left < 0 && !base.$slides.is(':animated')){
                            if(base.options.createPagination){
                                base.$sliderControls.find('a.current').removeClass('current').prev().addClass('current');
                            }
                            base.$el.animate({
                                left: "+=" + base.$slideWidth + "px"
                            }, base.options.speed, base.options.sliderEasing);
							base.$el.find('.current').removeClass('current').prev().addClass('current');
                        }else{
                            if(base.options.createPagination){
                                base.$sliderControls.find('a:first').removeClass('current').siblings('a:last').addClass('current');
                            }
                            base.$el.animate({
                                left: "-=" + base.$stopPosition + "px"
                            }, base.options.speed, base.options.sliderEasing);
                            base.$slides.removeClass('current');
                            base.$el.children(':last').addClass('current');
							
                        }
						// cod inapoi
                    }
					copyLink(base.$el.children('.current'));
					
                    if(base.options.autoPlay){
                        base.clearTimer();
                        base.beginTimer();
                    }
					
                }
            }else{
                base.nextSlide = function (direction){
                    if(direction !== false){
                        direction = true;
                    }
					
                    if(direction == true && !base.$slides.is(':animated')){
						
                        if(base.$el.children(':last').is('.current')){
                            if(base.options.createPagination){
                                base.$sliderControls.find('a:last').removeClass('current').siblings('a:first').addClass('current');
                            }
                            base.$el.children('.current').removeClass('current').css('zIndex', 60).siblings().css('zIndex', 50);
                            base.$el.children(':first').css('zIndex', 100).addClass('current').fadeIn(base.options.speed, function(){
                                base.$slides.not('.current').hide();
                            });
							
                        }else{
                            if(base.options.createPagination){
                                base.$sliderControls.find('a.current').removeClass('current').next().addClass('current');
                            }
                            base.$el.children('.current').removeClass('current').css('zIndex', 60).siblings().css('zIndex', 50).end().next().css('zIndex', 100).addClass('current').fadeIn(base.options.speed, function(){
                                base.$slides.not('.current').hide();
                            });
                        }
						
											
                    }else if(direction == false && !base.$slides.is(':animated')){
                        if(base.$el.children(':first').is('.current')){
                            if(base.options.createPagination){
                                base.$sliderControls.find('a:first').removeClass('current').siblings('a:last').addClass('current');
                            }
                            base.$el.children('.current').removeClass('current').css('zIndex', 60).siblings().css('zIndex', 50);
                            base.$el.children(':last').css('zIndex', 100).addClass('current').fadeIn(base.options.speed, function(){
                                base.$slides.not('.current').hide();
                            });
                        }else if(!base.$slides.is(':animated')){
                            if(base.options.createPagination){
                                base.$sliderControls.find('a.current').removeClass('current').prev().addClass('current');
                            }
                            base.$el.children('.current').removeClass('current').siblings().css('zIndex', 50).end().css('zIndex', 60).prev().css('zIndex', 100).addClass('current').fadeIn(base.options.speed, function(){
                                base.$slides.not('.current').hide();
                            });
                        }
                    }
					copyLink(base.$el.children('.current'));
					
                    if(base.options.autoPlay){
                        base.clearTimer();
                        base.beginTimer();
                    }
                }
				
            } // End Functions
			
			
            // Auto Play Begins
            if(base.options.autoPlay){
                base.clearTimer = function(){
                    // Clear the timer only ifit is set
                    if(base.timer){
                        window.clearInterval(base.timer);
                    }
                }
                base.beginTimer = function(){
                    base.timer = window.setInterval(function(){
                        base.nextSlide();
                    }, base.options.displayTime);
                }
                base.beginTimer();
				
                // Pause on hover
                /*if(base.options.pauseOnHover){
                    base.$el.hover(function(){
                        base.clearTimer();
                    }, function(){
                        base.beginTimer();
                    });
                }*/
				// Pause on hover
                //if(base.options.pauseOnHover){
					var playbtn = $('#playpause');
					playbtn.click(function(){
						if ( playbtn.hasClass('pause') ) {
							playbtn.text('play');
							playbtn.attr('class','play');
							base.clearTimer();
						} else if (playbtn.hasClass('play')) {
							playbtn.text('pause');
							playbtn.attr('class','pause');
							base.beginTimer();
						}
						return false;
                    });
                //}
            } // Auto Play Ends
			
            // Create Arrows
            if(base.options.createArrows){
                base.$el.parent().before('<a class="arrow prev" href="#">prev</a><a class="arrow next" href="#">next</a>').siblings('.next').click(function(){
                    base.nextSlide();
					return false;
                });
                base.$el.parent().siblings('.prev').click(function(){
                    base.nextSlide(false);
					return false;
                });
            } // End Arrow Creation
			
            // Keyboard navigation
            if(base.options.keyboardNavigation){
                base.$el.click(function(){
                    $('.activePlusSlider').removeClass('activePlusSlider');
                    $(this).addClass('activePlusSlider');
                });
                $(window).keyup(function(e){
                    if(base.$el.is('.activePlusSlider')){
                        if(e.keyCode == 39){
                            base.nextSlide();
                        }else if(e.keyCode == 37){
                            base.nextSlide(false);
                        }
                    }
                });
            } // End Keyboard navigation
        };
        // Run initializer
        base.init();
    };
    $.plusSlider.defaults ={
        createArrows: true, // Creates forward and backward navigation
        createPagination: true, // Creates Numbered pagination
        paginationBefore: false, // Place the pagination above the slider within the HTML
        paginationWidth: true, // Automatically gives the pagination a dynamic width
		
        displayTime: 500, // The amount of time the slide waits before automatically moving on to the next one. This requires 'autoPlay: true'
        speed: 200, // The amount of time it takes for a slide to fade into another slide
		
	autoPlay: true, // Creats a times, looped 'slide-show'
        keyboardNavigation: true, // The keyboard's directional left and right arrows function as next and previous buttons
        pauseOnHover: true, // Autoplay does not continue ifsomeone hovers over Plus Slider.
		
        sliderEasing: 'linear', // Anything other than 'linear' and 'swing' requires the easing plugin
        sliderType: 'slider', // Choose whether the carousel is a 'slider' or a 'fader'
		
	width: false, // Overide the default CSS width
	height: false // Overide the default CSS width
    };
    $.fn.plusSlider = function(options){
        return this.each(function(){
            (new $.plusSlider(this, options));
        });
    };
})(jQuery);
