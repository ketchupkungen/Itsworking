function Table(
        uniquePrefix,
        canEdit,
        rest,
        tableTitle,
        containerId,
        headersArr,
        fieldsArr,
        searchOptions,
        modalPreviewCol,
        populate,
        fieldsHeadersSettingsPop,
        modalPreviewColPop
        ) {

    this.REST = rest;
    this.uniquePrefix = uniquePrefix;
    this.canEdit = canEdit;
    this.tableTitle = tableTitle;
    this.containerId = containerId; // the container where the table is inserted
    this.headers = headersArr;
    this.fieldsArr = fieldsArr;
    this.fieldsHeadersSettingsPop = fieldsHeadersSettingsPop; // {name:'Education'} -> where name = real colName & Edu.. = name of Header
    this.populate = populate; // EX: _educations
    this.template;
    this.searchOptions = searchOptions;
    this.modalPreviewCol = modalPreviewCol;
    this.modalPreviewColPop = modalPreviewColPop;
    this.maxPopDepth = 0;
    this.SHOW_INVERT = false;
    this.SHOW_NORMAL = false;
    this.headersFieldsMap = {};
    this.offset = 0;
    this.initialLimit = searchOptions._limit;
    this.limit = 0;
    this.newElemMap = {};
    this.specialUrl;
    this.alwaysInvert;

    this.setShowAlwaysInvert = function () {
        this.alwaysInvert = true;
    };

    Table.prototype.show = function (initial) {
        var that = this;
        this.maxPopDepth = 0;

        if (this.alwaysInvert) {
            that.showInvert();
            return;
        }

        if (initial) {
            this.SHOW_INVERT = false;
            this.SHOW_NORMAL = false;
        }

        check();

        $(window).resize(function () {
            check();
        });

        function check() {
            if ($(document).width() < 1000 && that.SHOW_INVERT === false) {
                that.maxPopDepth = 0;
                that.showInvert();
                that.SHOW_INVERT = true;
                that.SHOW_NORMAL = false;
            }

            if ($(document).width() > 1000 && that.SHOW_NORMAL === false) {
                that.maxPopDepth = 0;
                that.showNormal();
                that.SHOW_INVERT = false;
                that.SHOW_NORMAL = true;
            }
        }
    };


    this.showNormal = function () {
        $(document).off('DOMNodeInserted');
        $(this.containerId).empty();
        this.loadTemplateBasic();
        //
        var submit = $(this.template).find('input');
        $(submit).attr('id', this.CREATE);
        //
        this.setTableTitle();
        this.mapHeadersAndFields();
        this.buildTableHeaders();
        //
        this.maxTDinTR = 0;
        //
        this.offset = 0;
        this.searchOptions._skip = 0;
        this.limit !== 0 ? this.searchOptions._limit = this.limit * 2 : undefined;
        //
        this.buildTable();
        //
        $(this.containerId).append(this.template);
    };

    //#STATIC
    Table._find = function (obj) {
        return "find/" + JSON.stringify(obj);
    };

    this.setSpecialUrl = function (specialUrl) {
        this.specialUrl = specialUrl;
    };

    this.buildTable = function () {
        var that = this;
        var table = $(this.template).find('table');
        var tbody = $(this.template).find('tbody');
        $(this.template).find('table').addClass('.' + this.uniquePrefix + '-table');
        //
        var url;
        //
        this.specialUrl ? url = this.specialUrl : url = Table._find(this.searchOptions);

        this.REST.find(url, function (data, textStatus, jqXHR) {
            $(data).each(function (i, value) {
                //
                var tr = $("<tr class='tbody-tr'>");
                $(tr).addClass(that.uniquePrefix + "-tbody-tr");
                //
                that.buildRegular(value, tr);
                //
                //
                that.buildPopulattion(value, tr);
                //
                that.markLastRow(tr, data, i, 'last-tr-' + that.uniquePrefix);
                //
                $(tbody).append(tr);
                //
            });
            //
            that.fillAllEmptyTrElems();
            that.fillAllEmptyThElems();
            //
            $(table).prepend($("<div class='table-ready'></div>"));
            //
        });
    };

    this.fillAllEmptyThElems = function () {
        var thead_tr = $(this.template).find('#thead-tr');
        var amount_th = $(thead_tr).children().length;
        maxTDinTR = this.findMaxTdInTr();
        while (amount_th < maxTDinTR) {
            $(thead_tr).append("<th class='empty-th'>");
            amount_th++;
        }
    };

    this.maxTDinTR = 0;

    this.fillAllEmptyTrElems = function () {
        var trArr = $("."+this.uniquePrefix + "-tbody-tr");
        maxTDinTR = this.findMaxTdInTr();


        for (var i = 0; i < trArr.length; i++) {
            while ($(trArr[i]).children('td').length < maxTDinTR) {
                $(trArr[i]).append("<td class='empty'>");
            }
        }
    };

    this.buildPopulattion = function (value, tr) {
        var that = this;
        if (this.populate) {

            var colNames = Object.keys(this.fieldsHeadersSettingsPop);
            var colNameModalPreviewPop = Object.keys(this.fieldsHeadersSettingsPop)[0];

            var pop = value[this.populate];

            var popDepth = 0;

            $(pop).each(function (i, popObj) {
                //
                $(colNames).each(function (i, val) {
                    var td = $("<td class='td-populated'>");
                    //
                    if (colNames[i] === colNameModalPreviewPop) {
                        that.setModalPreviewPop(td, popObj, colNames[i]);
                    } else {
                        $(td).append(popObj[colNames[i]]);
                    }
                    //
                    $(td).data("_id", popObj._id);
                    $(tr).append(td);
                });
                //
                popDepth++;
                //
                if (popDepth > that.maxPopDepth) {
                    that.maxPopDepth = popDepth;
                    that.addTableHeadersIfPopulated(colNames[i]);
                }
                //
            });
        }
    };


    this.addTableHeadersIfPopulated = function () {
        var that = this;
        var thead_tr = $(this.template).find('#thead-tr');
        $.each(this.fieldsHeadersSettingsPop, function (colName, colHeader) {
            var th = $("<th class='th-population'>");
            $(th).addClass('initial-th-' + that.uniquePrefix);
            $(th).append(colHeader);
            $(thead_tr).append(th);
        });
    };


    this.buildRegular = function (value, tr) {
        var that = this;
        //
        $(this.fieldsArr).each(function (i, colName) {
            var td = $('<td>');
            //
            if (colName === that.modalPreviewCol) {
                that.setModalPreview(td, value, colName);
            } else {
                td.append("" + value[colName]);
            }
            //
            $(td).addClass(that.EDIT);
            td.data('_id', value._id);
            td.data('col', colName);
            td.data('value', value[colName]);
            $(tr).append(td);
        });
    };


    this.monitorLastRowVisible = function (uniquePrefix, that) {
        if (this.canEdit === false) {
            return;
        }

        var last_tr = '.last-tr-' + uniquePrefix;
        var last_tr_invert = '.last-tr-invert-' + uniquePrefix;

        var id = setInterval(function () {

            if (exists(last_tr) && $(last_tr).is(':visible')) {
                console.log("CHECKING", last_tr);

                if (scrolledToView(last_tr) && $(last_tr).is(':visible')) {
                    console.log('_________VISIBLE_________NORMAL', last_tr);
                    $(last_tr).removeClass('last-tr-' + uniquePrefix);
                    that.calcOffset(uniquePrefix, false);
                }
            }

            if (exists(last_tr_invert) && $(last_tr_invert).is(':visible')) {
                console.log("CHECKING", last_tr_invert);
                if (scrolledToView(last_tr_invert) && $(last_tr_invert).is(':visible')) {
                    console.log('_________VISIBLE_________INVERT', last_tr_invert);
                    $(last_tr_invert).removeClass('last-tr-invert-' + uniquePrefix);
                    that.calcOffset(uniquePrefix, true);
                }
            }

        }, 1000);
    };


    this.calcOffset = function (uniquePrefix, invert) {
        this.offset += this.searchOptions._limit;
        this.limit = this.offset;
        this.searchOptions._skip = this.offset;

        if (invert) {
            var tbody = $(this.template).find('tbody');
            $(tbody).empty(); //important
            this.buildTable();
        }

        if (!invert) {
            this.buildTable();
        }

    };


    this.markLastRow = function (elem, arr, i, _class) {
        if (arr.length === (i + 1)) {
            $(elem).addClass(_class);
        }
    };

    this.setModalPreviewPop = function (td, popObj, colName) {
        var a = $("<a class='admin-modal-preview'>" + popObj[colName] + "</a>");
        $(td).append(a);
        $(td).find('.admin-modal-preview').data('_id', popObj._id);
        $(td).find('.admin-modal-preview').data('rest', this.modalPreviewColPop[colName]);
    };

    this.setModalPreview = function (td, value, colName) {
        var a = $("<a class='admin-modal-preview'>" + value[colName] + "</a>");
        $(td).append(a);
        $(td).find('.admin-modal-preview').data('_id', value._id);
        $(td).find('.admin-modal-preview').data('rest', this.REST);
    };


    this.findMaxTdInTr = function () {
        var trArr = $("."+this.uniquePrefix + "-tbody-tr");
        var max = 0;
        for (var i = 0; i < trArr.length; i++) {
            var ammount = $(trArr[i]).children('td').length;
            ammount > max ? max = ammount : max;
        }
        max > this.maxTDinTR ? this.maxTDinTR = max : undefined;
        return this.maxTDinTR;
    };

    this.EDIT = "" + this.uniquePrefix + "-" + "my-table-basic-edit";
    this.CREATE = this.uniquePrefix + "-" + "table-basic-add-new-btn";

    //This is launched only once uppon instantiation of class
    this.setListeners = function () {
        var that = this;
        //
        if (canEdit === false) {
            return;
        }
        //
        $(document).ready(function () {
            //=============
            $('body').on('click', "." + that.EDIT, function () {
                that.edit($(this).data('_id'), $(this).data('col'), $(this).data('value'));
            });

            $('body').on('click', "#" + that.CREATE, function () {
                that.create();
            });
            //=============

            $('body').on('mouseover', "." + that.EDIT, function () {
                $("." + that.EDIT).css('cursor', "url('images/edit.png'), auto");
            });

            //=============

            $('body').on('click', ".th-" + that.uniquePrefix, function () {
                that.sort(this);
            });

            $('body').on('mouseover', ".th-" + that.uniquePrefix, function () {
                var colName = $(this).attr('col');
                var path;
                that.sort_map[colName] === 'asc' ? path = 'images/sort-asc.png' : path = 'images/sort-desc.png';
                $(this).css('cursor', "url(" + path + "), auto");
            });
            //=============

        });
    };


    this.sort_asc = true;
    this.sort_map = {};

    this.sort = function (thiss) {
        var colName = $(thiss).attr('col');

        if (this.sort_map[colName] === 'asc') {
            this.sort_map[colName] = 'desc';
        } else {
            this.sort_map[colName] = 'asc';
            colName = "-" + colName;
        }

        this.searchOptions['_sort'] = colName;
        this.show(true);
    };

    //#Static
    Table.buildComboRest = function (rest, searchParams, colName, cb) {
        rest.find(_find(searchParams), function (data, textStatus, jqXHR) {
            var select = $('<select></select>');
            $(data).each(function (index, obj) {
                var option = $('<option value="' + obj[colName] + '">' + obj[colName] + "</option>");
                $(select).append(option);
            });
            cb(select);
        });
    };

    //#Static
    Table.buildComboManual = function (arr, cb) {
        var select = $('<select></select>');
        $(arr).each(function (index, item) {
            var option = $('<option value="' + item + '">' + item + "</option>");
            $(select).append(option);
        });
        cb(select);
    };

    this.addSelectOptions = function (arr, colName) {
        var that = this;
        Table.buildComboManual(arr, function (elem) {
            that.newElemMap[colName] = elem;
        });
    };

    this.addSelectOptionsRest = function (rest, searchParams, colName) {
        var that = this;
        Table.buildComboRest(rest, searchParams, colName, function (elem) {
            that.newElemMap[colName] = elem;
        });
    };

    this.create = function () {
        var that = this;
        var updateSettings = {};
        this.buildCreateInput(function (input) {
            showInputModalB("Create new", "", input, 'sm', function (modalInput) {
                if (!modalInput) {
                    return;
                }
                $(that.fieldsArr).each(function (i, colName) {

                    if (modalInput.find("#" + colName).is('input')) {
                        updateSettings[colName] = modalInput.find("#" + colName).val();
                    } else if (modalInput.find("#" + colName).is('div')) {
                        //
                        if (modalInput.find("#" + colName).children('.special-input').length > 0) {
                            updateSettings[colName] = modalInput.find("#" + colName).find('select').val();
                        }
                    }

                    console.log("settings: ", updateSettings);
                });
                //
                that.REST.create(updateSettings, function (data, textStatus, jqXHR) {
                    console.log("create entity:", data);
                    that.show(true);
                });
            });
        });
    };

    this.buildCreateInput = function (cb) {
        var that = this;
        var form = $("<form class='table-basic-auto-create-form'>");
        $(this.fieldsArr).each(function (i, colName) {
            //
            $(form).append("<p>" + that.headers[i] + "</p>");
            //
            if (that.newElemMap[colName]) {
                var specialInput = $("<div id='" + colName + "'></div>");
                $(that.newElemMap[colName]).addClass('special-input');
                $(specialInput).append(that.newElemMap[colName]);
                $(form).append(specialInput);
            } else {
                $(form).append("<input type='text' id='" + colName + "'>");
            }
            //
        });
        cb(form);
    };


    this.delete = function (_id) {
        var that = this;
        showConfirmModal("OBS!", "Bekräfta handling", 'sm', 'error', function (yes) {
            if (!yes) {
                return;
            }

            that.REST.delete(_id, function (data, textStatus, jqXHR) {
                that.SHOW_INVERT = false;
                that.SHOW_NORMAL = false;
                that.show();
            });

        });
    };

    this.edit = function (_id, colName, value) {
        var that = this;
        //
        var updateSetting = {};
        var input;
        //
        if (that.newElemMap[colName]) {
            $(that.newElemMap[colName]).addClass('special-input');
            input = that.newElemMap[colName];
        } else {
            input = $("<input type='text' class='text-input' value='" + value + "'>");
        }
        //
        //
        showCrudEditDeleteModal("Edit/Delete", "", input, 'sm', function (modalInput) {
            //
            if (modalInput === false) {
                return;
            }
            //
            if (modalInput === 'delete') {
                that.delete(_id);
                return;
            }
            //
            var input;
            //
            if (modalInput.find('.special-input').length === 1) {
                input = modalInput.find('.special-input').val();
            } else {
                input = $(modalInput).find('.text-input').val();
            }
            //
            updateSetting[colName] = input;
            //
            if (input) {
                that.REST.update(_id, updateSetting, function (data, textStatus, jqXHR) {
                    that.show(true);
                });
            }
            //
        });
    };


    this.setTableTitle = function () {
        var h3 = $(this.template).find('#table-title');
        $(h3).addClass(this.uniquePrefix + "-table-title");
        $(h3).text(this.tableTitle);
    };


    this.mapHeadersAndFields = function () {
        var that = this;

        $(this.headers).each(function (index, value) {
            that.headersFieldsMap[value] = that.fieldsArr[index];
        });
    };

    this.buildTableHeaders = function () {
        var that = this;
        var thead_tr = $(this.template).find('#thead-tr');

        $(this.headers).each(function (index, value) {
            var th = $("<th class=th-" + that.uniquePrefix + ">");
            $(th).addClass('initial-th-' + that.uniquePrefix);
            var col = that.headersFieldsMap[value];
            $(th).attr('col', col);
            $(th).append(value);
            $(thead_tr).append(th);
        });
    };

    this.loadTemplateBasic = function () {
        this.template = $(loadTemplate("templates/admin/basic/tableBasic.html"));
    };

    this.setListeners();
    this.monitorLastRowVisible(this.uniquePrefix, this);

    //==========================================================================
    //==========================================================================

    this.showInvert = function () {
        var that = this;
        //
        this.showNormal();
        //
        $('.admin-show-items').css('display', 'none');
        //
        this.ready(function (res) {
            that.transformTable();
        });
    };

    this.ready = function (cb) {
        $(document).on('DOMNodeInserted', '.table-ready', function () {
            console.log("DOMNodeInserted: Building invert");
            cb(true);
        });
    };

    this.buildHeadersArr = function () {
        var th_arr = $('th');
        var th_arr_b = [];
        $(th_arr).each(function (x, th) {
            th_arr_b.push(th);
        });
        return th_arr_b;
    };

    this.table_invert;
    
    this.transformTable = function () {
        var that = this;
        //
        var td_inverts_len = $('.' + this.uniquePrefix + '-invert-table>').children().length;
        //
        if (td_inverts_len === 0) {
            table_invert = $("<div class='table-show-invert " + this.uniquePrefix + "-invert-table'>");
        } else {
//            table_invert = $('.' + this.uniquePrefix + '-invert-table>');
//            console.log("Second: table_invert:",table_invert);
        }
        //
        var th_arr = $('.initial-th-' + this.uniquePrefix);
        //
        if (this.maxTDinTR === 0) {
            this.addTitleInvert();
            return;
        }
        //
        var tr_arr = $("."+this.uniquePrefix + "-tbody-tr");
        //
        $(tr_arr).each(function (i, tr) {
            var table_invert_entry = $("<div class='table-invert-entry'></div>");
            var td_arr = $(tr).children('td');

            $(th_arr).each(function (x, th) {
                var row_invert = $("<div class='row-invert'></div>");
                //
                var th_clone = th.cloneNode(true);
                $(th_clone).removeClass('initial-th-' + that.uniquePrefix); // OBS!
                $(row_invert).append(th_clone);
                //
                var td = $(td_arr[x]);
                $(td).addClass(that.uniquePrefix + '-td-invert');
                $(row_invert).append(td);
                //
                $(table_invert_entry).append(row_invert);
                $(table_invert).append(table_invert_entry);
                //
                //
                if (x === 0) {
                    that.markLastRow(row_invert, tr_arr, i, 'last-tr-invert-' + that.uniquePrefix);
                }
                //
            });

        });
        
        // only at first attempt
        if (td_inverts_len === 0) {
            $(containerId).append(table_invert);
             console.log("First: table_invert:",table_invert);

            var addNewBtn = $(".add-new-btn");
            that.canEdit ? $(containerId).prepend(addNewBtn) : undefined;
            
            this.addTitleInvert();
        }
        //
        this.removeEmptyRowsPopulation();
        //
    };
    
    

    this.addTitleInvert = function () {
        var title = $("." + this.uniquePrefix + "-table-title");
        $(containerId).prepend(title);
    };

    this.removeEmptyRowsPopulation = function () {
        var td_empty_arr = $('.empty');

        $(td_empty_arr).each(function (i, td_empty) {
            $(td_empty).parent().remove();
        });

    };

    //==========================================================================

    function scrolledToView(selector) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();
        var elemTop = $(selector).offset().top;
        var elemBottom = elemTop + $(selector).height();
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    function exists(selector) {
        if ($(selector).length) {
            return true;
        } else {
            return false;
        }
    }


}
