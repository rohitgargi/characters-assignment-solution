import '../scss/app.scss';
var List = require('./api/listApi.js');
var ConstObj = require('./constants/constants.js');
(function(){

    // All variables
    var listReq = {
        "method":"GET",
        "url":  ConstObj.constants().apiPath+"results",
        "request":{
            q:""
        }
    }
    var selectedList =[];

    //Process functions
    var process = {
        /**
         * init funtion gets called at very first time when page loads
         */
        "init": function(){
            process.charactersList(listReq);
            process.generateSearchBox();
            process.generateFilter();
            process.generateSort();
            process.addEventListenerToDom();
        },

        /**
         * Method to create DOM to generate search box
         */
        "generateSearchBox": function(){
            $('.search-wrap').html('<p class="search-lbl" for="search-box">Search By Name</p>'+
            '<input class="margin-top-5" name="searchText" id="search-box">'+
            '<button class="search-btn cursor-pointer">Search</button>'
            )
        },

        /**
         * Method to generate DOM for sort
         */
        "generateSort": function(){
            $('.sort-wrap').html('<select class="cursor-pointer">'+
                '<option>Sort by ID</option>'+
                '<option value="asc">Ascending</option>'+
                '<option value="desc">Descending</option>'+
            '</select>'
            );
        },

        /**
         * Method to return tags for selected filter list
         * @param {string} obj
         */
        "tagGenerator":function(obj){
            return '<div class="tag"><div class="pull-left">'+obj+'</div><div class="margin-left-10 pull-right remove-tag">x</div></div>'
        },

        /**
         * Method to generate DOM for filter
         */
        "generateFilter":function(){
            $('.filter-container').html(
                '<h1 class="filter-heading margin-bottom-5">Filters<span class="glyphicon glyphicon-minus-sign pull-right cursor-pointer"></span><span class="glyphicon glyphicon-plus-sign pull-right cursor-pointer"></span></h1>'+
                '<div class="clearfix list-filter">'+
                  '<fieldset class="filter-checkbox clearfix">'+
                    '<legend>Species</legend><br>'+
                    '<input type="checkbox" class="checkbox" value="Human"  name="species" />Human<br>'+
                    '<input type="checkbox" class="checkbox"  value="Mytholog" name="species" />Mytholog<br>'+
                    '<input type="checkbox" class="checkbox"  value="Alien" name="species" />Other species'+
                  '</fieldset>'+
                '</div>'+
                
                '<div class="clearfix list-filter">'+
                  '<fieldset class="filter-checkbox clearfix">'+
                    '<legend>Gender</legend><br>'+
                      '<input type="checkbox" class="checkbox" value="Male" name="gender" />Male<br>'+
                      '<input type="checkbox" class="checkbox" value="Female"  name="gender" />Female'+
                  '</fieldset>'+
                '</div>'+
                
        
                '<div class="clearfix list-filter">'+
                  '<fieldset class="filter-checkbox clearfix">'+
                    '<legend>Origin</legend><br>'+
                      '<input type="checkbox" class="checkbox" value="unknown" name="origin" />Unknown<br>'+
                      '<input type="checkbox" class="checkbox"  value="earth" name="origin" />Post-Apocalyptic Earth<br>'+
                      '<input type="checkbox" class="checkbox"  value="Nuptia"  name="origin" />Nuptia<br>'+
                      '<input type="checkbox" class="checkbox"  value="Other orgins" name="origin" />Other orgins.<br>'+
                  '</fieldset>'+
                '</div>'
            );
        },

        /**
         * Method to calculate logic for selected tags
         * @param {array} list 
         */
        "selctedFilterList":function(list){
            if($('.selected-tags tag') && $('.selected-tags .tag').length){
                $('.selected-tags .tag').remove();
            }
            var str = '';
            if(list && list.length){
                list.map(function(val){
                    str += process.tagGenerator(val)
                });
                $('.selected-tags').append(str);
            }
        },

        /**
         * Method to remove fiter and load listing post that.
         * @param {string} val 
         */

        "removeFilter":function(val){
            $('.tag').each(function(){
                if(this && $(this)[0] && $(this)[0].textContent.slice(0,-1) == val){
                    $(this).remove();
                }
            });
            setTimeout(function(){
                process.uncheckFilters(val);
            });
        },

        /**
         * on removing the filter this methods gets called
         * @param {string} val 
         */
        "uncheckFilters":function(val){
            console.log('uncheck filter',val)
            var selectedfilterList = $('.filter-container input:checked');
            if(selectedfilterList.length){
                $('.filter-container input:checked').each(function(){
                    if(this && $(this)[0] && $(this)[0].value === val){
                        $(this).click();
                    }
                });
            }else{
                $('.selected-filter-lbl').css('display','none')
            }
            
        },

        /**
         * Method to create DOM for tiles
         * @param {} obj 
         */
        "tilGenerator":function(obj){
            if(!obj){
                return '';
            }
            return  '<div class="col col-xs-6 col-sm-6 col-md-4 col-lg-3">'+
                            '<div class="list-item">'+
                                '<figure class="character-fig">'+
                                    '<img src='+obj.image+' alt='+obj.name+' >'+
                                    '<figcaption class="box-top-area">'+
                                        '<h3 class="char-name">'+obj.name+'</h3>'+
                                        '<h4 class="char-id margin-top-5">id: '+obj.id+' - '+obj.created+'</h4>'+
                                    '</figcaption>'+
                                '</figure>'+
                                '<ul>'+
                                    '<li>'+
                                        '<div class="property-area">Status</div>'+
                                        '<div class="value-area">'+obj.status+'</div></li>'+
                                        '<li>'+
                                            '<div class="property-area">Species</div>'+
                                            '<div class="value-area">'+obj.species+'</div> </li>'+
                                        '<li>'+
                                            '<div class="property-area">Gender</div>'+
                                            '<div class="value-area">'+obj.gender+'</div></li>'+
                                        '<li>'+
                                            '<div class="property-area">Origin</div>'+
                                            '<div class="value-area">'+obj.origin.name+'</div></li>'+
                                        '<li>'+
                                            '<div class="property-area">Last Location</div>'+
                                            '<div class="value-area">'+obj.location.name+'</div>'+
                                        '</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'
        },

        /**
         * Method to load characters list by hitting API
         * @param {} listReq 
         */
        "charactersList":function(listReq){
                List.listApi(listReq).getList.then(function(data){
                    var sum ='';
                    data.map(function(val){
                        val.created = process.getDateStr(val.created);
                        sum += process.tilGenerator(val)
                    });
                    $('.list-container').html(sum);
                    if($('.no-result-found').length){
                        process.noResultDOM(false);
                    }
                    if(data && !data.length){
                        process.noResultDOM(true);
                    }
                    if($('.error-handler') && $('.error-handler').length){
                        $('.error-handler').remove();
                    }
                
            },function(err){
                console.error(err);
                process.errorHandlerDOM();
            })
        },

        /**
         * Method to generate DOM when there is no item in the list
         * @param {boolean} status 
         */
        "noResultDOM": function(status){
            if(status){
                $('.list-container').append(
                    '<div class="no-result-found">'+
                        '<i class="glyphicon glyphicon-search"></i>'+
                        '<p class="text margin-top-10">No result found. Try different query in search and filter </p>'+
                    '</div>'
                );
            }else{
                $('no-result-found').remove();
            }

        },

        /**
         * Method to generate error handler 
         */
        "errorHandlerDOM": function(){
            $('.list-container').append(
                '<div class="error-handler">'+
                    '<span class="glyphicon glyphicon-exclamation-sign"></span>'+
                    '<p>Something broken!! Please visit after some time</p>'+
                '</div>'
            )
        },

        /**
         * Add event listener to the DOM
         */
        "addEventListenerToDom":function(){
            if(document.querySelector('.search-btn')){
                var el=  document.querySelector('.search-btn');
                el.addEventListener('click',function(){
                    var queryString = document.querySelector('input[name=searchText]').value;
                    listReq.request.q="";
                    listReq.request.q = queryString && queryString.length ? 'name_like='+queryString : "";
                    process.charactersList(listReq);
                })

                document.getElementById('search-box').addEventListener('change',function(e){
                    if(e.target && e.target.id === 'search-box' && !e.target.value.length){
                        listReq.request.q="";
                        process.charactersList(listReq);
                    }
                });
             }
         
             if(document.querySelector('.filter-container')){
                 $(document).on('click','.filter-heading',function(e){
                     console.log(e.target)
                    if($(e.target).hasClass('glyphicon-minus-sign')){
                        $('.glyphicon-minus-sign').css('display','none');
                        $('.glyphicon-plus-sign').css('display','inline');
                        $('.list-filter').each(function(){
                            $(this).css('display','none');
                        });
                    }else if($(e.target).hasClass('glyphicon-plus-sign')){
                        $('.glyphicon-minus-sign').css('display','inline');
                        $('.glyphicon-plus-sign').css('display','none');
                        $('.list-filter').each(function(){
                            $(this).css('display','block');
                        });
                    }else{
                        $.noop();
                    }
                 });
                 $(document).on('click','.filter-container',function(e){
                     var checklist = [];
                     if(e.target && e.target.type === 'checkbox'){

                        selectedList=[];
                        $("input[type=checkbox]:checked").each(function(i,val){
                            checklist.push( {
                                type:$(this).siblings('legend').text(),
                                value:$(val)[0].value
                            });
                            selectedList.push($(val)[0].value);
                        });
                        setTimeout(function(){
                            
                            if(selectedList && selectedList.length){
                                $('.selected-filter-lbl').css('display','block')
                            }else{
                                $('.selected-filter-lbl').css('display','none')   
                            }
                           process.selctedFilterList(selectedList);
                        });
                        var checkedStr = process.getQueryString(checklist);
                        listReq.request.q = checkedStr;
                        process.charactersList(listReq);
                     }
                     
                 });
             }
         
             if(document.querySelector('.selected-tags')){
                 var selectedValue = null;
                 $(document).on('click','.selected-tags',function(e){
                     if(e.target && $(e.target).hasClass('remove-tag')){
                         selectedValue = e.target.closest('.tag').textContent ? e.target.closest('.tag').textContent.slice(0,-1) : null;
                     }
                     if(selectedValue){
                        process.removeFilter(selectedValue)
                     }
                 });
             }
             
     
             var sortSelector =  $('.sort-wrap select');
     
             sortSelector.on('change',function(e){
                 var selectedValue = e.target && e.target.value ? e.target.value : null;
                 var str = "";
                 if(selectedValue){
                    str+='_sort=id&_order='+selectedValue;
                 }
                 listReq.request.q = str;
                 process.charactersList(listReq);
             })
        },

        /**
         * Method to create querystring for api on filter applied
         * @param {array} typeData 
         */
        "getQueryString": function(typeData){
            var str = "";
            typeData.map(function(val,index){
                var propertyVal = process.calculateTypePropery(val.type);
                if(index< typeData.length-1){
                    if(val.value && val.value === 'earth'){
                        str+='origin.name=Earth (Replacement Dimension)&origin.name=Earth (C-137)&';
                    }else{
                        str+=propertyVal+'='+val.value+'&';
                    }
                    
                }else{
                    if(val.value && val.value === 'earth'){
                        str+='origin.name=Earth (Replacement Dimension)&origin.name=Earth (C-137)';
                    }else{
                        str+=propertyVal.toLowerCase()+'='+val.value;
                    }
                    
                }
                
            });
            return str;
        },

        /**
         * Method to generate type property in querystring 
         * @param {string} type 
         */
        "calculateTypePropery":function(type){
            var str="";
            if(type && type.length){
                switch(type.toLowerCase()){
                    case 'species':
                    case 'gender':
                        return str = type.toLowerCase();
                        break;
                    case 'origin':
                        return str = type.toLowerCase()+".name";
                        break;
                    default:
                        $.noop();
                        break;
                }
            }
            return str;
        },

        /**
         * Method to calaculate total years characters created on
         * @param {Date} date 
         */
        "getDateStr":function(date){
            var diff = new Date().getFullYear() - new Date(date).getFullYear();
            if(diff>1){
                return 'created '+ (new Date().getFullYear() - new Date(date).getFullYear()) +' years ago';
            }else{
                return 'created '+ (new Date().getFullYear() - new Date(date).getFullYear()) +' year ago';
            }
        }   

    }

    // Initiate app
    process.init();

})(List,ConstObj);
